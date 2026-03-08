import { Company } from "../../types/company";

type RecentCompaniesProps = {
  companies: Company[];
};

export default function RecentCompanies({
  companies,
}: RecentCompaniesProps) {
  const recentCompanies = companies.slice(0, 5);

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">最近の企業</h2>

      <div className="mt-4 space-y-3">
        {recentCompanies.length === 0 ? (
          <p className="text-gray-500">企業がまだ登録されていません。</p>
        ) : (
          recentCompanies.map((company) => (
            <div key={company.id} className="rounded-lg border p-4">
              <p className="font-semibold">{company.name}</p>
              <p className="text-sm text-gray-600">
                {company.industry} / 志望度: {company.interestLevel} / {company.status}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}