// ===== TIPOS SINCRONIZADOS COM O BACKEND =====

// Simulação principal
export interface Simulation {
  id: number
  name: string
  createdAt: string
  versions: SimulationVersion[]
}

// Versão de Simulação
export interface SimulationVersion {
  id: number
  simulationId: number
  status: 'Vivo' | 'Morto' | 'Inválido'
  startDate: string
  realRate: number
  createdAt: string
  isCurrent: boolean
  allocations?: Allocation[]
  events?: Event[]
  insurances?: Insurance[]
}

// Alocação (financeira ou imobilizada)
export interface Allocation {
  id: number
  simulationVersionId: number
  type: 'financeira' | 'imobilizada'
  name: string
  value: number
  date: string
  // Campos para financiamento (opcional)
  hasFinancing?: boolean
  financingStartDate?: string
  financingInstallments?: number
  financingRate?: number
  financingEntryValue?: number
  history?: AllocationHistory[]
}

// Histórico de valores da alocação
export interface AllocationHistory {
  id: number
  allocationId: number
  value: number
  date: string
}

// Movimentação/Eventos
export interface Event {
  id: number
  simulationVersionId: number
  type: string // entrada, saída, etc.
  value: number
  frequency: 'única' | 'mensal' | 'anual'
  startDate: string
  endDate?: string
}

// Seguro
export interface Insurance {
  id: number
  simulationVersionId: number
  name: string
  startDate: string
  durationMonths: number
  premium: number // pagamento mensal
  insuredValue: number
}

// ===== TIPOS ESPECÍFICOS DO FRONTEND =====

// Para dados de projeção do gráfico
export interface ProjectionData {
  year: number
  totalPatrimony: number
  financialPatrimony: number
  immobilizedPatrimony: number
  totalWithoutInsurance: number
}

// Para histórico de simulações
export interface SimulationHistory {
  id: number
  simulationId: number
  name: string
  version: number
  createdAt: string
  isLegacy: boolean
}

// Para simulações recentes com versões
export interface SimulationWithVersions {
  id: number
  name: string
  versions: SimulationVersion[]
  legacyVersions: SimulationVersion[]
}

// ===== TIPOS PARA FORMULÁRIOS (baseados nos schemas do backend) =====

export interface SimulationCreateData {
  name: string
}

export interface SimulationVersionCreateData {
  simulationId: number
  status: 'Vivo' | 'Morto' | 'Inválido'
  startDate: string
  realRate: number
}

export interface AllocationCreateData {
  simulationVersionId: number
  type: 'financeira' | 'imobilizada'
  name: string
  value: number
  date: string
  hasFinancing?: boolean
  financingStartDate?: string
  financingInstallments?: number
  financingRate?: number
  financingEntryValue?: number
}

export interface EventCreateData {
  type: string
  value: number
  frequency: 'única' | 'mensal' | 'anual'
  startDate: string
  endDate?: string
}

export interface InsuranceCreateData {
  simulationVersionId: number
  name: string
  startDate: string
  durationMonths: number
  premium: number
  insuredValue: number
}