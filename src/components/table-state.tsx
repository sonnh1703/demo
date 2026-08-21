import { LoaderCircle } from 'lucide-react';

export function TableState({ loading, empty, emptyText = 'Không tìm thấy dữ liệu phù hợp.' }: { loading?: boolean; empty?: boolean; emptyText?: string }) {
  if (loading) return <div className="table-state"><LoaderCircle className="spin" size={22} /><span>Đang đồng bộ dữ liệu...</span></div>;
  if (empty) return <div className="table-state"><strong>Chưa có kết quả</strong><span>{emptyText}</span></div>;
  return null;
}
