import { useMemo, useState } from 'react';
import { ChevronDown, Filter, MoreHorizontal, Search } from 'lucide-react';
import { CompanyPill } from '../components/company-pill';
import { PageHeader } from '../components/page-header';
import { TableState } from '../components/table-state';
import { Badge } from '../components/ui/badge';
import { useWorkspaceData } from '../hooks/use-workspace-data';

const roles = ['Tất cả vai trò', 'Quản lý công ty', 'Kế toán', 'Quản lý kho', 'Nhân viên bán hàng'];
const roleClass: Record<string, string> = {
  'Quản lý công ty': 'role-manager',
  'Kế toán': 'role-accounting',
  'Quản lý kho': 'role-inventory',
  'Nhân viên bán hàng': 'role-sales',
};

export function UsersPage() {
  const { data, isPending } = useWorkspaceData();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState(roles[0]);
  const filtered = useMemo(() => (data?.users ?? []).filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()) && (role === roles[0] || user.role === role)), [data, query, role]);
  const active = data?.users.filter((user) => user.status === 'Đang hoạt động').length ?? 0;

  return <section className="content entity-page">
    <PageHeader title="Người dùng" />
    <div className="summary-strip summary-three">
      <div><p><small>Tổng người dùng</small><strong>{data?.users.length ?? '—'}</strong></p></div>
      <div><p><small>Đang hoạt động</small><strong>{active}</strong></p></div>
      <div><p><small>Tạm khóa</small><strong>{data?.users.filter((user) => user.status === 'Tạm khóa').length ?? '—'}</strong></p></div>
    </div>
    <article className="panel data-panel">
      <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc email..." aria-label="Tìm người dùng" /></div><div className="toolbar-actions"><div className="select-wrap"><Filter size={15} /><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Lọc vai trò">{roles.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div></div></div>
      <div className="table-scroll"><table><thead><tr><th className="index-column">STT</th><th>Tên người dùng</th><th>Email</th><th>Công ty</th><th className="role-column">Vai trò</th><th className="status-column">Trạng thái</th><th /></tr></thead><tbody>{filtered.map((user, index) => <tr key={user.id}><td className="index-column">{index + 1}</td><td><strong>{user.name}</strong></td><td><a className="email-cell" href={`mailto:${user.email}`}>{user.email}</a></td><td><CompanyPill companyId={user.companyId} /></td><td className="role-column"><span className={`role-label ${roleClass[user.role] ?? 'role-default'}`}>{user.role}</span></td><td className="status-column"><Badge className={user.status === 'Đang hoạt động' ? 'user-active' : 'user-locked'}>{user.status}</Badge></td><td><button className="row-menu" aria-label={`Tùy chọn ${user.name}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
      <TableState loading={isPending} empty={!isPending && filtered.length === 0} />
      <div className="table-footer"><span>Hiển thị {filtered.length} trên {data?.users.length ?? 0} người dùng</span><div><button disabled>Trước</button><button className="page-active">1</button><button disabled>Sau</button></div></div>
    </article>
  </section>;
}
