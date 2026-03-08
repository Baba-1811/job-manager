type DashboardSummaryProps = {
  totalCompanies: number;
  totalTasks: number;
  interviewCompanies: number;
  highPriorityTasks: number;
};

export default function DashboardSummary({
  totalCompanies,
  totalTasks,
  interviewCompanies,
  highPriorityTasks,
}: DashboardSummaryProps) {
  const items = [
    { label: "総企業数", value: totalCompanies },
    { label: "総タスク数", value: totalTasks },
    { label: "面接予定企業", value: interviewCompanies },
    { label: "高優先度タスク", value: highPriorityTasks },
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