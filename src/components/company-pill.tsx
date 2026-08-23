import { getCompany } from '../lib/data';

export function CompanyPill({ companyId }: { companyId: string }) {
  const company = getCompany(companyId);
  return <span className="company-pill" title={company.name}><i style={{ background: company.color }} /><span>{company.name}</span></span>;
}
