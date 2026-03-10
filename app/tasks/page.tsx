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

  // フォーム
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("高");
  const [status, setStatus] = useState("未着手");

  // ★ 検索・フィルター用 state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("すべて");
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [filterCompanyId, setFilterCompanyId] = useState<string>("すべて");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(Array.isArray(parsed) ? parsed : initialTasks);
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
        setCompanies(Array.isArray(parsed) ? parsed : []);
      } catch {
        setCompanies([]);
      }
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
      setTasks(tasks.map((task) =>
        task.id === editingTaskId
          ? { ...task, title, companyId, dueDate, priority, status }
          : task
      ));
      resetForm();
      return;
    }
    setTasks([{ id: Date.now(), title, companyId, dueDate, priority, status }, ...tasks]);
    resetForm();
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingTaskId === id) resetForm();
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setCompanyId(task.companyId);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
  };

  // ★ ソート → フィルター → 検索
  const filteredTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .filter((task) => {
        const companyName =
          companies.find((c) => c.id === task.companyId)?.name ?? "";

        const matchesSearch =
          searchQuery === "" ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          companyName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority =
          filterPriority === "すべて" || task.priority === filterPriority;

        const matchesStatus =
          filterStatus === "すべて" || task.status === filterStatus;

        const matchesCompany =
          filterCompanyId === "すべて" ||
          task.companyId === Number(filterCompanyId);

        return matchesSearch && matchesPriority && matchesStatus && matchesCompany;
      });
  }, [tasks, companies, searchQuery, filterPriority, filterStatus, filterCompanyId]);

  const hasActiveFilter =
    searchQuery !== "" ||
    filterPriority !== "すべて" ||
    filterStatus !== "すべて" ||
    filterCompanyId !== "すべて";

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
          {/* 登録フォーム */}
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
                  <option value="" disabled>企業を選択してください</option>
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

          {/* タスク一覧 + 検索・フィルター */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">登録済みタスク</h2>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterPriority("すべて");
                    setFilterStatus("すべて");
                    setFilterCompanyId("すべて");
                  }}
                  className="text-sm text-gray-500 hover:text-black underline"
                >
                  フィルターをリセット
                </button>
              )}
            </div>

            {/* ★ 検索・フィルターUI */}
            <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm space-y-3">
              {/* テキスト検索 */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="タスク名・企業名で検索..."
                  className="w-full rounded-md border px-3 py-2 pl-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* フィルター選択 */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[120px]">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    優先度
                  </label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option>すべて</option>
                    <option>高</option>
                    <option>中</option>
                    <option>低</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[120px]">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    ステータス
                  </label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>すべて</option>
                    <option>未着手</option>
                    <option>進行中</option>
                    <option>完了</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    企業
                  </label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={filterCompanyId}
                    onChange={(e) => setFilterCompanyId(e.target.value)}
                  >
                    <option value="すべて">すべて</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 件数表示 */}
              <p className="text-xs text-gray-500">
                {filteredTasks.length} 件 / 全 {tasks.length} 件
              </p>
            </div>

            {/* タスクカード一覧 */}
            <div className="mt-4 space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
                  {hasActiveFilter
                    ? "条件に一致するタスクが見つかりません。"
                    : "まだタスクが登録されていません。"}
                </div>
              ) : (
                filteredTasks.map((task) => (
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