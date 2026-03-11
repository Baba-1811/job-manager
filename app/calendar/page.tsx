"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ja } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task } from "../../types/task";
import { Review } from "../../types/review";
import { Company } from "../../types/company";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { ja },
});

type CalendarEvent = Event & {
  type: "task" | "review";
  color: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/companies").then((r) => r.json()),
    ]).then(([tasks, reviews, companies]: [Task[], Review[], Company[]]) => {
      const taskEvents: CalendarEvent[] = tasks.map((task) => {
        const company = companies.find((c) => c.id === task.companyId);
        const color =
          task.priority === "高"
            ? "#ef4444"
            : task.priority === "中"
            ? "#f59e0b"
            : "#6b7280";
        return {
          title: `📋 ${task.title}（${company?.name ?? "不明"}）`,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          allDay: true,
          type: "task",
          color,
        };
      });

      const reviewEvents: CalendarEvent[] = reviews.map((review) => ({
        title: `🎤 面接：${review.companyName}`,
        start: new Date(review.interviewDate),
        end: new Date(review.interviewDate),
        allDay: true,
        type: "review",
        color: "#3b82f6",
      }));

      setEvents([...taskEvents, ...reviewEvents]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold">カレンダー</h1>
        <p className="mt-3 text-gray-600">
          タスクの締切・面接日を一覧で確認できます。
        </p>

        {/* 凡例 */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            タスク（優先度：高）
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            タスク（優先度：中）
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500 inline-block" />
            タスク（優先度：低）
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            面接
          </span>
        </div>

        <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            culture="ja"
            messages={{
              today: "今日",
              previous: "前へ",
              next: "次へ",
              month: "月",
              week: "週",
              day: "日",
              agenda: "一覧",
              noEventsInRange: "この期間にイベントはありません",
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: (event as CalendarEvent).color,
                borderRadius: "6px",
                border: "none",
                color: "white",
                fontSize: "12px",
              },
            })}
          />
        </div>
      </div>
    </main>
  );
}