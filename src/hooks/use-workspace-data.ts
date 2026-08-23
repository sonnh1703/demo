import { useMemo } from 'react';
import { useAppStore } from '../store/app-store';

export function useWorkspaceData() {
  const companyId = useAppStore((state) => state.companyId);
  const orders = useAppStore((state) => state.orders);
  const inventory = useAppStore((state) => state.inventory);
  const users = useAppStore((state) => state.users);
  const data = useMemo(() => {
    const inScope = <T extends { companyId: string }>(records: T[]) => companyId === 'all' ? records : records.filter((record) => record.companyId === companyId);
    return { orders: inScope(orders), inventory: inScope(inventory), users: inScope(users) };
  }, [companyId, inventory, orders, users]);
  return { data, isPending: false };
}
