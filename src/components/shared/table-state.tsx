import { LoaderCircle } from 'lucide-react';

interface TableStateProps { loading?: boolean; empty?: boolean; emptyText?: string }

export function TableState({ loading, empty, emptyText = 'Không tìm thấy dữ liệu phù hợp.' }: TableStateProps) {
  if (loading) return <div className="table-state"><LoaderCircle className="spin" size={22} /><span>Đang đồng bộ dữ liệu...</span></div>;
  if (empty) return <div className="table-state"><strong>Chưa có kết quả</strong><span>{emptyText}</span></div>;
  return null;
}
