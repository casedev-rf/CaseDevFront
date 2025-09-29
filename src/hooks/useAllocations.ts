import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { allocationApi, eventApi, insuranceApi } from '@/lib/api-client'
import { 
  Allocation, 
  AllocationCreateData, 
  Event, 
  EventCreateData, 
  Insurance, 
  InsuranceCreateData 
} from '@/types'

// ===== HOOKS PARA ALOCAÇÕES =====

export function useAllocations(versionId: number) {
  return useQuery({
    queryKey: ['allocations', versionId],
    queryFn: () => allocationApi.getByVersionId(versionId),
    enabled: !!versionId,
  })
}

export function useAllocation(id: number) {
  return useQuery({
    queryKey: ['allocation', id],
    queryFn: () => allocationApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateAllocation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: allocationApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allocations', data.simulationVersionId] })
    },
  })
}

export function useUpdateAllocation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AllocationCreateData> }) => 
      allocationApi.update(id, data),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['allocation', id] })
      queryClient.invalidateQueries({ queryKey: ['allocations', result.simulationVersionId] })
    },
  })
}

export function useUpdateAllocationValue() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, value }: { id: number; value: number }) => 
      allocationApi.updateValue(id, value),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['allocation', id] })
      queryClient.invalidateQueries({ queryKey: ['allocations', result.simulationVersionId] })
    },
  })
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: allocationApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
    },
  })
}

// ===== HOOKS PARA EVENTOS/MOVIMENTAÇÕES =====

export function useEvents(versionId: number) {
  return useQuery({
    queryKey: ['events', versionId],
    queryFn: () => eventApi.getByVersionId(versionId),
    enabled: !!versionId,
  })
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ versionId, data }: { versionId: number; data: EventCreateData }) => 
      eventApi.create(versionId, data),
    onSuccess: (_, { versionId }) => {
      queryClient.invalidateQueries({ queryKey: ['events', versionId] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventCreateData> }) => 
      eventApi.update(id, data),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      queryClient.invalidateQueries({ queryKey: ['events', result.simulationVersionId] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: eventApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// ===== HOOKS PARA SEGUROS =====

export function useInsurances(versionId: number) {
  return useQuery({
    queryKey: ['insurances', versionId],
    queryFn: () => insuranceApi.getByVersionId(versionId),
    enabled: !!versionId,
  })
}

export function useInsurance(id: number) {
  return useQuery({
    queryKey: ['insurance', id],
    queryFn: () => insuranceApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateInsurance() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: insuranceApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['insurances', data.simulationVersionId] })
    },
  })
}

export function useUpdateInsurance() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsuranceCreateData> }) => 
      insuranceApi.update(id, data),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['insurance', id] })
      queryClient.invalidateQueries({ queryKey: ['insurances', result.simulationVersionId] })
    },
  })
}

export function useDeleteInsurance() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: insuranceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurances'] })
    },
  })
}