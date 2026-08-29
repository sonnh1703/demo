import { Bell, Boxes, LayoutDashboard, Menu, Search, Settings, ShoppingCart, Users, X } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { CompanySwitcher } from './company-switcher';
import { Button } from '../ui/button';
import { useAppStore } from '../../store/app-store';
import { AssistantWidget } from '../assistant/assistant-widget';

const navItems = [
  { to: '/', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Đơn hàng', icon: ShoppingCart },
  { to: '/inventory', label: 'Kho hàng', icon: Boxes },
  { to: '/users', label: 'Người dùng', icon: Users },
];

const pageNames: Record<string, string> = { '/': 'Tổng quan', '/orders': 'Đơn hàng', '/inventory': 'Kho hàng', '/users': 'Người dùng' };

export function AppLayout() {
  const location = useLocation();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-overlay" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)} />}
      <aside className={sidebarOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="brand"><strong>Quản lý</strong><Button variant="ghost" size="icon" className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu"><X size={19} /></Button></div>
        <nav aria-label="Điều hướng chính">
          <p>Vận hành</p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}><Icon size={18} /><span>{label}</span></NavLink>
          ))}
          <p className="nav-section">Hệ thống</p>
          <a href="#settings"><Settings size={18} /><span>Cài đặt</span></a>
        </nav>
        <div className="help-card"><strong>Cần hỗ trợ?</strong><span>Trung tâm trợ giúp Quản lý</span><button>Tìm hiểu thêm</button></div>
        <div className="profile"><div className="avatar">DT</div><div><strong>Phạm Ngọc Thức</strong><span>Quản trị viên hệ thống</span></div><button aria-label="Mở tài khoản">•••</button></div>
      </aside>
      <main>
        <header>
          <div className="header-left"><Button variant="ghost" size="icon" className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Mở menu"><Menu size={20} /></Button><CompanySwitcher /><span className="crumb-separator">/</span><span className="page-crumb">{pageNames[location.pathname] ?? 'Quản lý'}</span></div>
          <div className="header-actions"><button className="global-search"><Search size={16} /><span>Tìm kiếm nhanh...</span><kbd>⌘ K</kbd></button><Button variant="outline" size="icon" className="notification-button" aria-label="Thông báo"><Bell size={18} /><i /></Button></div>
        </header>
        <Outlet />
      </main>
      <AssistantWidget />
    </div>
  );
}
