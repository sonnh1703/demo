import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { companies, getCompany } from '../lib/data';
import { useAppStore } from '../store/app-store';

export function CompanySwitcher() {
  const companyId = useAppStore((state) => state.companyId);
  const setCompanyId = useAppStore((state) => state.setCompanyId);
  const selected = getCompany(companyId);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="company-switcher" aria-label="Chọn phạm vi công ty">
        <span className="company-mark" style={{ background: selected.color }}><Building2 size={15} /></span>
        <span><small>Phạm vi báo cáo</small><strong>{selected.name}</strong></span>
        <ChevronDown size={15} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="company-menu" sideOffset={8} align="start">
          <div className="company-menu-label">Chọn phạm vi dữ liệu</div>
          {companies.map((company) => (
            <DropdownMenu.Item className="company-menu-item" key={company.id} onSelect={() => setCompanyId(company.id)}>
              <span className="company-dot" style={{ background: company.color }} />
              <span><strong>{company.name}</strong><small>{company.id === 'all' ? 'Báo cáo hợp nhất' : company.shortName}</small></span>
              {company.id === companyId && <Check size={16} />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
