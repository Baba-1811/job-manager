import { Task } from "../../types/task";
import { Company } from "../../types/company";

type TaskCardProps = {
  task: Task;
  companies: Company[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

const priorityColorMap: Record<string, string> = {
  高: "bg-red-100 text-red-700",
  中: "bg-yellow-100 text-yellow-800",
  低: "bg-gray-100 text-gray-700",
};

const statusColorMap: Record<string, string> = {
  未着手: "bg-gray-100 text-gray-700",
  進行中: "bg-blue-100 text-blue-700",
  完了: "bg-green-100 text-green-700",
};

function getDaysUntilDue(dueDate: string) {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function TaskCard({
  task,
  companies,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const companyName =
    companies.find((company) => company.id === task.companyId)?.name ?? "不明";

  const priorityClass =
    priorityColorMap[task.priority] ?? "bg-gray-100 text-gray-700";
  const statusClass =
    statusColorMap[task.status] ?? "bg-gray-100 text-gray-700";

  const daysLeft = getDaysUntilDue(task.dueDate);
  const isUrgent = daysLeft <= 3 && task.status !== "完了";
  const isOverdue = daysLeft < 0 && task.status !== "完了";

  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        isOverdue
          ? "border-red-300"
          : isUrgent
          ? "border-yellow-300"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{task.title}</h3>
          <p className="mt-2 text-sm text-gray-700">企業名: {companyName}</p>
          <p className="text-sm text-gray-700">締切: {task.dueDate}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClass}`}
            >
              優先度: {task.priority}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
            >
              {task.status}
            </span>

            {isOverdue ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                締切超過
              </span>
            ) : isUrgent ? (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                締切まで {daysLeft} 日
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                締切まで {daysLeft} 日
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
          >
            編集
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}