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
  raw?: Task | Review;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 追加モーダル
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCompanyId, setNewCompanyId] = useState<number | null>(null);
  const [newPriority, setNewPriority] = useState("高");
  const [newStatus, setNewStatus] = useState("未着手");

  // 詳細モーダル
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/companies").then((r) => r.json()),
    ]).then(([tasksData, reviews, companiesData]: [Task[], Review[], Company[]]) => {
      setTasks(tasksData);
      setCompanies(companiesData);
      buildEvents(tasksData, reviews, companiesData);
      setLoading(false);
    });
  }, []);

  const buildEvents = (tasksData: Task[], reviews: Review[], companiesData: Company[]) => {
    const taskEvents: CalendarEvent[] = tasksData.map((task) => {
      const company = companiesData.find((c) => c.id === task.companyId);
      const color =
        task.priority === "高" ? "#ef4444"
        : task.priority === "中" ? "#f59e0b"
        : "#6b7280";
      return {
        title: `📋 ${task.title}（${company?.name ?? "不明"}）`,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
        type: "task",
        color,
        raw: task,
      };
    });

    const reviewEvents: CalendarEvent[] = reviews.map((review) => ({
      title: `🎤 面接：${review.companyName}`,
      start: new Date(review.interviewDate),
      end: new Date(review.interviewDate),
      allDay: true,
      type: "review",
      color: "#3b82f6",
      raw: review,
    }));

    setEvents([...taskEvents, ...reviewEvents]);
  };

  // 日付クリック → 追加モーダルを開く
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setNewTitle("");
    setNewCompanyId(companies[0]?.id ?? null);
    setNewPriority("高");
    setNewStatus("未着手");
    setAddModalOpen(true);
  };

  // タスク追加
  const handleAddTask = async () => {
    if (!newTitle.trim() || newCompanyId === null || !selectedDate) {
      alert("タスク名と企業名を入力してください。");
      return;
    }
    const dueDate = format(selectedDate, "yyyy-MM-dd");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        companyId: newCompanyId,
        dueDate,
        priority: newPriority,
        status: newStatus,
      }),
    });
    const newTask: Task = await res.json();
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);

    // カレンダーに反映
    const company = companies.find((c) => c.id === newTask.companyId);
    const color =
      newTask.priority === "高" ? "#ef4444"
      : newTask.priority === "中" ? "#f59e0b"
      : "#6b7280";
    const newEvent: CalendarEvent = {
      title: `📋 ${newTask.title}（${company?.name ?? "不明"}）`,
      start: new Date(newTask.dueDate),
      end: new Date(newTask.dueDate),
      allDay: true,
      type: "task",
      color,
      raw: newTask,
    };
    setEvents((prev) => [...prev, newEvent]);
    setAddModalOpen(false);
  };

  // イベントクリック → 詳細モーダル
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  const taskRaw = selectedEvent?.raw as Task | undefined;
  const selectedCompany = companies.find((c) => c.id === taskRaw?.companyId);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold">カレンダー</h1>
        <p className="mt-3 text-gray-600">
          日付をクリックしてタスクを追加、イベントをクリックして詳細を確認できます。
        </p>

        {/* 凡例 */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />タスク（優先度：高）
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />タスク（優先度：中）
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500 inline-block" />タスク（優先度：低）
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />面接
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
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
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
                cursor: "pointer",
              },
            })}
          />
        </div>
      </div>

      {/* ===== タスク追加モーダル ===== */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">タスクを追加</h2>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-gray-400 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">日付</p>
              <p className="font-medium">
                {selectedDate ? format(selectedDate, "yyyy年MM月dd日") : ""}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">タスク名</label>
                <input
                  type="text"
                  placeholder="例: ES提出"
                  className="w-full rounded-md border px-3 py-2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">企業名</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={newCompanyId ?? ""}
                  onChange={(e) => setNewCompanyId(Number(e.target.value))}
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">優先度</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
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
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option>未着手</option>
                  <option>進行中</option>
                  <option>完了</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddTask}
                className="flex-1 rounded-md bg-black px-4 py-2 text-white hover:opacity-80"
              >
                追加する
              </button>
              <button
                onClick={() => setAddModalOpen(false)}
                className="flex-1 rounded-md border px-4 py-2 hover:bg-gray-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 詳細モーダル ===== */}
      {detailModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setDetailModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* カラーヘッダー */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: selectedEvent.color }}
            >
              <h2 className="text-white font-bold text-lg">
                {selectedEvent.type === "task" ? "📋 タスク詳細" : "🎤 面接詳細"}
              </h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-white/80 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedEvent.type === "task" && taskRaw && (
                <>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">タスク名</p>
                    <p className="text-lg font-semibold">{taskRaw.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">企業名</p>
                      <p className="font-medium">{selectedCompany?.name ?? "不明"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">締切日</p>
                      <p className="font-medium">{taskRaw.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">優先度</p>
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        taskRaw.priority === "高" ? "bg-red-100 text-red-700"
                        : taskRaw.priority === "中" ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700"
                      }`}>
                        {taskRaw.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">ステータス</p>
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        taskRaw.status === "完了" ? "bg-green-100 text-green-700"
                        : taskRaw.status === "進行中" ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                      }`}>
                        {taskRaw.status}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {selectedEvent.type === "review" && (
                <>
                  {(() => {
                    const review = selectedEvent.raw as Review;
                    return (
                      <>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">企業名</p>
                          <p className="text-lg font-semibold">{review.companyName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">面接日</p>
                            <p className="font-medium">{review.interviewDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">自己評価</p>
                            <p className="font-medium">{"⭐".repeat(Number(review.rating))}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">聞かれた質問</p>
                          <p className="text-sm text-gray-700">{review.questions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">良かった点</p>
                          <p className="text-sm text-gray-700">{review.goodPoints}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">改善点</p>
                          <p className="text-sm text-gray-700">{review.improvements}</p>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="w-full rounded-md border px-4 py-2 hover:bg-gray-50 text-sm"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}