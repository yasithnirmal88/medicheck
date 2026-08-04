import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRecommendations,
  fetchRecommendation,
  updateRecommendationStatus,
} from '../api/recommendationApi'
import type { RecommendationStatus } from '../types'

export const useRecommendations = () =>
  useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    staleTime: 1000 * 60 * 5,
  })

export const useRecommendation = (id: string | undefined) =>
  useQuery({
    queryKey: ['recommendation', id],
    queryFn: () => fetchRecommendation(id!),
    enabled: !!id,
  })

export const useUpdateRecommendationStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RecommendationStatus }) =>
      updateRecommendationStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })
}
