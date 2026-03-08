import { Task } from "../../types/task";
import { Company } from "../../types/company";

type UrgentTasksProps = {
  tasks: Task[];
  companies: Company[];
};

function getDaysUntilDue(dueDate: string) {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function UrgentTasks({ tasks, companies }: UrgentTasksProps) {
  const urgentTasks = [...tasks]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">直近のタスク</h2>

      <div className="mt-4 space-y-3">
        {urgentTasks.length === 0 ? (
          <p className="text-gray-500">タスクがまだ登録されていません。</p>
        ) : (
          urgentTasks.map((task) => {
            const companyName =
              companies.find((company) => company.id === task.companyId)?.name ??
              "不明";

            const daysLeft = getDaysUntilDue(task.dueDate);
            const isOverdue = daysLeft < 0 && task.status !== "完了";
            const isUrgent =
              daysLeft <= 3 && daysLeft >= 0 && task.status !== "完了";

            return (
              <div key={task.id} className="rounded-lg border p-4">
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-600">
                  {companyName} / 締切: {task.dueDate} / 優先度: {task.priority}
                </p>

                <div className="mt-2">
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
            );
          })
        )}
      </div>
    </section>
  );
}