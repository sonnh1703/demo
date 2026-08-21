import { useQuery } from '@tanstack/react-query';
import { getWorkspaceData } from '../lib/data';
import { useAppStore } from '../store/app-store';

export function useWorkspaceData() {
  const companyId = useAppStore((state) => state.companyId);
  return useQuery({
    queryKey: ['workspace', companyId],
    queryFn: () => getWorkspaceData(companyId),
    staleTime: 60_000,
  });
}
