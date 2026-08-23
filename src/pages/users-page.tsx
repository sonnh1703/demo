import { useMemo, useState } from 'react';
import { ChevronDown, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { CompanyPill } from '../components/company-pill';
import { EntityModal } from '../components/entity-modal';
import { PageHeader } from '../components/page-header';
import { TableState } from '../components/table-state';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useWorkspaceData } from '../hooks/use-workspace-data';
import { companies, type EnterpriseUser, type UserStatus } from '../lib/data';
import { useAppStore } from '../store/app-store';

const roles = ['Tất cả vai trò', 'Quản lý công ty', 'Kế toán', 'Quản lý kho', 'Nhân viên bán hàng'];
const formRoles = roles.slice(1);
const userStatuses = ['Tất cả trạng thái', 'Đang hoạt động', 'Tạm khóa'] as const;
const formStatuses: UserStatus[] = ['Đang hoạt động', 'Tạm khóa'];
const roleClass: Record<string, string> = {
  'Quản lý công ty': 'role-manager',
  'Kế toán': 'role-accounting',
  'Quản lý kho': 'role-inventory',
  'Nhân viên bán hàng': 'role-sales',
};
const createUser = (companyId: string): EnterpriseUser => ({
  id: `u-${Date.now()}`,
  name: '',
  email: '',
  companyId: companyId === 'all' ? companies[1].id : companyId,
  role: 'Nhân viên bán hàng',
  status: 'Đang hoạt động',
  lastActive: new Date().toISOString(),
  initials: '',
});
const makeInitials = (name: string) => name.trim().split(/\s+/).slice(-2).map((part) => part[0]?.toLocaleUpperCase('vi') ?? '').join('');

export function UsersPage() {
  const { data, isPending } = useWorkspaceData();
  const companyId = useAppStore((state) => state.companyId);
  const addUser = useAppStore((state) => state.addUser);
  const updateUser = useAppStore((state) => state.updateUser);
  const deleteUser = useAppStore((state) => state.deleteUser);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [userStatus, setUserStatus] = useState<(typeof userStatuses)[number]>(userStatuses[0]);
  const [editing, setEditing] = useState<EnterpriseUser | null>(null);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EnterpriseUser | null>(null);

  const filtered = useMemo(() => data.users.filter((user) => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    const matchesQuery = `${user.name} ${user.email}`.toLocaleLowerCase('vi').includes(normalizedQuery);
    const matchesRole = role === roles[0] || user.role === role;
    const matchesStatus = userStatus === userStatuses[0] || user.status === userStatus;
    return matchesQuery && matchesRole && matchesStatus;
  }), [data.users, query, role, userStatus]);
  const active = data.users.filter((user) => user.status === 'Đang hoạt động').length;
  const updateField = <K extends keyof EnterpriseUser>(key: K, value: EnterpriseUser[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const closeEditor = () => { setEditing(null); setOriginalId(null); };
  const submitUser = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const cleanName = editing.name.trim();
    const cleanUser = { ...editing, name: cleanName, email: editing.email.trim(), initials: makeInitials(cleanName), lastActive: new Date().toISOString() };
    if (originalId) updateUser(originalId, cleanUser);
    else addUser(cleanUser);
    closeEditor();
  };

  return <section className="content entity-page">
    <PageHeader title="Người dùng" action={<Button onClick={() => { setOriginalId(null); setEditing(createUser(companyId)); }}><Plus size={16} />Thêm người dùng</Button>} />
    <div className="summary-strip summary-three">
      <div><p><small>Tổng người dùng</small><strong>{data.users.length}</strong></p></div>
      <div><p><small>Đang hoạt động</small><strong>{active}</strong></p></div>
      <div><p><small>Tạm khóa</small><strong>{data.users.filter((user) => user.status === 'Tạm khóa').length}</strong></p></div>
    </div>
    <article className="panel data-panel">
      <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc email..." aria-label="Tìm người dùng" /></div><div className="toolbar-actions"><div className="select-wrap"><Filter size={15} /><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Lọc vai trò">{roles.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div><div className="select-wrap"><Filter size={15} /><select value={userStatus} onChange={(event) => setUserStatus(event.target.value as typeof userStatus)} aria-label="Lọc trạng thái người dùng">{userStatuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div></div></div>
      <div className="table-scroll"><table><thead><tr><th className="index-column">STT</th><th>Tên người dùng</th><th>Email</th><th>Công ty</th><th className="role-column">Vai trò</th><th className="status-column">Trạng thái</th><th className="actions-column">Thao tác</th></tr></thead><tbody>{filtered.map((user, index) => <tr key={user.id}><td className="index-column">{index + 1}</td><td><strong>{user.name}</strong></td><td><a className="email-cell" href={`mailto:${user.email}`}>{user.email}</a></td><td><CompanyPill companyId={user.companyId} /></td><td className="role-column"><span className={`role-label ${roleClass[user.role] ?? 'role-default'}`}>{user.role}</span></td><td className="status-column"><Badge className={user.status === 'Đang hoạt động' ? 'user-active' : 'user-locked'}>{user.status}</Badge></td><td><div className="row-actions"><button onClick={() => { setOriginalId(user.id); setEditing({ ...user }); }} aria-label={`Sửa ${user.name}`}><Pencil size={15} /></button><button className="danger" onClick={() => setDeleteTarget(user)} aria-label={`Xóa ${user.name}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>
      <TableState loading={isPending} empty={!isPending && filtered.length === 0} />
      <div className="table-footer"><span>Hiển thị {filtered.length} trên {data.users.length} người dùng</span><div><button disabled>Trước</button><button className="page-active">1</button><button disabled>Sau</button></div></div>
    </article>

    <EntityModal open={Boolean(editing)} title={originalId ? 'Sửa người dùng' : 'Thêm người dùng'} description="Thiết lập thông tin và quyền truy cập." onClose={closeEditor}>
      {editing && <form className="modal-form" onSubmit={submitUser}><div className="form-grid">
        <label className="form-field form-span-2"><span>Họ và tên</span><input required value={editing.name} onChange={(event) => updateField('name', event.target.value)} /></label>
        <label className="form-field form-span-2"><span>Email</span><input required type="email" value={editing.email} onChange={(event) => updateField('email', event.target.value)} /></label>
        <label className="form-field"><span>Công ty</span><select value={editing.companyId} onChange={(event) => updateField('companyId', event.target.value)}>{companies.slice(1).map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
        <label className="form-field"><span>Vai trò</span><select value={editing.role} onChange={(event) => updateField('role', event.target.value)}>{formRoles.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="form-field form-span-2"><span>Trạng thái</span><select value={editing.status} onChange={(event) => updateField('status', event.target.value as UserStatus)}>{formStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div><div className="modal-actions"><Button type="button" variant="outline" onClick={closeEditor}>Hủy</Button><Button type="submit">{originalId ? 'Lưu thay đổi' : 'Thêm người dùng'}</Button></div></form>}
    </EntityModal>

    <EntityModal open={Boolean(deleteTarget)} compact title="Xóa người dùng?" description="Thao tác này không thể hoàn tác." onClose={() => setDeleteTarget(null)}>
      {deleteTarget && <div className="delete-confirm"><p>Bạn có chắc muốn xóa người dùng <strong>{deleteTarget.name}</strong>?</p><div className="modal-actions"><Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button><Button className="button-danger" onClick={() => { deleteUser(deleteTarget.id); setDeleteTarget(null); }}>Xóa người dùng</Button></div></div>}
    </EntityModal>
  </section>;
}
