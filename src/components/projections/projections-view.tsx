'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { InsuranceList } from "../insurance"
import { ProjectionChart } from "../charts/projection-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Timeline } from "../timeline"
import { useAllocations, useEvents, useInsurances } from "@/hooks/useAllocations"
import { useSimulations, useSimulationVersions, useProjection, useCreateSimulation } from "@/hooks/useSimulations"
import { useState, useEffect } from "react"

interface ProjectionsViewProps {
  preSelectedSimulationId?: number | null
}

export function ProjectionsView({ preSelectedSimulationId }: ProjectionsViewProps = {}) {
  const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)
  const [lifeStatus, setLifeStatus] = useState<"Vivo" | "Morto" | "Inválido">("Vivo")
  const [activeView, setActiveView] = useState("chart")
  const [activeScenario, setActiveScenario] = useState<"original" | "current" | "optimized">("current")
  const [showAllVersions, setShowAllVersions] = useState(false)

  // Buscar dados do backend
  const { data: simulations, isLoading: loadingSimulations } = useSimulations()
  const { data: versions, isLoading: loadingVersions } = useSimulationVersions(selectedSimulationId || 0)
  const { data: backendProjectionData, isLoading: loadingProjection } = useProjection(selectedSimulationId || 0, lifeStatus)
  
  // Debug: verificar quando há múltiplas versões
  if (versions && versions.length > 1) {
    console.log('🔍 Simulação com múltiplas versões:', {
      simulationId: selectedSimulationId,
      simulationName: simulations?.find(s => s.id === selectedSimulationId)?.name,
      versions: versions.map(v => ({ id: v.id, isCurrent: v.isCurrent, createdAt: v.createdAt })),
      totalVersions: versions.length,
      currentVersion: versions.find(v => v.isCurrent)?.id,
      selectedVersion: selectedVersionId
    })
  }
  const { data: allocations } = useAllocations(selectedVersionId || 0)
  const { data: events } = useEvents(selectedVersionId || 0)
  const { data: insurances } = useInsurances(selectedVersionId || 0)
  
  // Mutations
  const createSimulationMutation = useCreateSimulation()

  // Reagir à simulação pré-selecionada
  useEffect(() => {
    if (preSelectedSimulationId && preSelectedSimulationId !== selectedSimulationId) {
      setSelectedSimulationId(preSelectedSimulationId)
      setSelectedVersionId(null) // Reset version selection
      setActiveScenario("current")
    }
  }, [preSelectedSimulationId, selectedSimulationId])

  // Funções para lidar com cenários
  const handleScenarioChange = (scenario: "original" | "current" | "optimized") => {
    setActiveScenario(scenario)
    
    if (scenario === "original") {
      // Buscar primeira versão (plano original)
      const originalVersion = versions?.find(v => !v.isCurrent) || versions?.[0]
      if (originalVersion) setSelectedVersionId(originalVersion.id)
    } else if (scenario === "current") {
      // Buscar versão atual
      const currentVersion = versions?.find(v => v.isCurrent) || versions?.[0]
      if (currentVersion) setSelectedVersionId(currentVersion.id)
    } else if (scenario === "optimized") {
      // Para o cenário otimizado, mantemos a versão atual
      // mas podemos adicionar lógica de otimização futura
      const currentVersion = versions?.find(v => v.isCurrent) || versions?.[0]
      if (currentVersion) setSelectedVersionId(currentVersion.id)
    }
  }

  const handleAddSimulation = async () => {
    const newSimulationName = prompt("Nome da nova simulação:")
    if (newSimulationName && newSimulationName.trim()) {
      try {
        const newSimulation = await createSimulationMutation.mutateAsync({ name: newSimulationName.trim() })
        // Selecionar a nova simulação automaticamente
        setSelectedSimulationId(newSimulation.id)
        setSelectedVersionId(null) // Reset version selection
        setActiveScenario("current")
      } catch (error) {
        console.error("Erro ao criar simulação:", error)
        alert("Erro ao criar simulação. Tente novamente.")
      }
    }
  }



  // Selecionar a primeira simulação automaticamente (apenas se não há pré-seleção)
  const firstSimulation = simulations?.[0]
  if (firstSimulation && !selectedSimulationId && !preSelectedSimulationId) {
    setSelectedSimulationId(firstSimulation.id)
  }

  // Selecionar a versão atual automaticamente
  const currentVersion = versions?.find(v => v.isCurrent) || versions?.[0]
  if (currentVersion && !selectedVersionId) {
    setSelectedVersionId(currentVersion.id)
  }

  // Dados mockados baseados no Figma
  const projectionData = {
    totalPatrimony: 2679930.00,
    realRate: 4.0, // 4% a.a.
    years: {
      "25 anos": 2179530000,
      "30 anos": 3173880000,
      "35 anos": 0 // vazio no figma
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com seletor de cliente */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Select 
            value={selectedSimulationId?.toString() || ""} 
            onValueChange={(value) => setSelectedSimulationId(Number(value))}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={loadingSimulations ? "Carregando..." : "Selecione uma simulação"} />
            </SelectTrigger>
            <SelectContent>
              {simulations?.map((simulation) => (
                <SelectItem key={simulation.id} value={simulation.id.toString()}>
                  {simulation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {versions && versions.length > 1 && (
            <>
              <span className="text-xs text-muted-foreground hidden sm:inline">Versão:</span>
              <Select 
                value={selectedVersionId?.toString() || ""} 
                onValueChange={(value) => setSelectedVersionId(Number(value))}
              >
                <SelectTrigger className="w-20 sm:w-24">
                  <SelectValue placeholder="V1" />
                </SelectTrigger>
                <SelectContent>
                  {versions
                    ?.sort((a, b) => {
                      // Ordenar: versão atual primeiro, depois por data de criação
                      if (a.isCurrent && !b.isCurrent) return -1
                      if (!a.isCurrent && b.isCurrent) return 1
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    })
                    .map((version, index) => (
                      <SelectItem key={version.id} value={version.id.toString()}>
                        {version.isCurrent ? "Atual" : `V${versions.length - index}`}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        
        {/* Indicador do cenário ativo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Visualizando:</span>
          <Badge variant={activeScenario === "current" ? "default" : "secondary"} className="text-xs">
            {activeScenario === "original" && "Plano Original"}
            {activeScenario === "current" && "Situação Atual"}
            {activeScenario === "optimized" && "Cenário Otimizado"}
          </Badge>
        </div>
      </div>

      {/* Cards de patrimônio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-blue-600/20 border-blue-600">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-sm sm:text-base text-blue-400 mb-1">R$ 2.679.930,00</div>
            <div className="text-xs text-muted-foreground">Financeiro Atual M1</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(projectionData.totalPatrimony)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-600/20 border-purple-600">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-sm sm:text-base text-purple-400">R$ 3.173.880,00 78,29%</div>
            <div className="text-xs text-muted-foreground">Projeção 30 anos</div>
            <div className="text-xs text-muted-foreground">30 anos</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-600/20 border-gray-600">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-sm sm:text-base text-gray-400">R$ 0</div>
            <div className="text-xs text-muted-foreground">Imobilizado</div>
            <div className="text-xs text-muted-foreground">65 anos</div>
          </CardContent>
        </Card>
      </div>

      {/* Status de vida */}
      <div className="flex flex-wrap gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <input 
            type="radio" 
            id="vivo" 
            name="status" 
            checked={lifeStatus === "Vivo"}
            onChange={() => setLifeStatus("Vivo")}
          />
          <label htmlFor="vivo" className="text-sm">Vivo</label>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="radio" 
            id="morto" 
            name="status" 
            checked={lifeStatus === "Morto"}
            onChange={() => setLifeStatus("Morto")}
          />
          <label htmlFor="morto" className="text-sm">Morto</label>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="radio" 
            id="invalido" 
            name="status" 
            checked={lifeStatus === "Inválido"}
            onChange={() => setLifeStatus("Inválido")}
          />
          <label htmlFor="invalido" className="text-sm">Inválido</label>
        </div>
      </div>

      {/* Gráfico de projeção */}
      <Card>
        <CardHeader>
          <CardTitle>Projeção Patrimonial</CardTitle>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">Ver como tabela</span>
            <span className="text-sm text-muted-foreground">Ver como linha</span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ProjectionChart 
            data={backendProjectionData || []} 
            lifeStatus={lifeStatus} 
            showComparison={activeView === "detailed"}
            activeScenario={activeScenario}
          />
        </CardContent>
      </Card>

      {/* Controles do gráfico */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-0">
        <Button 
          variant={activeScenario === "original" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleScenarioChange("original")}
          disabled={!versions || versions.length === 0}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          <Badge className="bg-blue-600 mr-1 sm:mr-2 w-2 h-2 sm:w-3 sm:h-3 p-0">●</Badge>
          <span className="hidden sm:inline">Plano Original</span>
          <span className="sm:hidden">Original</span>
        </Button>
        <Button 
          variant={activeScenario === "current" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleScenarioChange("current")}
          disabled={!versions || versions.length === 0}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          <span className="hidden sm:inline">Situação atual (05/2024)</span>
          <span className="sm:hidden">Atual</span>
        </Button>
        <Button 
          variant={activeScenario === "optimized" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleScenarioChange("optimized")}
          disabled={!versions || versions.length === 0}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          Otimizado
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleAddSimulation}
          disabled={createSimulationMutation.isPending}
          className="text-xs sm:text-sm px-2 sm:px-4"
        >
          <span className="hidden sm:inline">
            {createSimulationMutation.isPending ? "Criando..." : "Adicionar Simulação"}
          </span>
          <span className="sm:hidden">
            {createSimulationMutation.isPending ? "..." : "+"}
          </span>
        </Button>
      </div>

      {/* Timeline */}
      <Timeline 
        projectionData={backendProjectionData || []}
        lifeStatus={lifeStatus}
      />

      {/* Movimentações */} 
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <span>Herança</span>  
                <span className="text-green-400">R$ 200.000</span>
              </div>
              <div className="text-xs text-muted-foreground">26/01/23 - 25/01/23</div>
              <div className="text-xs text-muted-foreground">Frequência Única</div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <span>Custo do Filho</span>
                <span className="text-red-400">R$ 5.000</span>
              </div>
              <div className="text-xs text-muted-foreground">26/01/23 - 25/01/43</div>
              <div className="text-xs text-muted-foreground">Frequência Mensal</div>
            </div>

            <div className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <span>Comissão</span>
                <span className="text-green-400">R$ 500.000</span>
              </div>
              <div className="text-xs text-muted-foreground">26/01/23 - 25/01/23</div>
              <div className="text-xs text-muted-foreground">Frequência Anual</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seguros */}
      <InsuranceList versionId={selectedVersionId || 0} />
    </div>
  )
}