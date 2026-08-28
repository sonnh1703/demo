import { useMemo, useRef, useState } from 'react';
import { ChevronDown, Download, Filter, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { CompanyPill } from '../../components/shared/company-pill';
import { EntityModal } from '../../components/shared/entity-modal';
import { PageHeader } from '../../components/shared/page-header';
import { TableState } from '../../components/shared/table-state';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useWorkspaceData } from '../../hooks/use-workspace-data';
import { companies, type Order, type OrderStatus } from '../../lib/data';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAppStore } from '../../store/app-store';

const statuses: Array<'Tất cả' | OrderStatus> = ['Tất cả', 'Chờ duyệt', 'Đã xác nhận', 'Đang xử lý', 'Đã giao'];
const orderStatuses = statuses.slice(1) as OrderStatus[];
const createOrder = (companyId: string): Order => ({
  id: `DH-${String(Date.now()).slice(-6)}`,
  companyId: companyId === 'all' ? companies[1].id : companyId,
  product: '',
  customer: '',
  amount: 0,
  status: 'Chờ duyệt',
  date: new Date().toISOString().slice(0, 10),
  items: 1,
});

export function OrdersPage() {
  const { data, isPending } = useWorkspaceData();
  const companyId = useAppStore((state) => state.companyId);
  const addOrder = useAppStore((state) => state.addOrder);
  const updateOrder = useAppStore((state) => state.updateOrder);
  const deleteOrder = useAppStore((state) => state.deleteOrder);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statuses)[number]>('Tất cả');
  const [createdDate, setCreatedDate] = useState('');
  const [editing, setEditing] = useState<Order | null>(null);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => data.orders.filter((order) => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = `${order.id} ${order.product} ${order.customer}`.toLocaleLowerCase('vi').includes(normalizedQuery);
    const matchesStatus = status === 'Tất cả' || order.status === status;
    const matchesDate = !createdDate || order.date === createdDate;
    return matchesQuery && matchesStatus && matchesDate;
  }), [createdDate, data.orders, query, status]);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    try {
      if (typeof input.showPicker === 'function') input.showPicker();
      else { input.focus(); input.click(); }
    } catch { input.focus(); input.click(); }
  };
  const updateField = <K extends keyof Order>(key: K, value: Order[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const closeEditor = () => { setEditing(null); setOriginalId(null); };
  const submitOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const cleanOrder = { ...editing, id: editing.id.trim(), product: editing.product.trim(), customer: editing.customer.trim() };
    if (originalId) updateOrder(originalId, cleanOrder);
    else addOrder(cleanOrder);
    closeEditor();
  };

  return <section className="content entity-page">
    <PageHeader title="Đơn hàng" action={<Button onClick={() => { setOriginalId(null); setEditing(createOrder(companyId)); }}><Plus size={16} />Thêm đơn hàng</Button>} />
    <div className="summary-strip">
      <div><p><small>Tổng đơn hàng</small><strong>{data.orders.length}</strong></p></div>
      <div><p><small>Chờ duyệt</small><strong>{data.orders.filter((order) => order.status === 'Chờ duyệt').length}</strong></p></div>
      <div><p><small>Đang xử lý</small><strong>{data.orders.filter((order) => order.status === 'Đang xử lý').length}</strong></p></div>
      <div><p><small>Tổng giá trị</small><strong>{formatCurrency(data.orders.reduce((sum, order) => sum + order.amount, 0), true)}</strong></p></div>
    </div>
    <article className="panel data-panel">
      <div className="table-toolbar">
        <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, mặt hàng hoặc khách hàng..." aria-label="Tìm đơn hàng" /></div>
        <div className="toolbar-actions"><div className="date-wrap"><input ref={dateInputRef} className="hidden-date-picker" type="date" value={createdDate} onChange={(event) => setCreatedDate(event.target.value)} tabIndex={-1} aria-hidden="true" /><button className="date-picker-trigger" type="button" onClick={openDatePicker} aria-label="Chọn ngày tạo"><span className={createdDate ? 'date-display date-selected' : 'date-display'}>{createdDate ? formatDate(createdDate) : 'Ngày tạo'}</span></button>{createdDate && <button className="date-clear" type="button" onClick={() => setCreatedDate('')} aria-label="Xóa ngày lọc"><X size={13} /></button>}</div><div className="select-wrap"><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Lọc trạng thái">{statuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div><Button variant="outline" size="sm"><Download size={15} />Xuất dữ liệu</Button></div>
      </div>
      <div className="table-scroll"><table><thead><tr><th className="index-column">STT</th><th>Mã đơn</th><th>Mặt hàng</th><th className="quantity-column">Số lượng</th><th>Khách hàng</th><th>Công ty</th><th>Ngày tạo</th><th>Giá trị</th><th className="status-column">Trạng thái</th><th className="actions-column">Thao tác</th></tr></thead><tbody>{filtered.map((order, index) => <tr key={order.id}><td className="index-column">{index + 1}</td><td><strong>#{order.id}</strong></td><td><strong>{order.product}</strong></td><td className="quantity-column">{order.items}</td><td>{order.customer}</td><td><CompanyPill companyId={order.companyId} /></td><td>{formatDate(order.date)}</td><td className="amount-cell">{formatCurrency(order.amount)}</td><td className="status-column"><Badge className={`status-${order.status.replaceAll(' ', '-').toLowerCase()}`}>{order.status}</Badge></td><td><div className="row-actions"><button onClick={() => { setOriginalId(order.id); setEditing({ ...order }); }} aria-label={`Sửa ${order.id}`}><Pencil size={15} /></button><button className="danger" onClick={() => setDeleteTarget(order)} aria-label={`Xóa ${order.id}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>
      <TableState loading={isPending} empty={!isPending && filtered.length === 0} />
      <div className="table-footer"><span>Hiển thị {filtered.length} trên {data.orders.length} đơn hàng</span><div><button disabled>Trước</button><button className="page-active">1</button><button disabled>Sau</button></div></div>
    </article>

    <EntityModal open={Boolean(editing)} title={originalId ? 'Sửa đơn hàng' : 'Thêm đơn hàng'} description="Cập nhật đầy đủ thông tin giao dịch." onClose={closeEditor}>
      {editing && <form className="modal-form" onSubmit={submitOrder}><div className="form-grid">
        <label className="form-field"><span>Mã đơn</span><input required value={editing.id} readOnly={Boolean(originalId)} onChange={(event) => updateField('id', event.target.value)} /></label>
        <label className="form-field"><span>Ngày tạo</span><input required type="date" value={editing.date} onChange={(event) => updateField('date', event.target.value)} /></label>
        <label className="form-field form-span-2"><span>Mặt hàng</span><input required value={editing.product} onChange={(event) => updateField('product', event.target.value)} /></label>
        <label className="form-field form-span-2"><span>Khách hàng</span><input required value={editing.customer} onChange={(event) => updateField('customer', event.target.value)} /></label>
        <label className="form-field"><span>Số lượng</span><input required inputMode="numeric" type="text" value={editing.items === 0 ? '' : editing.items.toLocaleString('vi-VN')} onChange={(event) => updateField('items', Number(event.target.value.replace(/\D/g, '')))} /></label>
        <label className="form-field"><span>Giá trị</span><input required inputMode="numeric" type="text" value={editing.amount === 0 ? '' : editing.amount.toLocaleString('vi-VN')} onChange={(event) => updateField('amount', Number(event.target.value.replace(/\D/g, '')))} /></label>
        <label className="form-field"><span>Công ty</span><select value={editing.companyId} onChange={(event) => updateField('companyId', event.target.value)}>{companies.slice(1).map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
        <label className="form-field"><span>Trạng thái</span><select value={editing.status} onChange={(event) => updateField('status', event.target.value as OrderStatus)}>{orderStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div><div className="modal-actions"><Button type="button" variant="outline" onClick={closeEditor}>Hủy</Button><Button type="submit">{originalId ? 'Lưu thay đổi' : 'Thêm đơn hàng'}</Button></div></form>}
    </EntityModal>

    <EntityModal open={Boolean(deleteTarget)} compact title="Xóa đơn hàng?" description="Thao tác này không thể hoàn tác." onClose={() => setDeleteTarget(null)}>
      {deleteTarget && <div className="delete-confirm"><p>Bạn có chắc muốn xóa đơn <strong>#{deleteTarget.id}</strong>?</p><div className="modal-actions"><Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button><Button className="button-danger" onClick={() => { deleteOrder(deleteTarget.id); setDeleteTarget(null); }}>Xóa đơn hàng</Button></div></div>}
    </EntityModal>
  </section>;
}
