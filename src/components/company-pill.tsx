import { getCompany } from '../lib/data';

export function CompanyPill({ companyId }: { companyId: string }) {
  const company = getCompany(companyId);
  return <span className="company-pill"><i style={{ background: company.color }} />{company.name}</span>;
}
