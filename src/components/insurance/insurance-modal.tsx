'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { InsuranceCreateData } from "@/types"
import { Label } from "@/components/ui/label"
import { useCreateInsurance } from "@/hooks/useAllocations"
import { useState } from "react"

interface InsuranceModalProps {
  versionId: number
  trigger?: React.ReactNode
}

export function InsuranceModal({ versionId, trigger }: InsuranceModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<InsuranceCreateData>({
    simulationVersionId: versionId,
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    durationMonths: 120,
    premium: 0,
    insuredValue: 0
  })

  const createInsuranceMutation = useCreateInsurance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== DEBUG: Criando seguro ===')
    console.log('versionId:', versionId)
    console.log('formData:', formData)
    
    if (!formData.name.trim() || formData.premium <= 0 || formData.insuredValue <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (!versionId || versionId === 0) {
      alert('Erro: Nenhuma versão de simulação selecionada')
      return
    }

    try {
      // Preparar payload para envio
      const payload = {
        simulationVersionId: versionId,
        name: formData.name.trim(),
        startDate: formData.startDate, // Manter formato YYYY-MM-DD
        durationMonths: Number(formData.durationMonths),
        premium: Number(formData.premium),
        insuredValue: Number(formData.insuredValue)
      }
      
      console.log('Enviando payload para criar seguro:', payload)
      
      await createInsuranceMutation.mutateAsync(payload)
      setOpen(false)
      // Reset form
      setFormData({
        simulationVersionId: versionId,
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        durationMonths: 120,
        premium: 0,
        insuredValue: 0
      })
    } catch (error: any) {
      console.error('Erro ao criar seguro:', error)
      
      // Tentar extrair mensagem de erro específica
      let errorMessage = 'Erro ao criar seguro. Tente novamente.'
      
      if (error.response?.data?.error) {
        // Erro de validação do backend
        if (Array.isArray(error.response.data.error)) {
          errorMessage = error.response.data.error.map((e: any) => e.message).join(', ')
        } else {
          errorMessage = error.response.data.error
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(`Erro: ${errorMessage}`)
    }
  }

  const handleInputChange = (field: keyof InsuranceCreateData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const defaultTrigger = (
    <Button size="sm" variant="outline">
      + Adicionar Seguro
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Seguro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Nome do Seguro *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Seguro de Vida Familiar"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insuredValue">Valor Segurado *</Label>
                <Input
                  id="insuredValue"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.insuredValue}
                  onChange={(e) => handleInputChange('insuredValue', Number(e.target.value))}
                  placeholder="500000"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.insuredValue > 0 && formatCurrency(formData.insuredValue)}
                </p>
              </div>

              <div>
                <Label htmlFor="premium">Prêmio Mensal *</Label>
                <Input
                  id="premium"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.premium}
                  onChange={(e) => handleInputChange('premium', Number(e.target.value))}
                  placeholder="500"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.premium > 0 && `${formatCurrency(formData.premium)}/mês`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="durationMonths">Duração (meses)</Label>
                <Input
                  id="durationMonths"
                  type="number"
                  min="1"
                  value={formData.durationMonths}
                  onChange={(e) => handleInputChange('durationMonths', Number(e.target.value))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(formData.durationMonths / 12 * 10) / 10} anos
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createInsuranceMutation.isPending}
            >
              {createInsuranceMutation.isPending ? 'Criando...' : 'Criar Seguro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}