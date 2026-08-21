export type Company = { id: string; name: string; shortName: string; color: string };
export type OrderStatus = 'Đã xác nhận' | 'Đang xử lý' | 'Chờ duyệt' | 'Đã giao';
export type StockStatus = 'Đủ hàng' | 'Sắp hết' | 'Hết hàng';
export type UserStatus = 'Đang hoạt động' | 'Tạm khóa';

export type Order = { id: string; companyId: string; customer: string; amount: number; status: OrderStatus; date: string; items: number };
export type InventoryItem = { sku: string; name: string; companyId: string; warehouse: string; stock: number; minimum: number; unit: string; value: number };
export type EnterpriseUser = { id: string; name: string; email: string; companyId: string; role: string; status: UserStatus; lastActive: string; initials: string };

export const companies: Company[] = [
  { id: 'all', name: 'Tất cả công ty', shortName: 'Toàn hệ thống', color: '#245c49' },
  { id: 'nexora-retail', name: 'Nexora Retail', shortName: 'Bán lẻ', color: '#34785d' },
  { id: 'minh-long', name: 'Minh Long Foods', shortName: 'Thực phẩm', color: '#c88435' },
  { id: 'nexora-distribution', name: 'Nexora Distribution', shortName: 'Phân phối', color: '#7164a8' },
  { id: 'an-phu', name: 'An Phú Manufacturing', shortName: 'Sản xuất', color: '#4f7d92' },
];

export const orders: Order[] = [
  { id: 'DH-2841', companyId: 'nexora-retail', customer: 'Công ty Đông Nam', amount: 12840000, status: 'Đã xác nhận', date: '2026-08-22', items: 8 },
  { id: 'DH-2840', companyId: 'minh-long', customer: 'Siêu thị Ánh Dương', amount: 8250000, status: 'Chờ duyệt', date: '2026-08-22', items: 14 },
  { id: 'DH-2839', companyId: 'nexora-distribution', customer: 'Đại lý Hưng Thịnh', amount: 24630000, status: 'Đang xử lý', date: '2026-08-21', items: 21 },
  { id: 'DH-2838', companyId: 'an-phu', customer: 'Nội thất Mộc Việt', amount: 45720000, status: 'Đã giao', date: '2026-08-21', items: 5 },
  { id: 'DH-2837', companyId: 'nexora-retail', customer: 'Nguyễn Hoàng Nam', amount: 4690000, status: 'Đã giao', date: '2026-08-20', items: 3 },
  { id: 'DH-2836', companyId: 'minh-long', customer: 'Bếp Việt Catering', amount: 16980000, status: 'Đang xử lý', date: '2026-08-20', items: 18 },
  { id: 'DH-2835', companyId: 'nexora-distribution', customer: 'Mart 24h', amount: 31150000, status: 'Chờ duyệt', date: '2026-08-19', items: 36 },
  { id: 'DH-2834', companyId: 'an-phu', customer: 'Xây dựng Tân Tiến', amount: 68300000, status: 'Đã xác nhận', date: '2026-08-19', items: 11 },
  { id: 'DH-2833', companyId: 'nexora-retail', customer: 'Trần Minh Khoa', amount: 3280000, status: 'Đã giao', date: '2026-08-18', items: 2 },
];

