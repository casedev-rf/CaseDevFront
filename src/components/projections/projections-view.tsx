'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { InsuranceList } from "../insurance"
import { ProjectionChart } from "../charts/projection-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Timeline } from "../timeline"
import { useAllocations, useEvents, useInsurances } from "@/hooks/useAllocations"
import { useSimulations, useSimulationVersions, useProjection, useCreateSimulation, useCreateCurrentSituation } from "@/hooks/useSimulations"
import { useCreateEvent, useUpdateEvent } from "@/hooks/useAllocations"
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
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [showOptimizedModal, setShowOptimizedModal] = useState(false)
  
  // Estados do formulário de evento
  const [eventForm, setEventForm] = useState({
    type: '',
    value: '',
    frequency: 'única' as 'única' | 'mensal' | 'anual',
    startDate: '',
    endDate: ''
  })

  // Buscar dados do backend
  const { data: simulations, isLoading: loadingSimulations } = useSimulations()
  const { data: versions, isLoading: loadingVersions } = useSimulationVersions(selectedSimulationId || 0)
  const { data: backendProjectionData, isLoading: loadingProjection } = useProjection(selectedSimulationId || 0, lifeStatus)
  
  // Debug: verificar dados da projeção
  console.log('🔍 Debug Projeção:', {
    selectedSimulationId,
    selectedVersionId,
    lifeStatus,
    backendProjectionData,
    loadingProjection,
    simulationsCount: simulations?.length || 0,
    versionsCount: versions?.length || 0
  })

  // Debug: verificar mudanças no lifeStatus
  console.log('👤 Status de Vida:', lifeStatus)
  console.log('📊 Dados da projeção (primeiros 5 anos):', 
    backendProjectionData?.slice(0, 5).map(d => ({
      year: d.year,
      totalPatrimony: d.totalPatrimony,
      financialPatrimony: d.financialPatrimony
    }))
  )

  // Debug específico para diferentes status
  if (backendProjectionData && backendProjectionData.length > 10) {
    const year10 = backendProjectionData[10] // 2035
    const year20 = backendProjectionData[20] // 2045  
    const year30 = backendProjectionData[30] // 2055
    
    console.log(`💰 Comparação por Status (${lifeStatus}):`, {
      '2035 (10 anos)': formatCurrency(year10.totalPatrimony),
      '2045 (20 anos)': formatCurrency(year20.totalPatrimony), 
      '2055 (30 anos)': formatCurrency(year30.totalPatrimony),
      'Crescimento 10-30 anos': year30.totalPatrimony > year10.totalPatrimony ? '📈 Cresceu' : '📉 Caiu'
    })
  }


  
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

  // Estratégias de otimização disponíveis
  const optimizationStrategies = [
    {
      id: 1,
      name: "Diversificação de Portfólio",
      description: "Realocação para investimentos de maior rentabilidade",
      impact: "+25% no patrimônio total em 36 anos",
      projectedGain: 2500000,
      riskLevel: "Médio",
      timeToImplement: "3-6 meses",
      category: "Alocação",
      details: [
        "40% Renda Fixa Premium (12% a.a.)",
        "35% Ações diversificadas (15% a.a.)",
        "15% Fundos Imobiliários (13% a.a.)",
        "10% Investimentos alternativos (18% a.a.)"
      ]
    },
    {
      id: 2,
      name: "Otimização Tributária",
      description: "Estruturação fiscal para redução de impostos",
      impact: "+15% no patrimônio líquido",
      projectedGain: 1200000,
      riskLevel: "Baixo",
      timeToImplement: "1-3 meses",
      category: "Fiscal",
      details: [
        "Holding patrimonial para imóveis",
        "Previdência privada PGBL/VGBL",
        "Investimentos isentos (LCI/LCA)",
        "Planejamento sucessório"
      ]
    },
    {
      id: 3,
      name: "Proteção Patrimonial Avançada",
      description: "Seguros e blindagem patrimonial otimizados",
      impact: "+8% em cenários adversos",
      projectedGain: 800000,
      riskLevel: "Baixo",
      timeToImplement: "1-2 meses",
      category: "Proteção",
      details: [
        "Seguro de vida otimizado",
        "Seguro D&O personalizado",
        "Estrutura de blindagem patrimonial",
        "Seguros específicos por ativo"
      ]
    },
    {
      id: 4,
      name: "Geração de Renda Passiva",
      description: "Criação de fluxos de renda consistentes",
      impact: "+R$ 50.000/mês em renda passiva",
      projectedGain: 1800000,
      riskLevel: "Médio",
      timeToImplement: "6-12 meses",
      category: "Renda",
      details: [
        "FIIs de alta qualidade",
        "Ações com dividendos consistentes",
        "Debêntures incentivadas",
        "Fundos de crédito privado"
      ]
    }
  ]

  // Debug detalhado dos eventos para entender o impacto
  console.log('🎯 ANÁLISE DOS EVENTOS CADASTRADOS:', {
    'Total de eventos': events?.length || 0,
    'Eventos detalhados': events?.map(event => ({
      tipo: event.type,
      valor: formatCurrency(event.value),
      frequencia: event.frequency,
      dataInicio: event.startDate,
      dataFim: event.endDate,
      'Impacto anual estimado': event.frequency === 'mensal' 
        ? formatCurrency(event.value * 12)
        : event.frequency === 'anual' 
        ? formatCurrency(event.value)
        : formatCurrency(event.value) + ' (única vez)'
    })),
    'Status atual': lifeStatus,
    'Simulação ID': selectedSimulationId,
    'Versão ID': selectedVersionId
  })

  // Análise específica do impacto dos eventos por tipo
  if (events && events.length > 0) {
    const entradasAnuais = events
      .filter(e => e.type === 'entrada' || e.type === 'herança' || e.type === 'comissão')
      .reduce((total, e) => {
        const valor = e.frequency === 'mensal' ? e.value * 12 : 
                      e.frequency === 'anual' ? e.value : 0
        return total + valor
      }, 0)
    
    const saidasAnuais = events
      .filter(e => e.type === 'saída' || e.type === 'custo' || e.type === 'aposentadoria')
      .reduce((total, e) => {
        const valor = e.frequency === 'mensal' ? e.value * 12 : 
                      e.frequency === 'anual' ? e.value : 0
        return total + valor
      }, 0)

    console.log('💡 DIAGNÓSTICO DO PROBLEMA:', {
      'Entradas anuais totais': formatCurrency(entradasAnuais),
      'Saídas anuais totais': formatCurrency(saidasAnuais),
      'Diferença líquida anual': formatCurrency(entradasAnuais - saidasAnuais),
      '🔍 POSSÍVEL CAUSA': entradasAnuais === 0 
        ? '❌ NÃO HÁ ENTRADAS - Status "Morto/Inválido" não terá impacto diferente!'
        : '✅ Há entradas - Status deveria impactar o cálculo',
      'Impacto esperado Morto': `Entradas: R$ 0 (era ${formatCurrency(entradasAnuais)}) | Saídas: ${formatCurrency(saidasAnuais/2)} (era ${formatCurrency(saidasAnuais)})`,
      'Impacto esperado Inválido': `Entradas: R$ 0 (era ${formatCurrency(entradasAnuais)}) | Saídas: ${formatCurrency(saidasAnuais)} (normal)`
    })
  }
  
  // Mutations
  const createSimulationMutation = useCreateSimulation()
  const createCurrentSituation = useCreateCurrentSituation()
  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()

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
      // Abrir modal de estratégias de otimização
      setShowOptimizedModal(true)
      // Manter a versão atual para comparação
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

  const handleCreateCurrentSituation = async () => {
    if (!selectedSimulationId) {
      alert("Selecione uma simulação primeiro!")
      return
    }
    
    try {
      // Se não tem versões, criar a primeira versão diretamente
      if (!versions || versions.length === 0) {
        // Usar o hook de criar versão em vez de situação atual
        const versionData = {
          simulationId: selectedSimulationId,
          status: "Vivo" as const,
          startDate: new Date().toISOString(),
          realRate: 4.5,
          isCurrent: true
        }
        
        // Vamos usar o fetch diretamente para criar a primeira versão
        const response = await fetch('http://localhost:3001/simulation-versions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(versionData)
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        alert("✅ Primeira versão criada! Agora você pode adicionar alocações e eventos.")
      } else {
        // Se já tem versões, tentar criar situação atual
        await createCurrentSituation.mutateAsync(selectedSimulationId)
        alert("✅ Nova situação atual criada!")
      }
      
      // Refresh para mostrar a nova versão
      window.location.reload()
    } catch (error: any) {
      console.error("Erro ao inicializar simulação:", error)
      alert("❌ Erro ao inicializar simulação: " + (error?.message || "Erro desconhecido"))
    }
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setEventForm({
      type: event.type,
      value: event.value.toString(),
      frequency: event.frequency,
      startDate: event.startDate.split('T')[0], // Converter para formato date input
      endDate: event.endDate ? event.endDate.split('T')[0] : ''
    })
    setShowEventModal(true)
  }

  const handleSaveEvent = async () => {
    if (!selectedVersionId) {
      alert("Nenhuma versão selecionada!")
      return
    }

    if (!eventForm.type || !eventForm.value || !eventForm.startDate) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    try {
      const eventData = {
        type: eventForm.type,
        value: parseFloat(eventForm.value),
        frequency: eventForm.frequency,
        startDate: new Date(eventForm.startDate).toISOString(),
        endDate: eventForm.endDate ? new Date(eventForm.endDate).toISOString() : undefined
      }

      if (editingEvent) {
        // Atualizar evento existente
        await updateEventMutation.mutateAsync({ 
          id: editingEvent.id, 
          data: eventData 
        })
        alert("✅ Evento atualizado com sucesso!")
      } else {
        // Criar novo evento
        await createEventMutation.mutateAsync({ 
          versionId: selectedVersionId!, 
          data: eventData 
        })
        alert("✅ Evento criado com sucesso!")
      }

      // Resetar formulário e fechar modal
      setEventForm({
        type: '',
        value: '',
        frequency: 'única',
        startDate: '',
        endDate: ''
      })
      setEditingEvent(null)
      setShowEventModal(false)
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
      alert("❌ Erro ao salvar evento. Tente novamente.")
    }
  }

  const handleCloseEventModal = () => {
    setShowEventModal(false)
    setEditingEvent(null)
    setEventForm({
      type: '',
      value: '',
      frequency: 'única',
      startDate: '',
      endDate: ''
    })
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

  // Calcular dados dos cards baseado na projeção real
  const getCardData = () => {
    if (!backendProjectionData || backendProjectionData.length === 0) {
      return {
        currentFinancial: 0,
        projection30Years: 0,
        immobilized: 0,
        isLoading: loadingProjection
      }
    }

    // Dados atuais (primeiro ano - 2025)
    const currentYear = backendProjectionData[0]
    
    // Projeção de 30 anos (ano 2055, que é índice 30)
    const projection30Index = backendProjectionData.findIndex(data => data.year === 2055)
    const projection30 = projection30Index >= 0 ? backendProjectionData[projection30Index] : null
    
    return {
      currentFinancial: currentYear?.financialPatrimony || 0,
      projection30Years: projection30?.totalPatrimony || 0,
      immobilized: currentYear?.immobilizedPatrimony || 0,
      isLoading: false
    }
  }

  const cardData = getCardData()

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
            <div className="text-sm sm:text-base text-blue-400 mb-1">
              {cardData.isLoading ? (
                <div className="animate-pulse bg-blue-400/20 h-4 w-24 rounded"></div>
              ) : (
                formatCurrency(cardData.currentFinancial)
              )}
            </div>
            <div className="text-xs text-muted-foreground">Financeiro Atual</div>
            <div className="text-xs text-muted-foreground">
              {new Date().getFullYear()} - Patrimônio Líquido
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-600/20 border-purple-600">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-sm sm:text-base text-purple-400 mb-1">
              {cardData.isLoading ? (
                <div className="animate-pulse bg-purple-400/20 h-4 w-28 rounded"></div>
              ) : (
                formatCurrency(cardData.projection30Years)
              )}
            </div>
            <div className="text-xs text-muted-foreground">Projeção 30 anos</div>
            <div className="text-xs text-muted-foreground">
              {cardData.isLoading ? (
                <div className="animate-pulse bg-gray-400/20 h-3 w-32 rounded mt-1"></div>
              ) : (
                cardData.currentFinancial > 0 && cardData.projection30Years > 0 
                  ? `${((cardData.projection30Years / cardData.currentFinancial - 1) * 100).toFixed(1)}% crescimento`
                  : 'Baseado nos eventos cadastrados'
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-600/20 border-gray-600">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-sm sm:text-base text-gray-400 mb-1">
              {cardData.isLoading ? (
                <div className="animate-pulse bg-gray-400/20 h-4 w-20 rounded"></div>
              ) : (
                formatCurrency(cardData.immobilized)
              )}
            </div>
            <div className="text-xs text-muted-foreground">Imobilizado</div>
            <div className="text-xs text-muted-foreground">
              {cardData.isLoading ? (
                <div className="animate-pulse bg-gray-400/20 h-3 w-24 rounded mt-1"></div>
              ) : (
                cardData.immobilized > 0 
                  ? 'Bens não líquidos' 
                  : 'Nenhum bem imobilizado'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status de vida */}
      <div className="flex flex-col gap-4">
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
        
        {/* Indicador do impacto do status */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Impacto do status selecionado:</span>
          {lifeStatus === "Vivo" && (
            <span className="ml-2 text-green-400">✓ Entradas e saídas normais</span>
          )}
          {lifeStatus === "Morto" && (
            <span className="ml-2 text-orange-400">⚠️ Sem entradas, saídas reduzidas (50%)</span>
          )}
          {lifeStatus === "Inválido" && (
            <span className="ml-2 text-red-400">❌ Sem entradas, saídas normais</span>
          )}
          {loadingProjection && (
            <span className="ml-2 text-blue-400">🔄 Recalculando projeção...</span>
          )}
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
        
        {/* Botão para criar situação atual - sempre visível quando simulação selecionada */}
        {selectedSimulationId && (
          <Button 
            variant="default" 
            size="sm"
            onClick={handleCreateCurrentSituation}
            disabled={createCurrentSituation.isPending}
            className="text-xs sm:text-sm px-2 sm:px-4 bg-green-600 hover:bg-green-700"
          >
            <span className="hidden sm:inline">
              {createCurrentSituation.isPending ? "Criando..." : versions && versions.length > 0 ? "Nova Versão" : "Criar Primeira Versão"}
            </span>
            <span className="sm:hidden">
              {createCurrentSituation.isPending ? "..." : "✨"}
            </span>
          </Button>
        )}
      </div>

      {/* Timeline */}
      <Timeline 
        projectionData={backendProjectionData || []}
        events={events || []}
        lifeStatus={lifeStatus}
      />

      {/* Movimentações/Eventos */} 
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Movimentações</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowEventModal(true)}
            className="text-xs px-3"
          >
            + Adicionar Evento
          </Button>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{event.type}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            event.type.includes('entrada') || event.type.includes('herança') || event.type.includes('comissão')
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {event.type.includes('entrada') || event.type.includes('herança') || event.type.includes('comissão') ? '+' : '-'}
                            {formatCurrency(event.value)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                          >
                            ✏️
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString('pt-BR')}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('pt-BR')}`}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        Frequência {event.frequency === 'única' ? 'Única' : 
                                    event.frequency === 'mensal' ? 'Mensal' : 'Anual'}
                        {event.type && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {event.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Resumo dos Eventos */}
              <div className="mt-4 pt-3 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">
                      +{formatCurrency(
                        events
                          .filter(e => e.type.includes('entrada') || e.type.includes('herança') || e.type.includes('comissão'))
                          .reduce((sum, e) => sum + e.value, 0)
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Entradas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-semibold">
                      -{formatCurrency(
                        events
                          .filter(e => e.type.includes('saída') || e.type.includes('custo') || e.type.includes('gasto') || e.type.includes('aposentadoria'))
                          .reduce((sum, e) => sum + e.value, 0)
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Saídas</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-2xl mb-2">📅</div>
              <p>Nenhum evento cadastrado</p>
              <p className="text-xs">Clique em "Adicionar Evento" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seguros */}
      <InsuranceList versionId={selectedVersionId || 0} />

      {/* Modal de Criar/Editar Evento */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Editar Evento' : 'Adicionar Novo Evento'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-type" className="text-right">
                Tipo
              </Label>
              <Select value={eventForm.type} onValueChange={(value) => setEventForm({...eventForm, type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saída">Saída</SelectItem>
                  <SelectItem value="herança">Herança</SelectItem>
                  <SelectItem value="comissão">Comissão</SelectItem>
                  <SelectItem value="custo">Custo</SelectItem>
                  <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-value" className="text-right">
                Valor
              </Label>
              <Input
                id="event-value"
                type="number"
                placeholder="0"
                value={eventForm.value}
                onChange={(e) => setEventForm({...eventForm, value: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-frequency" className="text-right">
                Frequência
              </Label>
              <Select value={eventForm.frequency} onValueChange={(value: any) => setEventForm({...eventForm, frequency: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="única">Única</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-start-date" className="text-right">
                Data Início
              </Label>
              <Input
                id="event-start-date"
                type="date"
                value={eventForm.startDate}
                onChange={(e) => setEventForm({...eventForm, startDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-end-date" className="text-right">
                Data Fim
              </Label>
              <Input
                id="event-end-date"
                type="date"
                value={eventForm.endDate || ''}
                onChange={(e) => setEventForm({...eventForm, endDate: e.target.value || ''})}
                className="col-span-3"
                placeholder="Opcional"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEventModal(false)
                setEditingEvent(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveEvent}>
              {editingEvent ? 'Atualizar' : 'Criar'} Evento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Estratégias Otimizadas */}
      <Dialog open={showOptimizedModal} onOpenChange={setShowOptimizedModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              🎯 Estratégias de Otimização Patrimonial
            </DialogTitle>
            <p className="text-sm text-muted-foreground text-center">
              Estratégias personalizadas para maximizar seu patrimônio
            </p>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Resumo do impacto total */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  Potencial de Otimização Total
                </h3>
                <div className="text-3xl font-bold text-white mb-1">
                  +{formatCurrency(optimizationStrategies.reduce((sum, strategy) => sum + strategy.projectedGain, 0))}
                </div>
                <p className="text-sm text-gray-300">
                  Ganho projetado combinando todas as estratégias em 36 anos
                </p>
              </div>
            </div>

            {/* Lista de estratégias */}
            <div className="grid gap-4">
              {optimizationStrategies.map((strategy) => (
                <div key={strategy.id} className="border border-gray-600 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white text-lg">{strategy.name}</h4>
                      <p className="text-sm text-gray-300 mt-1">{strategy.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        {strategy.impact}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatCurrency(strategy.projectedGain)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                    <div>
                      <span className="text-gray-400">Categoria:</span>
                      <div className="font-medium text-blue-300">{strategy.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Risco:</span>
                      <div className={`font-medium ${
                        strategy.riskLevel === 'Baixo' ? 'text-green-400' :
                        strategy.riskLevel === 'Médio' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {strategy.riskLevel}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Implementação:</span>
                      <div className="font-medium text-gray-300">{strategy.timeToImplement}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-medium">Detalhes da estratégia:</span>
                    {strategy.details.map((detail, index) => (
                      <div key={index} className="text-xs text-gray-300 flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-600">
              <Button 
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                onClick={() => {
                  setShowOptimizedModal(false)
                  setActiveScenario("optimized")
                }}
              >
                🚀 Visualizar Cenário Otimizado
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowOptimizedModal(false)
                  alert("📞 Funcionalidade em desenvolvimento! Em breve você poderá agendar uma consultoria especializada.")
                }}
              >
                📞 Agendar Consultoria
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowOptimizedModal(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}