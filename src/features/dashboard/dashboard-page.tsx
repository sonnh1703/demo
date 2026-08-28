import { AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, ChevronDown, CircleCheck, Factory, Landmark, PackageCheck, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { companies, getCompany, getStockStatus } from '../../lib/data';
import { formatCurrency } from '../../lib/utils';
import { useAppStore } from '../../store/app-store';
import { useWorkspaceData } from '../../hooks/use-workspace-data';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CompanyPill } from '../../components/shared/company-pill';
import { PageHeader } from '../../components/shared/page-header';

const chartValues: Record<string, number[]> = {
  all: [4.2, 4.9, 4.6, 6.3, 7.1, 8.4],
  fusa: [1.2, 1.5, 1.4, 1.9, 2.2, 2.8],
  'au-chau': [1.6, 1.8, 1.7, 2.3, 2.6, 3.1],
  'kim-chinh': [1.4, 1.6, 1.5, 2.1, 2.3, 2.5],
};

const operationalStats: Record<string, {
  production: { today: number; finishedStock: number; materialStock: number };
  sales: { today: number; month: number; year: number; averagePrice: number; profit: number };
  finance: { income: number; expense: number; profit: number };
}> = {
  all: { production: { today: 248, finishedStock: 3240, materialStock: 1860 }, sales: { today: 186, month: 4820, year: 43600, averagePrice: 2450000, profit: 44600000000 }, finance: { income: 286400000000, expense: 241800000000, profit: 44600000000 } },
  fusa: { production: { today: 96, finishedStock: 1280, materialStock: 740 }, sales: { today: 72, month: 1860, year: 16840, averagePrice: 2180000, profit: 14200000000 }, finance: { income: 96200000000, expense: 82000000000, profit: 14200000000 } },
  'au-chau': { production: { today: 84, finishedStock: 1060, materialStock: 610 }, sales: { today: 64, month: 1670, year: 15120, averagePrice: 2960000, profit: 17400000000 }, finance: { income: 108600000000, expense: 91200000000, profit: 17400000000 } },
  'kim-chinh': { production: { today: 68, finishedStock: 900, materialStock: 510 }, sales: { today: 50, month: 1290, year: 11640, averagePrice: 2260000, profit: 13000000000 }, finance: { income: 81600000000, expense: 68600000000, profit: 13000000000 } },
};

const formatTonnes = (value: number) => `${value.toLocaleString('vi-VN')} tấn`;

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
  const operations = operationalStats[companyId] ?? operationalStats.all;
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
        <div><strong>{companyId === 'all' ? 'Báo cáo hợp nhất toàn hệ thống' : `Báo cáo riêng · ${selectedCompany.name}`}</strong><span>{companyId === 'all' ? 'Đang tổng hợp dữ liệu từ 3 công ty thành viên' : 'Mọi chỉ số và bảng dữ liệu đã được lọc theo công ty này'}</span></div>
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

      <div className="operations-overview">
        <article className="panel domain-panel production-panel">
          <div className="domain-heading"><span className="domain-icon green"><Factory size={18} /></span><div><h2>Sản xuất</h2><p>Sản lượng và tồn kho hiện tại</p></div></div>
          <div className="domain-stats">
            <div><span>Thành phẩm SX trong ngày</span><strong>{formatTonnes(operations.production.today)}</strong><small>Đạt 92% kế hoạch ngày</small></div>
            <div><span>Thành phẩm tồn kho</span><strong>{formatTonnes(operations.production.finishedStock)}</strong><small>Sẵn sàng xuất bán</small></div>
            <div><span>Nguyên liệu tồn kho</span><strong>{formatTonnes(operations.production.materialStock)}</strong><small>Đáp ứng 18 ngày sản xuất</small></div>
          </div>
        </article>

        <article className="panel domain-panel sales-panel">
          <div className="domain-heading"><span className="domain-icon blue"><TrendingUp size={18} /></span><div><h2>Kinh doanh</h2><p>Sản lượng bán và hiệu quả</p></div></div>
          <div className="domain-stats domain-stats-sales">
            <div><span>Lượng bán hôm nay</span><strong>{formatTonnes(operations.sales.today)}</strong></div>
            <div><span>Lượng bán tháng</span><strong>{formatTonnes(operations.sales.month)}</strong></div>
            <div><span>Lượng bán năm</span><strong>{formatTonnes(operations.sales.year)}</strong></div>
            <div><span>Giá bán bình quân</span><strong>{formatCurrency(operations.sales.averagePrice)}/tấn</strong></div>
            <div className="domain-highlight"><span>Lợi nhuận kinh doanh</span><strong>{formatCurrency(operations.sales.profit, true)}</strong><small>Biên lợi nhuận 15,6%</small></div>
          </div>
        </article>

        <article className="panel domain-panel finance-panel">
          <div className="domain-heading"><span className="domain-icon violet"><Landmark size={18} /></span><div><h2>Tài chính</h2><p>Luỹ kế từ đầu năm</p></div></div>
          <div className="domain-stats">
            <div><span>Tổng thu</span><strong>{formatCurrency(operations.finance.income, true)}</strong><small>+12,8% so với cùng kỳ</small></div>
            <div><span>Tổng chi</span><strong>{formatCurrency(operations.finance.expense, true)}</strong><small>84,4% tổng nguồn thu</small></div>
            <div className="domain-highlight"><span>Lãi</span><strong>{formatCurrency(operations.finance.profit, true)}</strong><small>Tỷ suất 15,6%</small></div>
          </div>
        </article>
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
            {scopedOrders.slice(0, 4).map((order) => <div className="recent-order" key={order.id}><strong>#{order.id}<small>{order.product}</small></strong><b>{formatCurrency(order.amount)}</b><Badge className={`status-${order.status.replaceAll(' ', '-').toLowerCase()}`}>{order.status}</Badge></div>)}
            {!isPending && scopedOrders.length === 0 && <div className="empty-mini">Chưa có đơn hàng trong phạm vi này.</div>}
          </div>
        </article>
      </div>

      <div className="bottom-grid">
        <article className="panel company-performance">
          <div className="panel-title"><div><h2>Hiệu suất theo công ty</h2></div><span className="live-label"><i />Trực tiếp</span></div>
          <div className="company-bars">
            {companies.slice(1).map((company, index) => {
              const amount = [38, 34, 28][index];
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
