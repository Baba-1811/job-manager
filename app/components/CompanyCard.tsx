import { Company } from "../../types/company";

type CompanyCardProps = {
  company: Company;
  onDelete: (id: number) => void;
  onEdit: (company: Company) => void;
};

const statusColorMap: Record<string, string> = {
  応募前: "bg-gray-100 text-gray-700",
  ES提出済み: "bg-blue-100 text-blue-700",
  Webテスト済み: "bg-purple-100 text-purple-700",
  面接予定: "bg-yellow-100 text-yellow-800",
  内定: "bg-green-100 text-green-700",
  お祈り: "bg-red-100 text-red-700",
};

const interestColorMap: Record<string, string> = {
  高: "bg-green-100 text-green-700",
  中: "bg-yellow-100 text-yellow-800",
  低: "bg-gray-100 text-gray-700",
};

export default function CompanyCard({
  company,
  onDelete,
  onEdit,
}: CompanyCardProps) {
  if (!company) return null;

  const statusClass =
    statusColorMap[company.status] ?? "bg-gray-100 text-gray-700";
  const interestClass =
    interestColorMap[company.interestLevel] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{company.name}</h3>
          <p className="mt-2 text-sm text-gray-700">業界: {company.industry}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${interestClass}`}
            >
              志望度: {company.interestLevel}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
            >
              {company.status}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(company)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
          >
            編集
          </button>

          <button
            type="button"
            onClick={() => onDelete(company.id)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}