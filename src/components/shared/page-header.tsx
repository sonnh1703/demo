import type { ReactNode } from 'react';

interface PageHeaderProps { eyebrow?: string; title: string; description?: string; action?: ReactNode }
export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return <div className="page-title"><div>{eyebrow && <span>{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
