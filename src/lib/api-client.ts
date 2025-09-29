import { api } from '@/lib/api'
import { 
  Simulation, 
  SimulationVersion, 
  Allocation, 
  Event, 
  Insurance,
  SimulationCreateData,
  SimulationVersionCreateData,
  AllocationCreateData,
  EventCreateData,
  InsuranceCreateData,
  ProjectionData
} from '@/types'

// ===== SIMULAÇÕES =====

export const simulationApi = {
  // Listar todas as simulações
  getAll: async (): Promise<Simulation[]> => {
    const response = await api.get('/simulations')
    return response.data
  },

  // Criar nova simulação
  create: async (data: SimulationCreateData): Promise<Simulation> => {
    const response = await api.post('/simulations', data)
    return response.data
  },

  // Buscar simulação por ID
  getById: async (id: number): Promise<Simulation> => {
    const response = await api.get(`/simulations/${id}`)
    return response.data
  },

  // Atualizar simulação
  update: async (id: number, data: Partial<SimulationCreateData>): Promise<Simulation> => {
    const response = await api.put(`/simulations/${id}`, data)
    return response.data
  },

  // Deletar simulação
  delete: async (id: number): Promise<void> => {
    await api.delete(`/simulations/${id}`)
  },

  // Criar situação atual
  createCurrent: async (id: number): Promise<{ simulationId: number; isCurrent: boolean }> => {
    const response = await api.post(`/simulations/${id}/current`)
    return response.data
  },

  // Listar simulações recentes com histórico de versões
  getRecent: async (): Promise<any[]> => {
    const response = await api.get('/simulations/recent')
    return response.data
  },

  // Duplicar simulação
  duplicate: async (id: number, name: string): Promise<{ newSimulationId: number }> => {
    const response = await api.post(`/simulations/${id}/duplicate`, { name })
    return response.data
  }
}

// ===== VERSÕES DE SIMULAÇÃO =====

export const simulationVersionApi = {
  // Listar todas as versões (filtrar por simulationId no frontend)
  getAll: async (): Promise<SimulationVersion[]> => {
    const response = await api.get('/simulation-versions')
    return response.data
  },

  // Listar versões de uma simulação (filtradas no frontend)
  getBySimulationId: async (simulationId: number): Promise<SimulationVersion[]> => {
    const response = await api.get('/simulation-versions')
    return response.data.filter((version: SimulationVersion) => version.simulationId === simulationId)
  },

  // Criar nova versão
  create: async (data: SimulationVersionCreateData): Promise<SimulationVersion> => {
    const response = await api.post('/simulation-versions', data)
    return response.data
  },

  // Buscar versão por ID
  getById: async (id: number): Promise<SimulationVersion> => {
    const response = await api.get(`/simulation-versions/${id}`)
    return response.data
  },

  // Atualizar versão
  update: async (id: number, data: Partial<SimulationVersionCreateData>): Promise<SimulationVersion> => {
    const response = await api.put(`/simulation-versions/${id}`, data)
    return response.data
  },

  // Deletar versão
  delete: async (id: number): Promise<void> => {
    await api.delete(`/simulation-versions/${id}`)
  },

  // Obter projeção (usar simulationId, não versionId)
  getProjection: async (simulationId: number, status: 'Vivo' | 'Morto' | 'Inválido'): Promise<ProjectionData[]> => {
    const response = await api.post(`/simulations/${simulationId}/projection`, {
      status
    })
    return response.data.projection || []
  }
}

// ===== ALOCAÇÕES =====

export const allocationApi = {
  // Listar todas as alocações (filtrar por versionId no frontend)
  getAll: async (): Promise<Allocation[]> => {
    const response = await api.get('/allocations')
    return response.data
  },

  // Listar alocações de uma versão (filtradas no frontend)
  getByVersionId: async (versionId: number): Promise<Allocation[]> => {
    const response = await api.get('/allocations')
    return response.data.filter((allocation: Allocation) => allocation.simulationVersionId === versionId)
  },

  // Criar alocação
  create: async (data: AllocationCreateData): Promise<Allocation> => {
    const response = await api.post('/allocations', data)
    return response.data
  },

  // Buscar alocação por ID
  getById: async (id: number): Promise<Allocation> => {
    const response = await api.get(`/allocations/${id}`)
    return response.data
  },

  // Atualizar alocação
  update: async (id: number, data: Partial<AllocationCreateData>): Promise<Allocation> => {
    const response = await api.put(`/allocations/${id}`, data)
    return response.data
  },

  // Deletar alocação
  delete: async (id: number): Promise<void> => {
    await api.delete(`/allocations/${id}`)
  },

  // Atualizar valor da alocação
  updateValue: async (id: number, value: number): Promise<Allocation> => {
    const response = await api.patch(`/allocations/${id}/value`, { value })
    return response.data
  }
}

// ===== EVENTOS/MOVIMENTAÇÕES =====

export const eventApi = {
  // Listar todos os eventos (filtrar por versionId no frontend)
  getAll: async (): Promise<Event[]> => {
    const response = await api.get('/events')
    return response.data
  },

  // Listar eventos de uma versão (filtrados no frontend)
  getByVersionId: async (versionId: number): Promise<Event[]> => {
    const response = await api.get('/events')
    return response.data.filter((event: Event) => event.simulationVersionId === versionId)
  },

  // Criar evento
  create: async (versionId: number, data: EventCreateData): Promise<Event> => {
    const response = await api.post(`/simulation-versions/${versionId}/events`, data)
    return response.data
  },

  // Buscar evento por ID
  getById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  // Atualizar evento
  update: async (id: number, data: Partial<EventCreateData>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, data)
    return response.data
  },

  // Deletar evento
  delete: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`)
  }
}

// ===== SEGUROS =====

export const insuranceApi = {
  // Listar todos os seguros (filtrar por versionId no frontend)
  getAll: async (): Promise<Insurance[]> => {
    const response = await api.get('/insurances')
    return response.data
  },

  // Listar seguros de uma versão (filtrados no frontend)
  getByVersionId: async (versionId: number): Promise<Insurance[]> => {
    const response = await api.get('/insurances')
    return response.data.filter((insurance: Insurance) => insurance.simulationVersionId === versionId)
  },

  // Criar seguro
  create: async (data: InsuranceCreateData): Promise<Insurance> => {
    const response = await api.post('/insurances', data)
    return response.data
  },

  // Buscar seguro por ID
  getById: async (id: number): Promise<Insurance> => {
    const response = await api.get(`/insurances/${id}`)
    return response.data
  },

  // Atualizar seguro
  update: async (id: number, data: Partial<InsuranceCreateData>): Promise<Insurance> => {
    const response = await api.put(`/insurances/${id}`, data)
    return response.data
  },

  // Deletar seguro
  delete: async (id: number): Promise<void> => {
    await api.delete(`/insurances/${id}`)
  }
}