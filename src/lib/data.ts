export type Company = { id: string; name: string; shortName: string; color: string };
export type OrderStatus = 'Đã xác nhận' | 'Đang xử lý' | 'Chờ duyệt' | 'Đã giao';
export type StockStatus = 'Đủ hàng' | 'Sắp hết' | 'Hết hàng';
export type UserStatus = 'Đang hoạt động' | 'Tạm khóa';

export type Order = { id: string; companyId: string; product: string; customer: string; amount: number; status: OrderStatus; date: string; items: number };
export type InventoryItem = { sku: string; name: string; companyId: string; warehouse: string; stock: number; minimum: number; unit: string; value: number };
export type EnterpriseUser = { id: string; name: string; email: string; companyId: string; role: string; status: UserStatus; lastActive: string; initials: string };

export const companies: Company[] = [
  { id: 'all', name: 'Tất cả công ty', shortName: 'Toàn hệ thống', color: '#245c49' },
  { id: 'fusa', name: 'Công ty cổ phần phân bón Fusa', shortName: 'Phân bón', color: '#34785d' },
  { id: 'au-chau', name: 'Công ty cổ phần VLXD Âu Châu', shortName: 'Vật liệu xây dựng', color: '#c88435' },
  { id: 'kim-chinh', name: 'Công ty cổ phần tập đoàn Kim Chính', shortName: 'Nông nghiệp & chăn nuôi', color: '#7164a8' },
];

export const orders: Order[] = [
  { id: 'DH-2841', companyId: 'fusa', product: 'Phân bón NPK 16-16-8', customer: 'HTX Nông nghiệp Bình Minh', amount: 128400000, status: 'Đã xác nhận', date: '2026-08-22', items: 80 },
  { id: 'DH-2840', companyId: 'au-chau', product: 'Xi măng PCB40', customer: 'Công ty Xây dựng Đại Phát', amount: 82500000, status: 'Chờ duyệt', date: '2026-08-22', items: 140 },
  { id: 'DH-2839', companyId: 'kim-chinh', product: 'Thức ăn hỗn hợp cho heo thịt', customer: 'Trang trại Hưng Thịnh', amount: 246300000, status: 'Đang xử lý', date: '2026-08-21', items: 210 },
  { id: 'DH-2838', companyId: 'au-chau', product: 'Thép cuộn D10', customer: 'VLXD Minh Thành', amount: 457200000, status: 'Đã giao', date: '2026-08-21', items: 50 },
  { id: 'DH-2837', companyId: 'kim-chinh', product: 'Gạo thơm ST25', customer: 'Nông sản Việt Xanh', amount: 46900000, status: 'Đã giao', date: '2026-08-20', items: 30 },
  { id: 'DH-2836', companyId: 'fusa', product: 'Phân DAP 18-46-0', customer: 'Đại lý Vật tư Nông nghiệp Phú Mỹ', amount: 169800000, status: 'Đang xử lý', date: '2026-08-20', items: 180 },
  { id: 'DH-2835', companyId: 'kim-chinh', product: 'Thức ăn hỗn hợp cho gà đẻ', customer: 'Trang trại An Khang', amount: 311500000, status: 'Chờ duyệt', date: '2026-08-19', items: 360 },
  { id: 'DH-2834', companyId: 'au-chau', product: 'Gạch porcelain 600x600', customer: 'Công ty Xây dựng Tân Tiến', amount: 683000000, status: 'Đã xác nhận', date: '2026-08-19', items: 110 },
  { id: 'DH-2833', companyId: 'fusa', product: 'Phân Urê hạt đục', customer: 'HTX Dịch vụ Nông nghiệp Thành Công', amount: 32800000, status: 'Đã giao', date: '2026-08-18', items: 20 },
];

