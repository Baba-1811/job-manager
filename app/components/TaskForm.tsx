"use client";

import { useState } from "react";
import { Task } from "../../types/task";

type TaskFormProps = {
  onAdd: (task: Task) => void;
};

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("高");
  const [status, setStatus] = useState("未着手");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !company.trim() || !dueDate.trim()) {
      alert("タスク名・企業名・締切を入力してください。");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      company,
      dueDate,
      priority,
      status,
    };

    onAdd(newTask);

    setTitle("");
    setCompany("");
    setDueDate("");
    setPriority("高");
    setStatus("未着手");
  };

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">タスク登録</h2>

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
          <input
            type="text"
            placeholder="例: アクセンチュア"
            className="w-full rounded-md border px-3 py-2"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
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

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          登録
        </button>
      </form>
    </section>
  );
}