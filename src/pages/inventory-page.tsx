import { useMemo, useState } from 'react';
import { ChevronDown, Download, Filter, MoreHorizontal, Search } from 'lucide-react';
import { CompanyPill } from '../components/company-pill';
import { PageHeader } from '../components/page-header';
import { TableState } from '../components/table-state';
import { Button } from '../components/ui/button';
import { useWorkspaceData } from '../hooks/use-workspace-data';
import { getStockStatus, type StockStatus } from '../lib/data';
import { formatCurrency } from '../lib/utils';

const statuses: Array<'Tất cả' | StockStatus> = ['Tất cả', 'Đủ hàng', 'Sắp hết', 'Hết hàng'];

export function InventoryPage() {
  const { data, isPending } = useWorkspaceData();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statuses)[number]>('Tất cả');
  const filtered = useMemo(() => (data?.inventory ?? []).filter((item) => {
    const matchesQuery = `${item.sku} ${item.name} ${item.warehouse}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'Tất cả' || getStockStatus(item) === status);
  }), [data, query, status]);
  const alerts = (data?.inventory ?? []).filter((item) => getStockStatus(item) !== 'Đủ hàng').length;

  return <section className="content entity-page">
    <PageHeader title="Kho hàng" />
    <div className="summary-strip">
      <div><p><small>Mã hàng</small><strong>{data?.inventory.length ?? '—'}</strong></p></div>
      <div><p><small>Tổng số lượng</small><strong>{data?.inventory.reduce((sum, item) => sum + item.stock, 0).toLocaleString('vi-VN') ?? '—'}</strong></p></div>
      <div><p><small>Cần nhập thêm</small><strong>{alerts}</strong></p></div>
      <div><p><small>Giá trị tồn kho</small><strong>{formatCurrency(data?.inventory.reduce((sum, item) => sum + item.value, 0) ?? 0, true)}</strong></p></div>
    </div>
    <article className="panel data-panel">
      <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm SKU, tên hàng hoặc kho..." aria-label="Tìm hàng tồn kho" /></div><div className="toolbar-actions"><div className="select-wrap"><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Lọc tồn kho">{statuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div><Button variant="outline" size="sm"><Download size={15} />Xuất kho</Button></div></div>
      <div className="table-scroll"><table><thead><tr><th className="index-column">STT</th><th>Tên sản phẩm</th><th>Mã sản phẩm</th><th>Công ty</th><th>Kho lưu trữ</th><th className="quantity-column">Tồn kho</th><th>Giá trị</th><th /></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.sku}><td className="index-column">{index + 1}</td><td><strong>{item.name}</strong></td><td><span className="code-cell">{item.sku}</span></td><td><CompanyPill companyId={item.companyId} /></td><td>{item.warehouse}</td><td className="quantity-column"><strong>{item.stock.toLocaleString('vi-VN')}</strong></td><td className="amount-cell">{formatCurrency(item.value)}</td><td><button className="row-menu" aria-label={`Tùy chọn ${item.sku}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
      <TableState loading={isPending} empty={!isPending && filtered.length === 0} />
      <div className="table-footer"><span>Hiển thị {filtered.length} trên {data?.inventory.length ?? 0} mặt hàng</span><div><button disabled>Trước</button><button className="page-active">1</button><button disabled>Sau</button></div></div>
    </article>
  </section>;
}
