import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { simulationApi, simulationVersionApi } from '@/lib/api-client'
import { SimulationWithVersions, SimulationVersion } from '@/types'

export function useHistory() {
  return useQuery({
    queryKey: ['simulations', 'history'],
    queryFn: async (): Promise<SimulationWithVersions[]> => {
      return await simulationApi.getRecent()
    }
  })
}

export function useSimulationVersions(simulationId: number) {
  return useQuery({
    queryKey: ['simulation-versions', simulationId],
    queryFn: async (): Promise<SimulationVersion[]> => {
      return await simulationVersionApi.getBySimulationId(simulationId)
    },
    enabled: !!simulationId
  })
}

export function useProjection(simulationId: number, status: 'Vivo' | 'Morto' | 'Inválido') {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      return await simulationVersionApi.getProjection(simulationId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projections'] })
    }
  })
}

export function useDuplicateSimulation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      return await simulationApi.duplicate(id, name)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
      queryClient.invalidateQueries({ queryKey: ['simulations', 'history'] })
    }
  })
}

export function useDeleteSimulation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await simulationApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] })
      queryClient.invalidateQueries({ queryKey: ['simulations', 'history'] })
    }
  })
}