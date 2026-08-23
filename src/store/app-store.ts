import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { inventory as initialInventory, orders as initialOrders, users as initialUsers, type EnterpriseUser, type InventoryItem, type Order } from '../lib/data';

type AppState = {
  companyId: string;
  sidebarOpen: boolean;
  orders: Order[];
  inventory: InventoryItem[];
  users: EnterpriseUser[];
  setCompanyId: (companyId: string) => void;
  setSidebarOpen: (open: boolean) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Order) => void;
  deleteOrder: (id: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (sku: string, item: InventoryItem) => void;
  deleteInventoryItem: (sku: string) => void;
  addUser: (user: EnterpriseUser) => void;
  updateUser: (id: string, user: EnterpriseUser) => void;
  deleteUser: (id: string) => void;
};

export const useAppStore = create<AppState>()(persist((set) => ({
  companyId: 'all',
  sidebarOpen: false,
  orders: initialOrders,
  inventory: initialInventory,
  users: initialUsers,
  setCompanyId: (companyId) => set({ companyId }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, order) => set((state) => ({ orders: state.orders.map((item) => item.id === id ? order : item) })),
  deleteOrder: (id) => set((state) => ({ orders: state.orders.filter((item) => item.id !== id) })),
  addInventoryItem: (item) => set((state) => ({ inventory: [item, ...state.inventory] })),
  updateInventoryItem: (sku, item) => set((state) => ({ inventory: state.inventory.map((record) => record.sku === sku ? item : record) })),
  deleteInventoryItem: (sku) => set((state) => ({ inventory: state.inventory.filter((item) => item.sku !== sku) })),
  addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
  updateUser: (id, user) => set((state) => ({ users: state.users.map((item) => item.id === id ? user : item) })),
  deleteUser: (id) => set((state) => ({ users: state.users.filter((item) => item.id !== id) })),
}), {
  name: 'quan-ly-doanh-nghiep-data',
  partialize: (state) => ({ orders: state.orders, inventory: state.inventory, users: state.users }),
}));
