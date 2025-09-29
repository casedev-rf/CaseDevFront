import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { simulationApi, simulationVersionApi } from '@/lib/api-client'
import { 
  Simulation, 
  SimulationVersion, 
  SimulationCreateData, 
  SimulationVersionCreateData,
  ProjectionData 
} from '@/types'

// ===== HOOKS PARA SIMULAÇÕES =====

export function useSimulations() {
  return useQuery({
    queryKey: ['simulations'],
    queryFn: simulationApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useSimulation(id: number) {
  return useQuery({
    queryKey: ['simulation', id],
    queryFn: () => simulationApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSimulation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: simulationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
    },
  })
}

export function useUpdateSimulation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SimulationCreateData> }) => 
      simulationApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
      queryClient.invalidateQueries({ queryKey: ['simulation', id] })
    },
  })
}

export function useDeleteSimulation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: simulationApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
    },
  })
}

export function useCreateCurrentSituation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: simulationApi.createCurrent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
    },
  })
}

// ===== HOOKS PARA VERSÕES DE SIMULAÇÃO =====

export function useSimulationVersions(simulationId: number) {
  return useQuery({
    queryKey: ['simulation-versions', simulationId],
    queryFn: () => simulationVersionApi.getBySimulationId(simulationId),
    enabled: !!simulationId,
  })
}

export function useSimulationVersion(id: number) {
  return useQuery({
    queryKey: ['simulation-version', id],
    queryFn: () => simulationVersionApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSimulationVersion() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: simulationVersionApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['simulation-versions', data.simulationId] })
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
    },
  })
}

export function useUpdateSimulationVersion() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SimulationVersionCreateData> }) => 
      simulationVersionApi.update(id, data),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['simulation-version', id] })
      queryClient.invalidateQueries({ queryKey: ['simulation-versions', result.simulationId] })
    },
  })
}

export function useDeleteSimulationVersion() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: simulationVersionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulation-versions'] })
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
    },
  })
}

// ===== HOOK PARA PROJEÇÃO =====

export function useProjection(simulationId: number, status: 'Vivo' | 'Morto' | 'Inválido') {
  return useQuery({
    queryKey: ['simulation-projection', simulationId, status],
    queryFn: () => simulationVersionApi.getProjection(simulationId, status),
    enabled: !!simulationId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}