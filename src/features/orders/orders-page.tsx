import { useMemo, useState } from 'react';
import { ChevronDown, Download, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { CompanyPill } from '../../components/shared/company-pill';
import { EntityModal } from '../../components/shared/entity-modal';
import { PageHeader } from '../../components/shared/page-header';
import { TableState } from '../../components/shared/table-state';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useWorkspaceData } from '../../hooks/use-workspace-data';
import { companies, getOrderNetRevenue, type Order, type OrderSource, type OrderStatus, type ShippingStatus } from '../../lib/data';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAppStore } from '../../store/app-store';

const statuses: Array<'Tất cả' | OrderStatus> = ['Tất cả', 'Chờ duyệt', 'Đã xác nhận', 'Đang xử lý', 'Đã giao'];
const orderStatuses = statuses.slice(1) as OrderStatus[];
const shippingStatusFilters: Array<'Tất cả' | ShippingStatus> = ['Tất cả', 'Chưa giao', 'Đang giao', 'Đã giao', 'Giao thất bại', 'Hoàn hàng'];
const shippingStatuses = shippingStatusFilters.slice(1) as ShippingStatus[];
const orderSources: OrderSource[] = ['Website', 'Điện thoại', 'Sàn TMĐT', 'Đại lý', 'Facebook/Zalo'];

const createOrder = (companyId: string): Order => ({
  id: `DH-${String(Date.now()).slice(-6)}`,
  companyId: companyId === 'all' ? companies[1].id : companyId,
  product: '',
  customer: '',
  phone: '',
  source: 'Website',
  items: 1,
  subtotal: 0,
  discount: 0,
  returned: 0,
  shippingFee: 0,
  status: 'Chờ duyệt',
  shippingStatus: 'Chưa giao',
  warehouse: '',
  affiliate: '',
  date: new Date().toISOString().slice(0, 10),
});

