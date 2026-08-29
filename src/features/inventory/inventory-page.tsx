import { useMemo, useState } from 'react';
import { ChevronDown, Download, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { CompanyPill } from '../../components/shared/company-pill';
import { EntityModal } from '../../components/shared/entity-modal';
import { PageHeader } from '../../components/shared/page-header';
import { TableState } from '../../components/shared/table-state';
import { Button } from '../../components/ui/button';
import { useWorkspaceData } from '../../hooks/use-workspace-data';
import { companies, getStockStatus, type InventoryItem } from '../../lib/data';
import { formatCurrency } from '../../lib/utils';
import { useAppStore } from '../../store/app-store';

const availabilityOptions = ['Tất cả', 'Còn hàng', 'Hết hàng'] as const;
const createInventoryItem = (companyId: string): InventoryItem => ({
  sku: `SP-${String(Date.now()).slice(-6)}`,
  name: '',
  companyId: companyId === 'all' ? companies[1].id : companyId,
  warehouse: '',
  stock: 0,
  minimum: 0,
  unit: 'bao',
  value: 0,
});

export function InventoryPage() {
  const { data, isPending } = useWorkspaceData();
  const companyId = useAppStore((state) => state.companyId);
  const addInventoryItem = useAppStore((state) => state.addInventoryItem);
  const updateInventoryItem = useAppStore((state) => state.updateInventoryItem);
  const deleteInventoryItem = useAppStore((state) => state.deleteInventoryItem);
  const [query, setQuery] = useState('');
  const [availability, setAvailability] = useState<(typeof availabilityOptions)[number]>('Tất cả');
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [originalSku, setOriginalSku] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const filtered = useMemo(() => data.inventory.filter((item) => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = `${item.sku} ${item.name} ${item.warehouse}`.toLocaleLowerCase('vi').includes(normalizedQuery);
    const matchesAvailability = availability === 'Tất cả' || (availability === 'Còn hàng' ? item.stock > 0 : item.stock === 0);
    return matchesQuery && matchesAvailability;
  }), [availability, data.inventory, query]);
  const alerts = data.inventory.filter((item) => getStockStatus(item) !== 'Đủ hàng').length;
  const updateField = <K extends keyof InventoryItem>(key: K, value: InventoryItem[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const closeEditor = () => { setEditing(null); setOriginalSku(null); };
  const submitItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const cleanItem = { ...editing, sku: editing.sku.trim(), name: editing.name.trim(), warehouse: editing.warehouse.trim(), unit: editing.unit.trim() };
    if (originalSku) updateInventoryItem(originalSku, cleanItem);
    else addInventoryItem(cleanItem);
    closeEditor();
  };

  return <section className="content entity-page">
    <PageHeader title="Kho hàng" action={<Button onClick={() => { setOriginalSku(null); setEditing(createInventoryItem(companyId)); }}><Plus size={16} />Thêm mặt hàng</Button>} />
    <div className="summary-strip">
      <div><p><small>Mã hàng</small><strong>{data.inventory.length}</strong></p></div>
      <div><p><small>Tổng số lượng</small><strong>{data.inventory.reduce((sum, item) => sum + item.stock, 0).toLocaleString('vi-VN')}</strong></p></div>
      <div><p><small>Cần nhập thêm</small><strong>{alerts}</strong></p></div>
      <div><p><small>Giá trị tồn kho</small><strong>{formatCurrency(data.inventory.reduce((sum, item) => sum + item.value, 0), true)}</strong></p></div>
    </div>
    <article className="panel data-panel">
      <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm SKU, tên hàng hoặc kho..." aria-label="Tìm hàng tồn kho" /></div><div className="toolbar-actions"><div className="select-wrap"><Filter size={15} /><select value={availability} onChange={(event) => setAvailability(event.target.value as typeof availability)} aria-label="Lọc tình trạng tồn kho">{availabilityOptions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div><Button variant="outline" size="sm"><Download size={15} />Xuất kho</Button></div></div>
      <div className="table-scroll"><table><thead><tr><th className="index-column">STT</th><th>Tên sản phẩm</th><th>Mã sản phẩm</th><th>Công ty</th><th>Kho lưu trữ</th><th className="quantity-column">Tồn kho</th><th>Giá trị</th><th className="actions-column">Thao tác</th></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.sku}><td className="index-column">{index + 1}</td><td><strong>{item.name}</strong></td><td><span className="code-cell">{item.sku}</span></td><td><CompanyPill companyId={item.companyId} /></td><td>{item.warehouse}</td><td className="quantity-column"><strong className={item.stock === 0 ? 'stock-zero' : undefined}>{item.stock.toLocaleString('vi-VN')}</strong></td><td className="amount-cell">{formatCurrency(item.value)}</td><td><div className="row-actions"><button onClick={() => { setOriginalSku(item.sku); setEditing({ ...item }); }} aria-label={`Sửa ${item.sku}`}><Pencil size={15} /></button><button className="danger" onClick={() => setDeleteTarget(item)} aria-label={`Xóa ${item.sku}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>
      <TableState loading={isPending} empty={!isPending && filtered.length === 0} />
      <div className="table-footer"><span>Hiển thị {filtered.length} trên {data.inventory.length} mặt hàng</span><div><button disabled>Trước</button><button className="page-active">1</button><button disabled>Sau</button></div></div>
    </article>

    <EntityModal open={Boolean(editing)} title={originalSku ? 'Sửa mặt hàng' : 'Thêm mặt hàng'} description="Cập nhật số lượng và giá trị tồn kho." onClose={closeEditor}>
      {editing && <form className="modal-form" onSubmit={submitItem}><div className="form-grid">
        <label className="form-field"><span>Mã sản phẩm</span><input required value={editing.sku} readOnly={Boolean(originalSku)} onChange={(event) => updateField('sku', event.target.value)} /></label>
        <label className="form-field"><span>Tên sản phẩm</span><input required value={editing.name} onChange={(event) => updateField('name', event.target.value)} /></label>
        <label className="form-field"><span>Công ty</span><select value={editing.companyId} onChange={(event) => updateField('companyId', event.target.value)}>{companies.slice(1).map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
        <label className="form-field"><span>Kho lưu trữ</span><input required value={editing.warehouse} onChange={(event) => updateField('warehouse', event.target.value)} /></label>
        <label className="form-field"><span>Tồn kho</span><input required min="0" type="number" value={editing.stock} onChange={(event) => updateField('stock', Number(event.target.value))} /></label>
        <label className="form-field"><span>Mức tồn tối thiểu</span><input required min="0" type="number" value={editing.minimum} onChange={(event) => updateField('minimum', Number(event.target.value))} /></label>
        <label className="form-field"><span>Đơn vị</span><input required value={editing.unit} onChange={(event) => updateField('unit', event.target.value)} /></label>
        <label className="form-field"><span>Giá trị tồn kho</span><input required min="0" type="number" value={editing.value} onChange={(event) => updateField('value', Number(event.target.value))} /></label>
      </div><div className="modal-actions"><Button type="button" variant="outline" onClick={closeEditor}>Hủy</Button><Button type="submit">{originalSku ? 'Lưu thay đổi' : 'Thêm mặt hàng'}</Button></div></form>}
    </EntityModal>

    <EntityModal open={Boolean(deleteTarget)} compact title="Xóa mặt hàng?" description="Thao tác này không thể hoàn tác." onClose={() => setDeleteTarget(null)}>
      {deleteTarget && <div className="delete-confirm"><p>Bạn có chắc muốn xóa <strong>{deleteTarget.name}</strong>?</p><div className="modal-actions"><Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button><Button className="button-danger" onClick={() => { deleteInventoryItem(deleteTarget.sku); setDeleteTarget(null); }}>Xóa mặt hàng</Button></div></div>}
    </EntityModal>
  </section>;
}
