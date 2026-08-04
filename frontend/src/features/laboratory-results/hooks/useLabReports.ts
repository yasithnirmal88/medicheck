import { useQuery } from '@tanstack/react-query'
import { fetchLabReports } from '../api/labService'

export function useLabReports() {
  return useQuery({
    queryKey: ['laboratory', 'lab-reports'],
    queryFn: fetchLabReports,
    staleTime: 1000 * 60 * 5,
  })
}