export function OrdersPage() {
  const { data, isPending } = useWorkspaceData();
  const companyId = useAppStore((state) => state.companyId);
  const addOrder = useAppStore((state) => state.addOrder);
  const updateOrder = useAppStore((state) => state.updateOrder);
  const deleteOrder = useAppStore((state) => state.deleteOrder);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statuses)[number]>('Tất cả');
  const [shippingStatusFilter, setShippingStatusFilter] = useState<(typeof shippingStatusFilters)[number]>('Tất cả');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editing, setEditing] = useState<Order | null>(null);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const filtered = useMemo(() => data.orders.filter((order) => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = `${order.id} ${order.product} ${order.customer} ${order.phone}`.toLocaleLowerCase('vi').includes(normalizedQuery);
    const matchesStatus = status === 'Tất cả' || order.status === status;
    const matchesShipping = shippingStatusFilter === 'Tất cả' || order.shippingStatus === shippingStatusFilter;
    const matchesDateFrom = !dateFrom || order.date >= dateFrom;
    const matchesDateTo = !dateTo || order.date <= dateTo;
    return matchesQuery && matchesStatus && matchesShipping && matchesDateFrom && matchesDateTo;
  }), [data.orders, dateFrom, dateTo, query, shippingStatusFilter, status]);

  const pendingCount = data.orders.filter((order) => order.status === 'Chờ duyệt').length;
  const shippingCount = data.orders.filter((order) => order.shippingStatus === 'Đang giao').length;
  const totalNetRevenue = data.orders.reduce((sum, order) => sum + getOrderNetRevenue(order), 0);

  const updateField = <K extends keyof Order>(key: K, value: Order[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const closeEditor = () => { setEditing(null); setOriginalId(null); };
  const submitOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const cleanOrder = { ...editing, id: editing.id.trim(), product: editing.product.trim(), customer: editing.customer.trim(), phone: editing.phone.trim(), warehouse: editing.warehouse.trim(), affiliate: editing.affiliate.trim() };
    if (originalId) updateOrder(originalId, cleanOrder);
    else addOrder(cleanOrder);
    closeEditor();
  };

  return <section className="content entity-page">
    <PageHeader title="Đơn hàng" action={<Button onClick={() => { setOriginalId(null); setEditing(createOrder(companyId)); }}><Plus size={16} />Thêm đơn hàng</Button>} />
    <div className="summary-strip">
      <div><p><small>Tổng đơn hàng</small><strong>{data.orders.length}</strong></p></div>
      <div><p><small>Chờ duyệt</small><strong>{pendingCount}</strong></p></div>
      <div><p><small>Đang giao hàng</small><strong>{shippingCount}</strong></p></div>
      <div><p><small>Tổng doanh thu thuần</small><strong>{formatCurrency(totalNetRevenue, true)}</strong></p></div>
    </div>
    <article className="panel data-panel">
      <div className="table-toolbar">
        <div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, mặt hàng, khách hàng hoặc SĐT..." aria-label="Tìm đơn hàng" /></div>
        <div className="toolbar-actions">
          <div className="date-range">
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="Lọc từ ngày" />
            <span>đến</span>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="Lọc đến ngày" />
          </div>
          <div className="select-wrap"><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Lọc trạng thái">{statuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div>
          <div className="select-wrap"><Filter size={15} /><select value={shippingStatusFilter} onChange={(event) => setShippingStatusFilter(event.target.value as typeof shippingStatusFilter)} aria-label="Lọc trạng thái vận chuyển">{shippingStatusFilters.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div>
          <Button variant="outline" size="sm"><Download size={15} />Xuất dữ liệu</Button>
        </div>
      </div>
      <div className="table-scroll orders-scroll"><table><thead><tr>
        <th className="index-column">STT</th>
        <th>Mã đơn</th>
        <th>Ngày tạo</th>
        <th>Tên khách hàng</th>
        <th>SĐT</th>
        <th>Nguồn đơn</th>
        <th>Công ty</th>
        <th>Tên kho</th>
        <th className="quantity-column">Số lượng</th>
        <th>Tiền hàng</th>
        <th>Giảm giá</th>
        <th>Trả lại</th>
        <th>Phí giao hàng</th>
        <th>Doanh thu thuần</th>
        <th className="status-column">Trạng thái</th>
        <th className="shipping-column">Vận chuyển</th>
        <th className="aff-column">Aff</th>
        <th className="actions-column">Thao tác</th>
      </tr></thead><tbody>{filtered.map((order, index) => <tr key={order.id}>
        <td className="index-column">{index + 1}</td>
        <td><strong>#{order.id}</strong><small>{order.product}</small></td>
        <td>{formatDate(order.date)}</td>
        <td>{order.customer}</td>
        <td className="phone-cell">{order.phone || '—'}</td>
        <td>{order.source}</td>
        <td><CompanyPill companyId={order.companyId} /></td>
        <td>{order.warehouse}</td>
        <td className="quantity-column">{order.items}</td>
        <td className="amount-cell">{formatCurrency(order.subtotal)}</td>
        <td>{order.discount > 0 ? formatCurrency(order.discount) : '—'}</td>
        <td>{order.returned > 0 ? formatCurrency(order.returned) : '—'}</td>
        <td>{formatCurrency(order.shippingFee)}</td>
        <td className="amount-cell">{formatCurrency(getOrderNetRevenue(order))}</td>
        <td className="status-column"><Badge className={`status-${order.status.replaceAll(' ', '-').toLowerCase()}`}>{order.status}</Badge></td>
        <td className="shipping-column"><Badge className={`status-${order.shippingStatus.replaceAll(' ', '-').toLowerCase()}`}>{order.shippingStatus}</Badge></td>
        <td className="aff-column">{order.affiliate || '—'}</td>
        <td><div className="row-actions"><button onClick={() => { setOriginalId(order.id); setEditing({ ...order }); }} aria-label={`Sửa ${order.id}`}><Pencil size={15} /></button><button className="danger" onClick={() => setDeleteTarget(order)} aria-label={`Xóa ${order.id}`}><Trash2 size={15} /></button></div></td>
      </tr>)}</tbody></table></div>
      <TableState loading={isPending} empty={!isPending && filtered.length === 0} />
      <div className="table-footer"><span>Hiển thị {filtered.length} trên {data.orders.length} đơn hàng</span><div><button disabled>Trước</button><button className="page-active">1</button><button disabled>Sau</button></div></div>
    </article>

    <EntityModal open={Boolean(editing)} wide title={originalId ? 'Sửa đơn hàng' : 'Thêm đơn hàng'} description="Cập nhật đầy đủ thông tin giao dịch." onClose={closeEditor}>
      {editing && <form className="modal-form" onSubmit={submitOrder}><div className="form-grid-3">
        <label className="form-field"><span>Mã đơn</span><input required value={editing.id} readOnly={Boolean(originalId)} onChange={(event) => updateField('id', event.target.value)} /></label>
        <label className="form-field"><span>Ngày tạo</span><input required type="date" value={editing.date} onChange={(event) => updateField('date', event.target.value)} /></label>
        <label className="form-field"><span>Nguồn đơn</span><select value={editing.source} onChange={(event) => updateField('source', event.target.value as OrderSource)}>{orderSources.map((item) => <option key={item}>{item}</option>)}</select></label>

        <label className="form-field form-span-2"><span>Tên khách hàng</span><input required value={editing.customer} onChange={(event) => updateField('customer', event.target.value)} /></label>
        <label className="form-field"><span>Số điện thoại</span><input value={editing.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>

        <label className="form-field form-span-2"><span>Mặt hàng</span><input required value={editing.product} onChange={(event) => updateField('product', event.target.value)} /></label>
        <label className="form-field"><span>Số lượng</span><input required inputMode="numeric" type="text" value={editing.items === 0 ? '' : editing.items.toLocaleString('vi-VN')} onChange={(event) => updateField('items', Number(event.target.value.replace(/\D/g, '')))} /></label>

        <label className="form-field"><span>Công ty</span><select value={editing.companyId} onChange={(event) => updateField('companyId', event.target.value)}>{companies.slice(1).map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
        <label className="form-field"><span>Tên kho</span><input required value={editing.warehouse} onChange={(event) => updateField('warehouse', event.target.value)} /></label>
        <label className="form-field"><span>Aff (nếu có)</span><input value={editing.affiliate} onChange={(event) => updateField('affiliate', event.target.value)} placeholder="—" /></label>

        <label className="form-field"><span>Tiền hàng</span><input required inputMode="numeric" type="text" value={editing.subtotal === 0 ? '' : editing.subtotal.toLocaleString('vi-VN')} onChange={(event) => updateField('subtotal', Number(event.target.value.replace(/\D/g, '')))} /></label>
        <label className="form-field"><span>Giảm giá</span><input inputMode="numeric" type="text" value={editing.discount === 0 ? '' : editing.discount.toLocaleString('vi-VN')} onChange={(event) => updateField('discount', Number(event.target.value.replace(/\D/g, '')))} /></label>
        <label className="form-field"><span>Tiền hàng trả lại</span><input inputMode="numeric" type="text" value={editing.returned === 0 ? '' : editing.returned.toLocaleString('vi-VN')} onChange={(event) => updateField('returned', Number(event.target.value.replace(/\D/g, '')))} /></label>

        <label className="form-field"><span>Phí giao hàng</span><input inputMode="numeric" type="text" value={editing.shippingFee === 0 ? '' : editing.shippingFee.toLocaleString('vi-VN')} onChange={(event) => updateField('shippingFee', Number(event.target.value.replace(/\D/g, '')))} /></label>
        <label className="form-field"><span>Trạng thái</span><select value={editing.status} onChange={(event) => updateField('status', event.target.value as OrderStatus)}>{orderStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="form-field"><span>Trạng thái vận chuyển</span><select value={editing.shippingStatus} onChange={(event) => updateField('shippingStatus', event.target.value as ShippingStatus)}>{shippingStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>

        <div className="form-note"><span>Doanh thu thuần (tự tính = tiền hàng − giảm giá − trả lại)</span><strong>{formatCurrency(editing.subtotal - editing.discount - editing.returned)}</strong></div>
      </div><div className="modal-actions"><Button type="button" variant="outline" onClick={closeEditor}>Hủy</Button><Button type="submit">{originalId ? 'Lưu thay đổi' : 'Thêm đơn hàng'}</Button></div></form>}
    </EntityModal>

    <EntityModal open={Boolean(deleteTarget)} compact title="Xóa đơn hàng?" description="Thao tác này không thể hoàn tác." onClose={() => setDeleteTarget(null)}>
      {deleteTarget && <div className="delete-confirm"><p>Bạn có chắc muốn xóa đơn <strong>#{deleteTarget.id}</strong>?</p><div className="modal-actions"><Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button><Button className="button-danger" onClick={() => { deleteOrder(deleteTarget.id); setDeleteTarget(null); }}>Xóa đơn hàng</Button></div></div>}
    </EntityModal>
  </section>;
}