export const inventory: InventoryItem[] = [
  { sku: 'NL-TSH-001', name: 'Áo thun Essential', companyId: 'nexora-retail', warehouse: 'Kho TP.HCM', stock: 342, minimum: 80, unit: 'cái', value: 78660000 },
  { sku: 'MLF-CFE-014', name: 'Cà phê rang xay 500g', companyId: 'minh-long', warehouse: 'Kho Bình Dương', stock: 28, minimum: 40, unit: 'gói', value: 5040000 },
  { sku: 'NDS-BAG-008', name: 'Túi giấy Kraft M', companyId: 'nexora-distribution', warehouse: 'Kho Long An', stock: 1250, minimum: 300, unit: 'túi', value: 13750000 },
  { sku: 'APM-WOD-120', name: 'Ván MDF chống ẩm', companyId: 'an-phu', warehouse: 'Kho Đồng Nai', stock: 0, minimum: 25, unit: 'tấm', value: 0 },
  { sku: 'NL-SHO-042', name: 'Giày Urban Walk', companyId: 'nexora-retail', warehouse: 'Kho Hà Nội', stock: 64, minimum: 60, unit: 'đôi', value: 57600000 },
  { sku: 'MLF-NUT-022', name: 'Hạt điều rang muối', companyId: 'minh-long', warehouse: 'Kho Bình Dương', stock: 184, minimum: 50, unit: 'hộp', value: 33120000 },
  { sku: 'NDS-BOX-016', name: 'Thùng carton 40x30', companyId: 'nexora-distribution', warehouse: 'Kho Long An', stock: 86, minimum: 100, unit: 'thùng', value: 5590000 },
  { sku: 'APM-LEG-087', name: 'Chân bàn thép sơn tĩnh điện', companyId: 'an-phu', warehouse: 'Kho Đồng Nai', stock: 95, minimum: 30, unit: 'bộ', value: 71250000 },
];

export const users: EnterpriseUser[] = [
  { id: 'u1', name: 'Nguyễn Minh Anh', email: 'minhanh@nexora.vn', companyId: 'nexora-retail', role: 'Quản lý công ty', status: 'Đang hoạt động', lastActive: '2026-08-22T08:42:00', initials: 'MA' },
  { id: 'u2', name: 'Trần Bảo Ngọc', email: 'baongoc@minhlong.vn', companyId: 'minh-long', role: 'Kế toán', status: 'Đang hoạt động', lastActive: '2026-08-22T08:18:00', initials: 'BN' },
  { id: 'u3', name: 'Lê Hoàng Phúc', email: 'phuclh@nexora.vn', companyId: 'nexora-distribution', role: 'Quản lý kho', status: 'Đang hoạt động', lastActive: '2026-08-21T16:28:00', initials: 'HP' },
  { id: 'u4', name: 'Phạm Khánh Linh', email: 'linhpk@anphu.vn', companyId: 'an-phu', role: 'Nhân viên bán hàng', status: 'Tạm khóa', lastActive: '2026-08-19T10:12:00', initials: 'KL' },
  { id: 'u5', name: 'Vũ Đức Long', email: 'longvd@nexora.vn', companyId: 'nexora-retail', role: 'Nhân viên bán hàng', status: 'Đang hoạt động', lastActive: '2026-08-22T07:55:00', initials: 'ĐL' },
  { id: 'u6', name: 'Hoàng Thu Trang', email: 'tranght@minhlong.vn', companyId: 'minh-long', role: 'Quản lý kho', status: 'Đang hoạt động', lastActive: '2026-08-21T15:40:00', initials: 'TT' },
  { id: 'u7', name: 'Đỗ Gia Huy', email: 'huydg@nexora.vn', companyId: 'nexora-distribution', role: 'Kế toán', status: 'Đang hoạt động', lastActive: '2026-08-20T14:05:00', initials: 'GH' },
];

const byCompany = <T extends { companyId: string }>(records: T[], companyId: string) => companyId === 'all' ? records : records.filter((record) => record.companyId === companyId);
export const getCompany = (id: string) => companies.find((company) => company.id === id) ?? companies[0];

export async function getWorkspaceData(companyId: string) {
  await new Promise((resolve) => setTimeout(resolve, 260));
  return { orders: byCompany(orders, companyId), inventory: byCompany(inventory, companyId), users: byCompany(users, companyId) };
}

export const getStockStatus = (item: InventoryItem): StockStatus => item.stock === 0 ? 'Hết hàng' : item.stock <= item.minimum ? 'Sắp hết' : 'Đủ hàng';
