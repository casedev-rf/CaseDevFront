'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Insurance } from "@/types"
import { InsuranceModal } from "./insurance-modal"
import { Trash2, Edit } from "lucide-react"
import { useInsurances, useDeleteInsurance } from "@/hooks/useAllocations"

interface InsuranceListProps {
  versionId: number
}

export function InsuranceList({ versionId }: InsuranceListProps) {
  const { data: insurances, isLoading } = useInsurances(versionId)
  const deleteInsuranceMutation = useDeleteInsurance()

  const handleDelete = async (insuranceId: number) => {
    if (confirm('Tem certeza que deseja excluir este seguro?')) {
      try {
        await deleteInsuranceMutation.mutateAsync(insuranceId)
      } catch (error) {
        console.error('Erro ao deletar seguro:', error)
        alert('Erro ao deletar seguro. Tente novamente.')
      }
    }
  }

  const getInsuranceTypeLabel = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('vida')) return 'Seguro de Vida'
    if (lowerName.includes('invalidez')) return 'Seguro de Invalidez'
    if (lowerName.includes('acidente')) return 'Seguro de Acidentes'
    return 'Seguro'
  }

  const formatDuration = (months: number) => {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years === 0) return `${months} meses`
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`
    return `${years}a ${remainingMonths}m`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seguros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Carregando seguros...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <CardTitle className="text-lg">Seguros</CardTitle>
        <InsuranceModal versionId={versionId} />
      </CardHeader>
      <CardContent>
        {!insurances || insurances.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhum seguro cadastrado</p>
            <p className="text-sm mt-2">Clique em "Adicionar Seguro" para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {insurances.map((insurance: Insurance) => (
              <div key={insurance.id} className="p-3 sm:p-4 border rounded-lg relative group">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2 sm:gap-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base">{insurance.name}</h4>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {getInsuranceTypeLabel(insurance.name)}
                    </Badge>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-semibold text-purple-400">
                      {formatCurrency(insurance.insuredValue)}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Duração: {formatDuration(insurance.durationMonths)}</div>
                  <div>Prêmio: {formatCurrency(insurance.premium)} - Mensal</div>
                  <div>Início: {new Date(insurance.startDate).toLocaleDateString('pt-BR')}</div>
                </div>

                {/* Botões de ação */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(insurance.id)}
                      disabled={deleteInsuranceMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Cálculo anual */}
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  Total anual: {formatCurrency(insurance.premium * 12)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo dos seguros */}
        {insurances && insurances.length > 0 && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total de Seguros:</span>
                <span className="ml-2 font-medium">{insurances.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Prêmio Total/Mês:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(insurances.reduce((sum, ins) => sum + ins.premium, 0))}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Valor Total Segurado:</span>
                <span className="ml-2 font-medium text-purple-400">
                  {formatCurrency(insurances.reduce((sum, ins) => sum + ins.insuredValue, 0))}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Prêmio Total/Ano:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(insurances.reduce((sum, ins) => sum + (ins.premium * 12), 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}