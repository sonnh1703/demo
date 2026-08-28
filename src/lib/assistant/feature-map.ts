// ============================================================================
// FEATURE MAP — nguồn kiến thức DUY NHẤT của trợ lý AI hướng dẫn sử dụng.
//
// File này CHỈ chứa dữ liệu (không có logic), mô tả từng màn hình trong app:
// tên, đường dẫn, mô tả ngắn, các thao tác chính và câu hỏi thường gặp.
// Trợ lý AI sẽ CHỈ trả lời dựa trên đúng nội dung ở đây — không tự bịa thêm.
//
// AI CẦN SỬA / THÊM MÀN HÌNH MỚI, HÃY LÀM THEO CÁC BƯỚC SAU (không cần biết lập trình):
//   1. Copy một khối { name, path, description, actions, faqs } bên dưới.
//   2. Sửa lại "name" (tên hiển thị), "path" (đường dẫn — PHẢI khớp đúng với
//      đường dẫn thật của trang, xem trong src/app/app.tsx), "description".
//   3. Liệt kê các thao tác người dùng có thể làm trong mảng "actions".
//   4. Thêm các câu hỏi hay gặp và câu trả lời mẫu vào mảng "faqs".
//   5. Lưu file — không cần khởi động lại gì thêm.
//
// LƯU Ý QUAN TRỌNG:
//   - Chỉ mô tả tính năng CÓ THẬT, đang hoạt động trên trang. Đừng thêm mô tả
//     cho nút/khu vực chưa làm xong — trợ lý sẽ hiểu nhầm là đã dùng được.
//   - "path" sai hoặc không tồn tại sẽ khiến nút điều hướng trong khung chat
//     không hoạt động.
// ============================================================================

export interface FeatureFaq {
  /** Câu hỏi người dùng thường hỏi, viết tự nhiên như văn nói. */
  question: string;
  /** Câu trả lời mẫu, ngắn gọn, từng bước. */
  answer: string;
}

export interface FeatureMapEntry {
  /** Tên màn hình hiển thị cho người dùng, ví dụ "Kho hàng". */
  name: string;
  /** Đường dẫn thật của trang trong ứng dụng, ví dụ "/inventory". */
  path: string;
  /** Mô tả ngắn 1-2 câu về màn hình này dùng để làm gì. */
  description: string;
  /** Danh sách các thao tác chính người dùng có thể thực hiện trên màn hình này. */
  actions: string[];
  /** Câu hỏi thường gặp kèm câu trả lời mẫu, giúp trợ lý trả lời chính xác hơn. */
  faqs: FeatureFaq[];
}

