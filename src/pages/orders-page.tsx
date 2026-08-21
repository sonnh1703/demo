import { useMemo, useState } from 'react';
import { ChevronDown, Download, Filter, MoreHorizontal, Search } from 'lucide-react';
import { CompanyPill } from '../components/company-pill';
import { PageHeader } from '../components/page-header';
import { TableState } from '../components/table-state';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useWorkspaceData } from '../hooks/use-workspace-data';
import type { OrderStatus } from '../lib/data';
import { formatCurrency, formatDate } from '../lib/utils';

const statuses: Array<'Tất cả' | OrderStatus> = ['Tất cả', 'Chờ duyệt', 'Đã xác nhận', 'Đang xử lý', 'Đã giao'];

export function OrdersPage() {
  const { data, isPending } = useWorkspaceData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statuses)[number]>('Tất cả');
  const filtered = useMemo(() => (data?.orders ?? []).filter((order) => {
    const matchesQuery = `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'Tất cả' || order.status === status);
  }), [data, query, status]);

  return <section className="content entity-page">
    <PageHeader title="Đơn hàng" />
    <div className="summary-strip">
      <div><p><small>Tổng đơn hàng</small><strong>{data?.orders.length ?? '—'}</strong></p></div>
      <div><p><small>Chờ duyệt</small><strong>{data?.orders.filter((o) => o.status === 'Chờ duyệt').length ?? '—'}</strong></p></div>
      <div><p><small>Đang xử lý</small><strong>{data?.orders.filter((o) => o.status === 'Đang xử lý').length ?? '—'}</strong></p></div>
      <div><p><small>Tổng giá trị</small><strong>{formatCurrency(data?.orders.reduce((sum, o) => sum + o.amount, 0) ?? 0, true)}</strong></p></div>
    </div>
    <article className="panel data-panel">
      <div className="table-toolbar">
        <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn hoặc khách hàng..." aria-label="Tìm đơn hàng" /></div>
        <div className="toolbar-actions"><div className="select-wrap"><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Lọc trạng thái">{statuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div><Button variant="outline" size="sm"><Download size={15} />Xuất dữ liệu</Button></div>
      </div>
      <div className="table-scroll"><table><thead><tr><th className="index-column">STT</th><th>Mã đơn</th><th className="quantity-column">Số lượng</th><th>Khách hàng</th><th>Công ty</th><th>Ngày tạo</th><th>Giá trị</th><th className="status-column">Trạng thái</th><th /></tr></thead><tbody>{filtered.map((order, index) => <tr key={order.id}><td className="index-column">{index + 1}</td><td><strong>#{order.id}</strong></td><td className="quantity-column">{order.items}</td><td>{order.customer}</td><td><CompanyPill companyId={order.companyId} /></td><td>{formatDate(order.date)}</td><td className="amount-cell">{formatCurrency(order.amount)}</td><td className="status-column"><Badge className={`status-${order.status.replaceAll(' ', '-').toLowerCase()}`}>{order.status}</Badge></td><td><button className="row-menu" aria-label={`Tùy chọn ${order.id}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
      <TableState loading={isPending} empty={!isPending && filtered.length === 0} />
      <div className="table-footer"><span>Hiển thị {filtered.length} trên {data?.orders.length ?? 0} đơn hàng</span><div><button disabled>Trước</button><button className="page-active">1</button><button disabled>Sau</button></div></div>
    </article>
  </section>;
}
