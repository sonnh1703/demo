import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/app-layout';
import { DashboardPage } from '../features/dashboard/dashboard-page';
import { InventoryPage } from '../features/inventory/inventory-page';
import { OrdersPage } from '../features/orders/orders-page';
import { UsersPage } from '../features/users/users-page';

export function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<DashboardPage />} /><Route path="orders" element={<OrdersPage />} /><Route path="inventory" element={<InventoryPage />} /><Route path="users" element={<UsersPage />} /><Route path="*" element={<Navigate replace to="/" />} /></Route></Routes>;
}
