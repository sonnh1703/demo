import { AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, ChevronDown, CircleCheck, PackageCheck, ShoppingCart, Users } from 'lucide-react';
import { companies, getCompany, getStockStatus } from '../lib/data';
import { formatCurrency } from '../lib/utils';
import { useAppStore } from '../store/app-store';
import { useWorkspaceData } from '../hooks/use-workspace-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CompanyPill } from '../components/company-pill';
import { PageHeader } from '../components/page-header';

const chartValues: Record<string, number[]> = {
  all: [4.2, 4.9, 4.6, 6.3, 7.1, 8.4],
  'nexora-retail': [1.1, 1.4, 1.2, 1.7, 1.9, 2.3],
  'minh-long': [0.8, 1.0, 0.9, 1.3, 1.4, 1.8],
  'nexora-distribution': [1.2, 1.3, 1.4, 1.8, 2.1, 2.5],
  'an-phu': [1.1, 1.2, 1.1, 1.5, 1.7, 1.8],
};

export function DashboardPage() {
  const companyId = useAppStore((state) => state.companyId);
  const setCompanyId = useAppStore((state) => state.setCompanyId);
  const selectedCompany = getCompany(companyId);
  const { data, isPending } = useWorkspaceData();
  const scopedOrders = data?.orders ?? [];
  const scopedInventory = data?.inventory ?? [];
  const scopedUsers = data?.users ?? [];
  const revenue = scopedOrders.reduce((total, order) => total + order.amount, 0);
  const inventoryValue = scopedInventory.reduce((total, item) => total + item.value, 0);
  const lowStock = scopedInventory.filter((item) => getStockStatus(item) !== 'Đủ hàng').length;
  const values = chartValues[companyId];
  const maxValue = Math.max(...values);
  const metrics = [
    { label: 'Doanh thu ghi nhận', value: isPending ? '—' : formatCurrency(revenue, true), delta: '+12,8%', positive: true, icon: PackageCheck, tone: 'green' },
    { label: 'Đơn hàng', value: isPending ? '—' : scopedOrders.length.toLocaleString('vi-VN'), delta: '+8,2%', positive: true, icon: ShoppingCart, tone: 'blue' },
    { label: 'Giá trị tồn kho', value: isPending ? '—' : formatCurrency(inventoryValue, true), delta: '-2,4%', positive: false, icon: Boxes, tone: 'amber' },
    { label: 'Người dùng', value: isPending ? '—' : scopedUsers.length.toLocaleString('vi-VN'), delta: `${scopedUsers.filter((user) => user.status === 'Đang hoạt động').length} hoạt động`, positive: true, icon: Users, tone: 'violet' },
  ];

  return (
    <section className="content dashboard-page">
      <PageHeader title="Tổng quan" />
      <div className="scope-banner">
        <div className="scope-icon"><CircleCheck size={18} /></div>
        <div><strong>{companyId === 'all' ? 'Báo cáo hợp nhất toàn hệ thống' : `Báo cáo riêng · ${selectedCompany.name}`}</strong><span>{companyId === 'all' ? 'Đang tổng hợp dữ liệu từ 4 công ty thành viên' : 'Mọi chỉ số và bảng dữ liệu đã được lọc theo công ty này'}</span></div>
        {companyId !== 'all' && <button onClick={() => setCompanyId('all')}>Xem toàn hệ thống</button>}
      </div>

      <div className="metric-grid">
        {metrics.map(({ label, value, delta, positive, icon: Icon, tone }) => (
          <article className={`metric-card ${isPending ? 'loading' : ''}`} key={label}>
            <div className="metric-top"><span>{label}</span><div className={`metric-icon ${tone}`}><Icon size={18} /></div></div>
            <strong>{value}</strong>
            <p className={positive ? 'trend-up' : 'trend-down'}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}<b>{delta}</b><span>{label === 'Người dùng' ? 'trong phạm vi' : 'so với tháng trước'}</span></p>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-title"><div><h2>Hiệu suất doanh thu</h2></div><Button variant="outline" size="sm">Doanh thu <ChevronDown size={14} /></Button></div>
          <div className="chart-area">
            <div className="chart">
              {values.map((value, index) => <div className="bar-slot" key={index} tabIndex={0} aria-label={`Doanh thu tháng ${index + 3}: ${formatCurrency(value * 1_000_000_000)}`}><div className={index === values.length - 1 ? 'bar current' : 'bar'} style={{ height: `${(value / maxValue) * 86}%` }}><span className="chart-tooltip">{formatCurrency(value * 1_000_000_000)}</span></div></div>)}
            </div>
          </div>
          <div className="months"><span>Thg 3</span><span>Thg 4</span><span>Thg 5</span><span>Thg 6</span><span>Thg 7</span><span>Thg 8</span></div>
          <div className="chart-footer"><span><i /> Doanh thu</span><strong>+18,3% <small>tăng trưởng 6 tháng</small></strong></div>
        </article>

        <article className="panel orders-panel">
          <div className="panel-title"><div><h2>Đơn hàng gần đây</h2></div><Button asChild variant="ghost" size="sm"><a href="/orders">Xem tất cả</a></Button></div>
          <div className="orders-list">
            <div className="recent-order recent-order-head"><span>Mã đơn</span><span>Giá trị</span><span>Trạng thái</span></div>
            {scopedOrders.slice(0, 4).map((order) => <div className="recent-order" key={order.id}><strong>#{order.id}</strong><b>{formatCurrency(order.amount)}</b><Badge className={`status-${order.status.replaceAll(' ', '-').toLowerCase()}`}>{order.status}</Badge></div>)}
            {!isPending && scopedOrders.length === 0 && <div className="empty-mini">Chưa có đơn hàng trong phạm vi này.</div>}
          </div>
        </article>
      </div>

      <div className="bottom-grid">
        <article className="panel company-performance">
          <div className="panel-title"><div><h2>Hiệu suất theo công ty</h2></div><span className="live-label"><i />Trực tiếp</span></div>
          <div className="company-bars">
            {companies.slice(1).map((company, index) => {
              const amount = [32, 25, 27, 16][index];
              return <div className="company-row" key={company.id}><CompanyPill companyId={company.id} /><div className="progress"><i style={{ width: `${amount}%`, background: company.color }} /></div><strong>{amount}%</strong></div>;
            })}
          </div>
        </article>
        <article className="panel attention-panel">
          <div className="panel-title"><div><h2>Cần chú ý</h2></div><span className="attention-count">{lowStock + scopedOrders.filter((order) => order.status === 'Chờ duyệt').length}</span></div>
          <div className="attention-list">
            <div><span className="alert-icon amber"><AlertTriangle size={16} /></span><p><strong>{lowStock} mặt hàng sắp hết</strong><small>Kiểm tra và tạo đề nghị nhập kho</small></p><ChevronDown size={15} /></div>
            <div><span className="alert-icon green"><ShoppingCart size={16} /></span><p><strong>{scopedOrders.filter((order) => order.status === 'Chờ duyệt').length} đơn hàng chờ duyệt</strong><small>Đơn lâu nhất đã chờ 3 giờ</small></p><ChevronDown size={15} /></div>
          </div>
        </article>
      </div>
    </section>
  );
}
