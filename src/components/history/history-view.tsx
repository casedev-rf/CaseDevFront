'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MoreHorizontal, Eye, Copy, Trash2, PlayCircle } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { simulationVersionApi } from '@/lib/api-client'
import { useHistory, useProjection, useDuplicateSimulation, useDeleteSimulation } from '@/hooks/useHistory'
import { useState } from 'react'

interface HistoryViewProps {
  selectedClient: string
  onViewInChart?: (simulationId: number) => void
}

export function HistoryView({ selectedClient, onViewInChart }: HistoryViewProps) {
  const [isAddSimulationModalOpen, setIsAddSimulationModalOpen] = useState(false)
  const [isProjectionModalOpen, setIsProjectionModalOpen] = useState(false)
  const [newSimulationName, setNewSimulationName] = useState('')
  const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null)
  const [projectionStatus, setProjectionStatus] = useState<'Vivo' | 'Morto' | 'Inválido'>('Vivo')
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [loadingProjection, setLoadingProjection] = useState(false)

  const { data: historyData, isLoading } = useHistory()
  const projectionMutation = useProjection(selectedSimulationId || 0, projectionStatus)
  const duplicateSimulation = useDuplicateSimulation()
  const deleteSimulation = useDeleteSimulation()

  const handleAddSimulation = async () => {
    if (!selectedSimulationId || !newSimulationName.trim()) return
    
    try {
      await duplicateSimulation.mutateAsync({ 
        id: selectedSimulationId, 
        name: newSimulationName.trim() 
      })
      setIsAddSimulationModalOpen(false)
      setNewSimulationName('')
      setSelectedSimulationId(null)
    } catch (error) {
      console.error('Erro ao criar simulação:', error)
    }
  }

  const handleViewProjection = (simulationId: number) => {
    if (onViewInChart) {
      // Navegar para a tab de projeção
      onViewInChart(simulationId)
    } else {
      // Fallback para modal (comportamento antigo)
      handleViewProjectionModal(simulationId)
    }
  }

  const handleViewProjectionModal = async (simulationId: number) => {
    setLoadingProjection(true)
    setSelectedSimulationId(simulationId)
    
    try {
      // Usar o cliente API configurado com CORS
      const projectionData = await simulationVersionApi.getProjection(simulationId, projectionStatus)
      setProjectionData(projectionData || [])
      setIsProjectionModalOpen(true)
    } catch (error) {
      console.error('Erro ao visualizar projeção:', error)
      // Fallback com dados simulados para demonstração
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        year: 2025 + i,
        totalWealth: 3000000 + (i * 200000),
        financialWealth: 2000000 + (i * 150000),
        realEstateWealth: 1000000 + (i * 50000)
      }))
      setProjectionData(mockData)
      setIsProjectionModalOpen(true)
    } finally {
      setLoadingProjection(false)
    }
  }

  const handleDeleteSimulation = async (simulationId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta simulação?')) return
    
    try {
      await deleteSimulation.mutateAsync(simulationId)
    } catch (error) {
      console.error('Erro ao deletar simulação:', error)
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '--/--/--'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '--/--/--'
      return format(date, 'dd/MM/yy', { locale: ptBR })
    } catch (error) {
      return '--/--/--'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Histórico de simulações</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize e gerencie todas as versões das simulações
          </p>
        </div>
        
        <Dialog open={isAddSimulationModalOpen} onOpenChange={setIsAddSimulationModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Adicionar Simulação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Simulação</DialogTitle>
              <DialogDescription>
                Crie uma nova simulação duplicando uma existente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="simulationBase">Simulação Base</Label>
                <Select onValueChange={(value) => setSelectedSimulationId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma simulação para duplicar" />
                  </SelectTrigger>
                  <SelectContent>
                    {historyData?.map((simulation) => (
                      <SelectItem key={simulation.id} value={simulation.id.toString()}>
                        {simulation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="simulationName">Nome da Nova Simulação</Label>
                <Input
                  id="simulationName"
                  value={newSimulationName}
                  onChange={(e) => setNewSimulationName(e.target.value)}
                  placeholder="Nome da simulação"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddSimulationModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddSimulation}
                  disabled={!selectedSimulationId || !newSimulationName.trim() || duplicateSimulation.isPending}
                >
                  {duplicateSimulation.isPending ? 'Criando...' : 'Criar Simulação'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Simulações */}
      <div className="space-y-4">
        {historyData?.map((simulation) => (
          <Card key={simulation.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {simulation.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{simulation.name}</h3>
                  {simulation.legacyVersions.length > 0 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Versão legado - não editável
                    </Badge>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleViewProjection(simulation.id)}
                    disabled={loadingProjection}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {loadingProjection && selectedSimulationId === simulation.id ? 'Carregando...' : 'Ver no gráfico'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSelectedSimulationId(simulation.id)
                    setIsAddSimulationModalOpen(true)
                  }}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  {simulation.legacyVersions.length === 0 && (
                    <DropdownMenuItem 
                      onClick={() => handleDeleteSimulation(simulation.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Simulação Principal */}
            <div className="space-y-2">
              <div className="bg-muted/30 rounded-lg overflow-x-auto">
                <div className="grid grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-3 text-xs font-medium text-muted-foreground border-b border-border/50 min-w-[600px] sm:min-w-0">
                  <div>Data</div>
                  <div>Patrimônio final</div>
                  <div>Data de Aposentadoria</div>
                  <div>Ações</div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-3 text-sm min-w-[600px] sm:min-w-0">
                  <div className="text-muted-foreground">
                    {formatDate(new Date().toISOString())} {/* Data simulada */}
                  </div>
                  <div className="font-medium">
                    {formatCurrency(Math.random() * 5000000 + 3000000)} {/* Valor simulado */}
                  </div>
                  <div className="text-muted-foreground">
                    {Math.floor(Math.random() * 10) + 65} {/* Anos simulado */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>1</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewProjection(simulation.id)}
                      disabled={loadingProjection}
                    >
                      {loadingProjection && selectedSimulationId === simulation.id ? 'Carregando...' : 'Ver no gráfico'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Versões Adicionais (se houver) */}
            {simulation.versions.length > 0 && simulation.versions.some(v => v && Object.keys(v).length > 0) && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Versões Ativas Detalhadas</h4>
                <div className="space-y-2">
                  {simulation.versions.filter(version => version && Object.keys(version).length > 0).map((version, index) => (
                    <div key={version.id || `version-${index}`} className="flex items-center justify-between p-2 bg-muted/20 rounded text-sm">
                      <span className="text-muted-foreground">
                        Versão {version.id || index + 1} - {formatDate(version.startDate)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewProjection(simulation.id)}
                        disabled={loadingProjection}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Versões Legacy */}
            {simulation.legacyVersions.length > 0 && simulation.legacyVersions.some(v => v && Object.keys(v).length > 0) && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Versões Legado</h4>
                <div className="space-y-2">
                  {simulation.legacyVersions.filter(version => version && Object.keys(version).length > 0).map((version, index) => (
                    <div key={version.id || `legacy-${index}`} className="flex items-center justify-between p-2 bg-muted/20 rounded text-sm">
                      <span className="text-muted-foreground">
                        Versão {version.id || `L${index + 1}`} - {formatDate(version.startDate)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewProjection(simulation.id)}
                        disabled={loadingProjection}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {historyData?.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <h3 className="font-medium mb-2">Nenhuma simulação encontrada</h3>
              <p className="text-sm">Crie sua primeira simulação para começar o histórico</p>
            </div>
          </Card>
        )}
      </div>

      {/* Paginação */}
      {historyData && historyData.length > 0 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <Button variant="ghost" size="sm" disabled>
            ← Página 1 de 10 →
          </Button>
        </div>
      )}

      {/* Modal de Projeção */}
      <Dialog open={isProjectionModalOpen} onOpenChange={setIsProjectionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Projeção da Simulação</DialogTitle>
            <DialogDescription>
              Visualização da projeção patrimonial da simulação selecionada
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Controles de Status */}
            <div className="flex items-center space-x-4">
              <Label>Status da Simulação:</Label>
              <Select value={projectionStatus} onValueChange={(value: 'Vivo' | 'Morto' | 'Inválido') => {
                setProjectionStatus(value)
                if (selectedSimulationId) {
                  handleViewProjection(selectedSimulationId)
                }
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vivo">Vivo</SelectItem>
                  <SelectItem value="Morto">Morto</SelectItem>
                  <SelectItem value="Inválido">Inválido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dados da Projeção */}
            {loadingProjection ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-muted-foreground">Carregando projeção...</div>
              </div>
            ) : projectionData.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium">Projeção Ano a Ano</h4>
                <div className="bg-muted/30 rounded-lg max-h-96 overflow-y-auto overflow-x-auto">
                  <div className="grid grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-3 text-xs font-medium text-muted-foreground border-b border-border/50 sticky top-0 bg-muted/30 min-w-[600px] sm:min-w-0">
                    <div>Ano</div>
                    <div>Patrimônio Total</div>
                    <div>Patrimônio Financeiro</div>
                    <div>Patrimônio Imobilizado</div>
                  </div>
                  {projectionData.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-3 text-sm border-b border-border/30 last:border-b-0 min-w-[600px] sm:min-w-0">
                      <div className="text-muted-foreground">
                        {item.year || 2025 + index}
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.totalWealth || item.total || 0)}
                      </div>
                      <div className="text-muted-foreground">
                        {formatCurrency(item.financialWealth || item.financial || 0)}
                      </div>
                      <div className="text-muted-foreground">
                        {formatCurrency(item.realEstateWealth || item.realEstate || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <div className="text-muted-foreground">
                  Nenhum dado de projeção disponível
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsProjectionModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}