"use client";

import { useEffect, useMemo, useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskSummary from "../components/TaskSummary";
import { Task } from "../../types/task";
import { Company } from "../../types/company";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "ES提出",
    companyId: 2,
    dueDate: "2026-03-15",
    priority: "高",
    status: "未着手",
  },
  {
    id: 2,
    title: "Webテスト受験",
    companyId: 1,
    dueDate: "2026-03-12",
    priority: "高",
    status: "進行中",
  },
  {
    id: 3,
    title: "面接準備",
    companyId: 3,
    dueDate: "2026-03-20",
    priority: "中",
    status: "完了",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("高");
  const [status, setStatus] = useState("未着手");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        } else {
          setTasks(initialTasks);
        }
      } catch {
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    const savedCompanies = localStorage.getItem("companies");

    if (savedCompanies) {
      try {
        const parsed = JSON.parse(savedCompanies);
        if (Array.isArray(parsed)) {
          setCompanies(parsed);
        } else {
          setCompanies([]);
        }
      } catch {
        setCompanies([]);
      }
    } else {
      setCompanies([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const resetForm = () => {
    setTitle("");
    setCompanyId(null);
    setDueDate("");
    setPriority("高");
    setStatus("未着手");
    setEditingTaskId(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || companyId === null || !dueDate.trim()) {
      alert("タスク名・企業名・締切を入力してください。");
      return;
    }

    if (editingTaskId !== null) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title,
              companyId,
              dueDate,
              priority,
              status,
            }
          : task
      );

      setTasks(updatedTasks);
      resetForm();
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      companyId,
      dueDate,
      priority,
      status,
    };

    setTasks([newTask, ...tasks]);
    resetForm();
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editingTaskId === id) {
      resetForm();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setCompanyId(task.companyId);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">タスク管理</h1>
        <p className="mt-3 text-gray-600">
          締切・優先度・進捗状況をまとめて管理します。
        </p>

        <div className="mt-8">
          <TaskSummary tasks={tasks} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">
              {editingTaskId !== null ? "タスク編集" : "タスク登録"}
            </h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium">タスク名</label>
                <input
                  type="text"
                  placeholder="例: ES提出"
                  className="w-full rounded-md border px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">企業名</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={companyId ?? ""}
                  onChange={(e) => setCompanyId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    企業を選択してください
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">締切</label>
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">優先度</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>高</option>
                  <option>中</option>
                  <option>低</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">ステータス</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>未着手</option>
                  <option>進行中</option>
                  <option>完了</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-black px-4 py-2 text-white"
                >
                  {editingTaskId !== null ? "更新する" : "登録する"}
                </button>

                {editingTaskId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-md border px-4 py-2"
                  >
                    キャンセル
                  </button>
                )}
              </div>
            </form>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">登録済みタスク</h2>
              <p className="text-sm text-gray-500">締切が近い順に表示</p>
            </div>

            <div className="mt-6 space-y-4">
              {sortedTasks.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
                  まだタスクが登録されていません。
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    companies={companies}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}