export const FEATURE_MAP: FeatureMapEntry[] = [
  {
    name: 'Tổng quan',
    path: '/',
    description:
      'Trang chủ khi đăng nhập. Hiển thị các chỉ số kinh doanh chính (doanh thu, số đơn hàng, giá trị tồn kho, số người dùng), biểu đồ doanh thu 6 tháng gần nhất, đơn hàng gần đây và các cảnh báo cần chú ý.',
    actions: [
      'Xem nhanh 4 chỉ số chính ở đầu trang: doanh thu, số đơn hàng, giá trị tồn kho, số người dùng.',
      'Đổi phạm vi xem báo cáo (một công ty cụ thể hoặc toàn hệ thống) bằng bộ chọn "Phạm vi báo cáo" ở góc trên bên trái, cạnh logo — bộ chọn này có ở mọi trang.',
      'Bấm "Xem tất cả" ở khối "Đơn hàng gần đây" để chuyển sang trang Đơn hàng.',
      'Xem mục "Cần chú ý" để biết mặt hàng sắp hết hoặc đơn hàng đang chờ duyệt.',
    ],
    faqs: [
      { question: 'Doanh thu hiện tại là bao nhiêu?', answer: 'Vào trang Tổng quan, xem thẻ "Doanh thu ghi nhận" ở đầu trang.' },
      { question: 'Làm sao xem báo cáo riêng cho một công ty?', answer: 'Bấm vào bộ chọn "Phạm vi báo cáo" ở góc trên bên trái (cạnh logo), rồi chọn công ty muốn xem.' },
    ],
  },
  {
    name: 'Đơn hàng',
    path: '/orders',
    description:
      'Danh sách toàn bộ đơn hàng: mã đơn, mặt hàng, số lượng, khách hàng, công ty, ngày tạo, giá trị và trạng thái xử lý.',
    actions: [
      'Bấm nút "Thêm đơn hàng" ở góc trên bên phải để tạo đơn mới.',
      'Gõ vào ô tìm kiếm để tìm theo mã đơn, mặt hàng hoặc tên khách hàng.',
      'Lọc theo trạng thái (Chờ duyệt, Đã xác nhận, Đang xử lý, Đã giao) hoặc theo ngày tạo.',
      'Bấm biểu tượng bút chì trên một dòng để sửa đơn, biểu tượng thùng rác để xóa đơn đó.',
      'Bấm "Xuất dữ liệu" để tải danh sách đơn hàng.',
    ],
    faqs: [
      { question: 'Làm sao thêm đơn hàng mới?', answer: 'Vào trang Đơn hàng, bấm nút "Thêm đơn hàng" ở góc trên bên phải, điền thông tin rồi bấm "Thêm đơn hàng" để lưu.' },
      { question: 'Làm sao xem đơn hàng đang chờ duyệt?', answer: 'Vào trang Đơn hàng, ở bộ lọc trạng thái (biểu tượng phễu) chọn "Chờ duyệt".' },
      { question: 'Làm sao sửa hoặc xóa một đơn hàng?', answer: 'Vào trang Đơn hàng, ở cuối dòng đơn hàng bấm biểu tượng bút chì để sửa, hoặc biểu tượng thùng rác để xóa.' },
    ],
  },
  {
    name: 'Kho hàng',
    path: '/inventory',
    description:
      'Danh sách tồn kho theo từng mặt hàng: mã sản phẩm, tên hàng, công ty, kho lưu trữ, số lượng tồn và giá trị tồn kho.',
    actions: [
      'Bấm nút "Thêm mặt hàng" ở góc trên bên phải để thêm sản phẩm mới vào kho.',
      'Gõ vào ô tìm kiếm để tìm theo mã hàng (SKU), tên hàng hoặc tên kho.',
      'Lọc theo tình trạng "Còn hàng" hoặc "Hết hàng".',
      'Bấm biểu tượng bút chì trên một dòng để sửa, biểu tượng thùng rác để xóa mặt hàng đó.',
      'Bấm "Xuất kho" để tải danh sách tồn kho.',
    ],
    faqs: [
      { question: 'Làm sao xem tồn kho?', answer: 'Ở menu bên trái chọn mục "Kho hàng", bảng sẽ hiển thị toàn bộ mặt hàng cùng số lượng đang tồn.' },
      { question: 'Làm sao biết mặt hàng nào sắp hết?', answer: 'Vào trang Kho hàng rồi lọc tình trạng "Hết hàng", hoặc xem mục "Cần chú ý" ở trang Tổng quan.' },
      { question: 'Làm sao thêm mặt hàng mới vào kho?', answer: 'Vào trang Kho hàng, bấm nút "Thêm mặt hàng" ở góc trên bên phải, điền thông tin rồi lưu lại.' },
    ],
  },
  {
    name: 'Người dùng',
    path: '/users',
    description:
      'Danh sách tài khoản người dùng nội bộ: tên, email, công ty, vai trò (Quản lý công ty, Kế toán, Quản lý kho, Nhân viên bán hàng) và trạng thái (Đang hoạt động, Tạm khóa).',
    actions: [
      'Bấm nút "Thêm người dùng" ở góc trên bên phải để tạo tài khoản mới.',
      'Gõ vào ô tìm kiếm để tìm theo tên hoặc email.',
      'Lọc theo vai trò hoặc theo trạng thái tài khoản.',
      'Bấm biểu tượng bút chì trên một dòng để sửa (kể cả đổi trạng thái/khóa tài khoản), biểu tượng thùng rác để xóa người dùng đó.',
    ],
    faqs: [
      { question: 'Làm sao thêm người dùng mới?', answer: 'Vào trang Người dùng, bấm "Thêm người dùng", điền họ tên, email, chọn công ty và vai trò rồi lưu lại.' },
      { question: 'Làm sao khóa tài khoản của ai đó?', answer: 'Vào trang Người dùng, bấm biểu tượng bút chì trên dòng người đó, đổi "Trạng thái" sang "Tạm khóa" rồi bấm "Lưu thay đổi".' },
    ],
  },
];

// Ghi chú chung, áp dụng cho mọi màn hình — giúp trợ lý không bịa thêm những
// nút/khu vực chưa thực sự hoạt động trong bản demo này.
export const GLOBAL_NOTES: string[] = [
  'Bộ chọn "Phạm vi báo cáo" ở góc trên bên trái (cạnh logo) có mặt trên mọi trang, cho phép xem dữ liệu của một công ty cụ thể hoặc toàn hệ thống (mục "Tất cả").',
  'Menu bên trái (sidebar) dùng để điều hướng nhanh giữa các màn hình: Tổng quan, Đơn hàng, Kho hàng, Người dùng.',
  'Mục "Cài đặt" ở cuối menu bên trái và ô "Tìm kiếm nhanh" (⌘K) trên thanh trên cùng hiện là giao diện minh họa, CHƯA có chức năng thật trong bản demo này — nếu người dùng hỏi, hãy trả lời rằng tính năng này chưa khả dụng và đề nghị liên hệ bộ phận hỗ trợ.',
];
