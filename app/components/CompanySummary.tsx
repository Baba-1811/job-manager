import { Company } from "../../types/company";

type CompanySummaryProps = {
  companies: Company[];
};

export default function CompanySummary({
  companies,
}: CompanySummaryProps) {
  const totalCount = companies.length;
  const highInterestCount = companies.filter(
    (company) => company.interestLevel === "高"
  ).length;
  const interviewCount = companies.filter(
    (company) => company.status === "面接予定"
  ).length;
  const esSubmittedCount = companies.filter(
    (company) => company.status === "ES提出済み"
  ).length;

  const items = [
    { label: "総企業数", value: totalCount },
    { label: "志望度：高", value: highInterestCount },
    { label: "面接予定", value: interviewCount },
    { label: "ES提出済み", value: esSubmittedCount },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="mt-2 text-3xl font-bold">{item.value}</p>
        </div>
      ))}
    </section>
  );
}