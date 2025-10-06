'use client'
import { AllocationCreateData } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAllocations, useCreateAllocation, useUpdateAllocation } from "@/hooks/useAllocations"
import { useSimulations, useSimulationVersions } from "@/hooks/useSimulations"
import { useState } from "react"

export function AllocationsView() {
  const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<string>("todas")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Buscar dados do backend
  const { data: simulations } = useSimulations()
  const { data: versions } = useSimulationVersions(selectedSimulationId || 0)
  const { data: allocations, isLoading: loadingAllocations } = useAllocations(selectedVersionId || 0)
  
  // Mutations
  const createAllocation = useCreateAllocation()
  const updateAllocation = useUpdateAllocation()

  // Auto-selecionar primeira simulação e versão atual
  const firstSimulation = simulations?.[0]
  if (firstSimulation && !selectedSimulationId) {
    setSelectedSimulationId(firstSimulation.id)
  }

  const currentVersion = versions?.find(v => v.isCurrent) || versions?.[0]
  if (currentVersion && !selectedVersionId) {
    setSelectedVersionId(currentVersion.id)
  }

  // Filtrar alocações por tipo
  const filteredAllocations = allocations?.filter(allocation => {
    if (filterType === "todas") return true
    return allocation.type === filterType
  }) || []

  const handleAddAllocation = (data: AllocationCreateData) => {
    if (!selectedVersionId) return
    
    createAllocation.mutate({
      ...data,
      simulationVersionId: selectedVersionId
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false)
      }
    })
  }

  const handleUpdateValue = (allocationId: number, newValue: number) => {
    updateAllocation.mutate({
      id: allocationId,
      data: { 
        value: newValue, 
        date: new Date().toISOString()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header com seletor de cliente */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Clientes - alocações</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <Select 
            value={selectedSimulationId?.toString() || ""} 
            onValueChange={(value) => {
              setSelectedSimulationId(Number(value))
              setSelectedVersionId(null)
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {simulations?.map((simulation) => (
                <SelectItem key={simulation.id} value={simulation.id.toString()}>
                  {simulation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline de alocações */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <CardTitle className="text-lg">Timeline de alocações manuais</CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Alocações:</span>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="financeira">Financeira</SelectItem>
                    <SelectItem value="imobilizada">Imobilizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <AddAllocationModal 
                    onSubmit={handleAddAllocation}
                    isLoading={createAllocation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {loadingAllocations ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando alocações...
            </div>
          ) : filteredAllocations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma alocação encontrada. Clique em "Adicionar" para criar a primeira.
            </div>
          ) : (
            filteredAllocations.map((allocation) => (
              <AllocationCard
                key={allocation.id}
                allocation={allocation}
                onUpdateValue={handleUpdateValue}
                isUpdating={updateAllocation.isPending}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente do card de alocação
function AllocationCard({ 
  allocation, 
  onUpdateValue, 
  isUpdating 
}: { 
  allocation: any, 
  onUpdateValue: (id: number, value: number) => void,
  isUpdating: boolean 
}) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [newValue, setNewValue] = useState(allocation.value.toString())

  const handleUpdate = () => {
    const value = parseFloat(newValue)
    if (!isNaN(value)) {
      onUpdateValue(allocation.id, value)
      setIsUpdateModalOpen(false)
    }
  }

  const getTypeBadge = (type: string) => {
    if (type === 'financeira') {
      return <Badge className="bg-blue-100 text-blue-800">Financeira Mensal</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Imobilizada</Badge>
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-card gap-4 sm:gap-0">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
          <h3 className="font-medium">{allocation.name}</h3>
          <div className="flex items-center gap-2">
            {getTypeBadge(allocation.type)}
            {allocation.hasFinancing && (
              <Badge variant="outline">Financiado</Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Início: {formatDate(allocation.date)}
        </p>
      </div>

      <div className="flex flex-col sm:text-right w-full sm:w-auto">
        <div className="text-lg font-semibold">{formatCurrency(allocation.value)}</div>
        <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
          Última atualização: {formatDate(allocation.date)}
        </p>
        
        {allocation.hasFinancing && (
          <div className="mt-2 mb-3 sm:mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Progresso: 14/200 parcelas
            </p>
          </div>
        )}
        
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-orange-600 border-orange-600 hover:bg-orange-50 w-full sm:w-auto"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Atualizar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar valor - {allocation.name}</DialogTitle>
              <DialogDescription>
                Digite o novo valor para esta alocação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Novo valor</Label>
                <Input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Digite o novo valor"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isUpdating ? "Atualizando..." : "Atualizar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Modal para adicionar nova alocação
function AddAllocationModal({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: AllocationCreateData) => void,
  isLoading: boolean 
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'financeira' as 'financeira' | 'imobilizada',
    value: '',
    date: new Date().toISOString().split('T')[0],
    hasFinancing: false,
    financingStartDate: '',
    financingInstallments: '',
    financingRate: '',
    financingEntryValue: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: AllocationCreateData = {
      simulationVersionId: 0,
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value),
      date: new Date(formData.date).toISOString(), // Converter para ISO-8601
      hasFinancing: formData.hasFinancing,
      ...(formData.hasFinancing && {
        financingStartDate: formData.financingStartDate ? new Date(formData.financingStartDate).toISOString() : undefined,
        financingInstallments: parseInt(formData.financingInstallments),
        financingRate: parseFloat(formData.financingRate),
        financingEntryValue: parseFloat(formData.financingEntryValue)
      })
    }
    
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Adicionar Nova Alocação</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para criar uma nova alocação
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nome *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: CDB Banco Itaú"
            required
          />
        </div>
        
        <div>
          <Label>Tipo *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value: 'financeira' | 'imobilizada') => 
              setFormData(prev => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financeira">Financeira</SelectItem>
              <SelectItem value="imobilizada">Imobilizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Valor *</Label>
          <Input
            type="number"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder="1000000"
            required
          />
        </div>
        
        <div>
          <Label>Data *</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
      </div>

      {formData.type === 'imobilizada' && (
        <>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasFinancing"
              checked={formData.hasFinancing}
              onChange={(e) => setFormData(prev => ({ ...prev, hasFinancing: e.target.checked }))}
            />
            <Label htmlFor="hasFinancing">Possui financiamento</Label>
          </div>

          {formData.hasFinancing && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label>Data inicial do financiamento</Label>
                <Input
                  type="date"
                  value={formData.financingStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, financingStartDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Número de parcelas</Label>
                <Input
                  type="number"
                  value={formData.financingInstallments}
                  onChange={(e) => setFormData(prev => ({ ...prev, financingInstallments: e.target.value }))}
                  placeholder="200"
                />
              </div>
              
              <div>
                <Label>Taxa de juros (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.financingRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, financingRate: e.target.value }))}
                  placeholder="8.5"
                />
              </div>
              
              <div>
                <Label>Valor de entrada</Label>
                <Input
                  type="number"
                  value={formData.financingEntryValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, financingEntryValue: e.target.value }))}
                  placeholder="200000"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isLoading ? "Criando..." : "Criar Alocação"}
        </Button>
      </div>
    </form>
  )
}