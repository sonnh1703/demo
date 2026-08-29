export type Company = { id: string; name: string; shortName: string; color: string };
export type OrderStatus = 'Đã xác nhận' | 'Đang xử lý' | 'Chờ duyệt' | 'Đã giao';
export type ShippingStatus = 'Chưa giao' | 'Đang giao' | 'Đã giao' | 'Giao thất bại' | 'Hoàn hàng';
export type OrderSource = 'Website' | 'Điện thoại' | 'Sàn TMĐT' | 'Đại lý' | 'Facebook/Zalo';
export type StockStatus = 'Đủ hàng' | 'Sắp hết' | 'Hết hàng';
export type UserStatus = 'Đang hoạt động' | 'Tạm khóa';

export type Order = {
  id: string;
  companyId: string;
  product: string;
  customer: string;
  phone: string;
  source: OrderSource;
  items: number;
  subtotal: number;
  discount: number;
  returned: number;
  shippingFee: number;
  status: OrderStatus;
  shippingStatus: ShippingStatus;
  warehouse: string;
  affiliate: string;
  date: string;
};
export type InventoryItem = { sku: string; name: string; companyId: string; warehouse: string; stock: number; minimum: number; unit: string; value: number };
export type EnterpriseUser = { id: string; name: string; email: string; companyId: string; role: string; status: UserStatus; lastActive: string; initials: string };

export const companies: Company[] = [
  { id: 'all', name: 'Tất cả công ty', shortName: 'Toàn hệ thống', color: '#245c49' },
  { id: 'fusa', name: 'Công ty cổ phần phân bón Fusa', shortName: 'Phân bón', color: '#34785d' },
  { id: 'au-chau', name: 'Công ty cổ phần VLXD Âu Châu', shortName: 'Vật liệu xây dựng', color: '#c88435' },
  { id: 'kim-chinh', name: 'Công ty cổ phần tập đoàn Kim Chính', shortName: 'Nông nghiệp & chăn nuôi', color: '#7164a8' },
];

