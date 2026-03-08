import { Task } from "../../types/task";

type TaskSummaryProps = {
  tasks: Task[];
};

export default function TaskSummary({ tasks }: TaskSummaryProps) {
  const totalCount = tasks.length;
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "高"
  ).length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "進行中"
  ).length;
  const completedCount = tasks.filter(
    (task) => task.status === "完了"
  ).length;

  const items = [
    { label: "総タスク数", value: totalCount },
    { label: "高優先度", value: highPriorityCount },
    { label: "進行中", value: inProgressCount },
    { label: "完了", value: completedCount },
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