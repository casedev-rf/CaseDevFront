'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectionChart } from "../charts/projection-chart"
import { formatCurrency } from "@/lib/utils"
import { useSimulations, useSimulationVersions, useProjection } from "@/hooks/useSimulations"
import { useAllocations, useEvents, useInsurances } from "@/hooks/useAllocations"

export function ProjectionsView() {
  const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)
  const [lifeStatus, setLifeStatus] = useState<"Vivo" | "Morto" | "Inválido">("Vivo")
  const [activeView, setActiveView] = useState("chart")

  // Buscar dados do backend
  const { data: simulations, isLoading: loadingSimulations } = useSimulations()
  const { data: versions, isLoading: loadingVersions } = useSimulationVersions(selectedSimulationId || 0)
  const { data: backendProjectionData, isLoading: loadingProjection } = useProjection(selectedSimulationId || 0, lifeStatus)
  const { data: allocations } = useAllocations(selectedVersionId || 0)
  const { data: events } = useEvents(selectedVersionId || 0)
  const { data: insurances } = useInsurances(selectedVersionId || 0)



  // Selecionar a primeira simulação automaticamente
  const firstSimulation = simulations?.[0]
  if (firstSimulation && !selectedSimulationId) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select 
            value={selectedSimulationId?.toString() || ""} 
            onValueChange={(value) => setSelectedSimulationId(Number(value))}
          >
            <SelectTrigger className="w-48">
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
            <Select 
              value={selectedVersionId?.toString() || ""} 
              onValueChange={(value) => setSelectedVersionId(Number(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Versão" />
              </SelectTrigger>
              <SelectContent>
                {versions?.map((version) => (
                  <SelectItem key={version.id} value={version.id.toString()}>
                    {version.isCurrent ? "Atual" : `V${version.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Cards de patrimônio */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-600/20 border-blue-600">
          <CardContent className="pt-6">
            <div className="text-sm text-blue-400 mb-1">R$ 2.679.930,00</div>
            <div className="text-xs text-muted-foreground">Financeiro Atual M1</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(projectionData.totalPatrimony)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-600/20 border-purple-600">
          <CardContent className="pt-6">
            <div className="text-sm text-purple-400">R$ 3.173.880,00 78,29%</div>
            <div className="text-xs text-muted-foreground">Projeção 30 anos</div>
            <div className="text-xs text-muted-foreground">30 anos</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-600/20 border-gray-600">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400">R$ 0</div>
            <div className="text-xs text-muted-foreground">Imobilizado</div>
            <div className="text-xs text-muted-foreground">65 anos</div>
          </CardContent>
        </Card>
      </div>

      {/* Status de vida */}
      <div className="flex gap-4">
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
        <CardContent>
          <ProjectionChart 
            data={backendProjectionData || []} 
            lifeStatus={lifeStatus} 
            showComparison={activeView === "detailed"}
          />
        </CardContent>
      </Card>

      {/* Controles do gráfico */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" size="sm">
          <Badge className="bg-blue-600">●</Badge>
          Plano Original
        </Button>
        <Button variant="outline" size="sm">
          Situação atual (05/2024)
        </Button>
        <Button variant="outline" size="sm">
          Otimizado
        </Button>
        <Button variant="outline" size="sm">
          Adicionar Simulação
        </Button>
      </div>

      {/* Seções inferiores - Timeline, Movimentações, etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-400">CLT R$ 15.000</span>
                <span>Aposentadoria R$ 25.000</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Anos: 2025 - 2030 - 2035 - 2040 - 2045 - 2050 - 2055 - 2060
              </div>
            </div>
          </CardContent>
        </Card>

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
            
            <div className="flex gap-2 mt-4">
              <Button size="sm">Financeira</Button>
              <Button size="sm" variant="outline">Imobilizada</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seguros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seguros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <span>Seguro de Vida Familiar</span>
                <span className="text-purple-400">R$ 500.000</span>
              </div>
              <div className="text-xs text-muted-foreground">Seguro de Vida</div>
              <div className="text-xs text-muted-foreground">Duração: 120 meses</div>
              <div className="text-xs text-muted-foreground">Prêmio: R$ 500 - Mensal</div>
            </div>

            <div className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <span>Seguro de Invalidez</span>
                <span className="text-purple-400">R$ 100.000</span>
              </div>
              <div className="text-xs text-muted-foreground">Seguro de Invalidez</div>
              <div className="text-xs text-muted-foreground">Duração: 5 anos</div>
              <div className="text-xs text-muted-foreground">Prêmio: R$ 50 - Mensal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}