export const orders: Order[] = [
  { id: 'DH-2841', companyId: 'fusa', product: 'Phân bón NPK 16-16-8', customer: 'HTX Nông nghiệp Bình Minh', phone: '0913 245 678', source: 'Đại lý', items: 80, subtotal: 130000000, discount: 1600000, returned: 0, shippingFee: 1800000, status: 'Đã xác nhận', shippingStatus: 'Đang giao', warehouse: 'Kho Long An', affiliate: '—', date: '2026-08-22' },
  { id: 'DH-2840', companyId: 'au-chau', product: 'Xi măng PCB40', customer: 'Công ty Xây dựng Đại Phát', phone: '0908 112 233', source: 'Website', items: 140, subtotal: 84000000, discount: 1500000, returned: 0, shippingFee: 2400000, status: 'Chờ duyệt', shippingStatus: 'Chưa giao', warehouse: 'Kho Bình Dương', affiliate: '—', date: '2026-08-22' },
  { id: 'DH-2839', companyId: 'kim-chinh', product: 'Thức ăn hỗn hợp cho heo thịt', customer: 'Trang trại Hưng Thịnh', phone: '0977 654 321', source: 'Đại lý', items: 210, subtotal: 250000000, discount: 3700000, returned: 0, shippingFee: 3200000, status: 'Đang xử lý', shippingStatus: 'Đang giao', warehouse: 'Kho Tây Ninh', affiliate: 'CTV-102', date: '2026-08-21' },
  { id: 'DH-2838', companyId: 'au-chau', product: 'Thép cuộn D10', customer: 'VLXD Minh Thành', phone: '0918 765 432', source: 'Điện thoại', items: 50, subtotal: 460000000, discount: 2800000, returned: 0, shippingFee: 4500000, status: 'Đã giao', shippingStatus: 'Đã giao', warehouse: 'Kho Bình Dương', affiliate: '—', date: '2026-08-21' },
  { id: 'DH-2837', companyId: 'kim-chinh', product: 'Gạo thơm ST25', customer: 'Nông sản Việt Xanh', phone: '0932 556 789', source: 'Sàn TMĐT', items: 30, subtotal: 48000000, discount: 600000, returned: 500000, shippingFee: 650000, status: 'Đã giao', shippingStatus: 'Đã giao', warehouse: 'Kho Cần Thơ', affiliate: 'CTV-045', date: '2026-08-20' },
  { id: 'DH-2836', companyId: 'fusa', product: 'Phân DAP 18-46-0', customer: 'Đại lý Vật tư Nông nghiệp Phú Mỹ', phone: '0909 334 556', source: 'Đại lý', items: 180, subtotal: 173000000, discount: 3200000, returned: 0, shippingFee: 2100000, status: 'Đang xử lý', shippingStatus: 'Giao thất bại', warehouse: 'Kho Long An', affiliate: '—', date: '2026-08-20' },
  { id: 'DH-2835', companyId: 'kim-chinh', product: 'Thức ăn hỗn hợp cho gà đẻ', customer: 'Trang trại An Khang', phone: '0966 223 114', source: 'Website', items: 360, subtotal: 316000000, discount: 4500000, returned: 0, shippingFee: 3800000, status: 'Chờ duyệt', shippingStatus: 'Chưa giao', warehouse: 'Kho Tây Ninh', affiliate: 'CTV-102', date: '2026-08-19' },
  { id: 'DH-2834', companyId: 'au-chau', product: 'Gạch porcelain 600x600', customer: 'Công ty Xây dựng Tân Tiến', phone: '0903 887 665', source: 'Điện thoại', items: 110, subtotal: 690000000, discount: 7000000, returned: 0, shippingFee: 5200000, status: 'Đã xác nhận', shippingStatus: 'Chưa giao', warehouse: 'Kho Đồng Nai', affiliate: '—', date: '2026-08-19' },
  { id: 'DH-2833', companyId: 'fusa', product: 'Phân Urê hạt đục', customer: 'HTX Dịch vụ Nông nghiệp Thành Công', phone: '0915 448 220', source: 'Đại lý', items: 20, subtotal: 34000000, discount: 1200000, returned: 0, shippingFee: 480000, status: 'Đã giao', shippingStatus: 'Đã giao', warehouse: 'Kho Long An', affiliate: '—', date: '2026-08-18' },
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
  { id: 'u2', name: 'Trần Bảo Ngọc', email: 'baongoc@auchau.vn', companyId: 'au-chau', role: 'Kế toán', status: 'Đang hoạt động', lastActive: '2026-08-22T08:18:00', initials: 'BN' },
  { id: 'u3', name: 'Lê Hoàng Phúc', email: 'phuclh@kimchinh.vn', companyId: 'kim-chinh', role: 'Quản lý kho', status: 'Đang hoạt động', lastActive: '2026-08-21T16:28:00', initials: 'HP' },
  { id: 'u4', name: 'Phạm Khánh Linh', email: 'linhpk@fusa.vn', companyId: 'fusa', role: 'Nhân viên bán hàng', status: 'Tạm khóa', lastActive: '2026-08-19T10:12:00', initials: 'KL' },
  { id: 'u5', name: 'Vũ Đức Long', email: 'longvd@auchau.vn', companyId: 'au-chau', role: 'Nhân viên bán hàng', status: 'Đang hoạt động', lastActive: '2026-08-22T07:55:00', initials: 'ĐL' },
  { id: 'u6', name: 'Hoàng Thu Trang', email: 'tranght@kimchinh.vn', companyId: 'kim-chinh', role: 'Quản lý kho', status: 'Đang hoạt động', lastActive: '2026-08-21T15:40:00', initials: 'TT' },
];

const byCompany = <T extends { companyId: string }>(records: T[], companyId: string) => companyId === 'all' ? records : records.filter((record) => record.companyId === companyId);
export const getCompany = (id: string) => companies.find((company) => company.id === id) ?? companies[0];

export async function getWorkspaceData(companyId: string) {
  await new Promise((resolve) => setTimeout(resolve, 260));
  return { orders: byCompany(orders, companyId), inventory: byCompany(inventory, companyId), users: byCompany(users, companyId) };
}

export const getStockStatus = (item: InventoryItem): StockStatus => item.stock === 0 ? 'Hết hàng' : item.stock <= item.minimum ? 'Sắp hết' : 'Đủ hàng';

// Doanh thu thuần = tiền hàng - giảm giá - tiền hàng trả lại.
export const getOrderNetRevenue = (order: Order): number => order.subtotal - order.discount - order.returned;
