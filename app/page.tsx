"use client";

import { useEffect, useState } from "react";
import DashboardSummary from "./components/DashboardSummary";
import RecentCompanies from "./components/RecentCompanies";
import UrgentTasks from "./components/UrgentTasks";
import { Company } from "../types/company";
import { Task } from "../types/task";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedCompanies = localStorage.getItem("companies");
    const savedTasks = localStorage.getItem("tasks");

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const totalCompanies = companies.length;
  const totalTasks = tasks.length;
  const interviewCompanies = companies.filter(
    (company) => company.status === "面接予定"
  ).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "高"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">就活管理ダッシュボード</h1>
        <p className="mt-3 text-gray-600">
          企業・タスク・選考状況を一覧で確認できるホーム画面です。
        </p>

        <div className="mt-8">
          <DashboardSummary
            totalCompanies={totalCompanies}
            totalTasks={totalTasks}
            interviewCompanies={interviewCompanies}
            highPriorityTasks={highPriorityTasks}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <RecentCompanies companies={companies} />
          <UrgentTasks tasks={tasks} />
        </div>
      </div>
    </main>
  );
}