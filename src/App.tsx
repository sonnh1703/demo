import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/app-layout';
import { DashboardPage } from './pages/dashboard-page';
import { InventoryPage } from './pages/inventory-page';
import { OrdersPage } from './pages/orders-page';
import { UsersPage } from './pages/users-page';

export function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<DashboardPage />} /><Route path="orders" element={<OrdersPage />} /><Route path="inventory" element={<InventoryPage />} /><Route path="users" element={<UsersPage />} /><Route path="*" element={<Navigate replace to="/" />} /></Route></Routes>;
}