export const inventory: InventoryItem[] = [
  { sku: 'FSA-NPK-168', name: 'Phân bón NPK 16-16-8', companyId: 'fusa', warehouse: 'Kho Long An', stock: 342, minimum: 80, unit: 'bao', value: 786600000 },
  { sku: 'FSA-DAP-1846', name: 'Phân DAP 18-46-0', companyId: 'fusa', warehouse: 'Kho Long An', stock: 28, minimum: 40, unit: 'bao', value: 50400000 },
  { sku: 'FSA-URE-001', name: 'Phân Urê hạt đục', companyId: 'fusa', warehouse: 'Kho Long An', stock: 125, minimum: 60, unit: 'bao', value: 137500000 },
  { sku: 'AC-XM-040', name: 'Xi măng PCB40', companyId: 'au-chau', warehouse: 'Kho Bình Dương', stock: 0, minimum: 100, unit: 'bao', value: 0 },
  { sku: 'AC-THEP-D10', name: 'Thép cuộn D10', companyId: 'au-chau', warehouse: 'Kho Bình Dương', stock: 64, minimum: 60, unit: 'cuộn', value: 576000000 },
  { sku: 'AC-GACH-6060', name: 'Gạch porcelain 600x600', companyId: 'au-chau', warehouse: 'Kho Đồng Nai', stock: 1840, minimum: 500, unit: 'thùng', value: 331200000 },
  { sku: 'KC-CAM-HEO', name: 'Thức ăn hỗn hợp cho heo thịt', companyId: 'kim-chinh', warehouse: 'Kho Tây Ninh', stock: 86, minimum: 100, unit: 'bao', value: 55900000 },
  { sku: 'KC-CAM-GA', name: 'Thức ăn hỗn hợp cho gà đẻ', companyId: 'kim-chinh', warehouse: 'Kho Tây Ninh', stock: 950, minimum: 300, unit: 'bao', value: 712500000 },
  { sku: 'KC-GAO-ST25', name: 'Gạo thơm ST25', companyId: 'kim-chinh', warehouse: 'Kho Cần Thơ', stock: 420, minimum: 120, unit: 'bao', value: 378000000 },
];

export const users: EnterpriseUser[] = [
  { id: 'u1', name: 'Nguyễn Minh Anh', email: 'minhanh@fusa.vn', companyId: 'fusa', role: 'Quản lý công ty', status: 'Đang hoạt động', lastActive: '2026-08-22T08:42:00', initials: 'MA' },
  { id: 'u2', name: 'Trần Bảo Ngọc', email: 'baongoc@au-chau.vn', companyId: 'au-chau', role: 'Kế toán', status: 'Đang hoạt động', lastActive: '2026-08-22T08:18:00', initials: 'BN' },
  { id: 'u3', name: 'Lê Hoàng Phúc', email: 'phuclh@kimchinh.vn', companyId: 'kim-chinh', role: 'Quản lý kho', status: 'Đang hoạt động', lastActive: '2026-08-21T16:28:00', initials: 'HP' },
  { id: 'u4', name: 'Phạm Khánh Linh', email: 'linhpk@fusa.vn', companyId: 'fusa', role: 'Nhân viên bán hàng', status: 'Tạm khóa', lastActive: '2026-08-19T10:12:00', initials: 'KL' },
  { id: 'u5', name: 'Vũ Đức Long', email: 'longvd@au-chau.vn', companyId: 'au-chau', role: 'Nhân viên bán hàng', status: 'Đang hoạt động', lastActive: '2026-08-22T07:55:00', initials: 'ĐL' },
  { id: 'u6', name: 'Hoàng Thu Trang', email: 'tranght@kimchinh.vn', companyId: 'kim-chinh', role: 'Quản lý kho', status: 'Đang hoạt động', lastActive: '2026-08-21T15:40:00', initials: 'TT' },
];

const byCompany = <T extends { companyId: string }>(records: T[], companyId: string) => companyId === 'all' ? records : records.filter((record) => record.companyId === companyId);
export const getCompany = (id: string) => companies.find((company) => company.id === id) ?? companies[0];

export async function getWorkspaceData(companyId: string) {
  await new Promise((resolve) => setTimeout(resolve, 260));
  return { orders: byCompany(orders, companyId), inventory: byCompany(inventory, companyId), users: byCompany(users, companyId) };
}

export const getStockStatus = (item: InventoryItem): StockStatus => item.stock === 0 ? 'Hết hàng' : item.stock <= item.minimum ? 'Sắp hết' : 'Đủ hàng';
