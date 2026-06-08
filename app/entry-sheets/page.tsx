"use client";

import { useEffect, useMemo, useState } from "react";
import { EntrySheet } from "../../types/entrySheet";
import { Company } from "../../types/company";

const STATUS_OPTIONS = ["下書き中", "提出済み", "通過", "不合格"];

export default function EntrySheetsPage() {
  const [entrySheets, setEntrySheets] = useState<EntrySheet[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [charLimit, setCharLimit] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/entry-sheets").then((r) => r.json()),
      fetch("/api/companies").then((r) => r.json()),
    ]).then(([entrySheetsData, companiesData]: [EntrySheet[], Company[]]) => {
      setEntrySheets(entrySheetsData);
      setCompanies(companiesData);
      if (companiesData.length > 0) setCompanyId(companiesData[0].id);
      setLoading(false);
    });
  }, []);

  const resetForm = () => {
    setCompanyId(companies.length > 0 ? companies[0].id : null);
    setQuestion("");
    setAnswer("");
    setCharLimit("");
    setStatus(STATUS_OPTIONS[0]);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyId || !question.trim() || !answer.trim()) {
      alert("企業・設問・回答は必須です。");
      return;
    }
    const payload = { companyId, question, answer, charLimit: charLimit || null, status };

    if (editingId) {
      const res = await fetch(`/api/entry-sheets/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setEntrySheets(entrySheets.map((es) => (es.id === editingId ? updated : es)));
    } else {
      const res = await fetch("/api/entry-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setEntrySheets([created, ...entrySheets]);
    }
    resetForm();
  };

  const handleEdit = (es: EntrySheet) => {
    setEditingId(es.id);
    setCompanyId(es.companyId);
    setQuestion(es.question);
    setAnswer(es.answer);
    setCharLimit(es.charLimit ? String(es.charLimit) : "");
    setStatus(es.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/entry-sheets/${id}`, { method: "DELETE" });
    setEntrySheets(entrySheets.filter((es) => es.id !== id));
    if (editingId === id) resetForm();
  };

  const answerLength = useMemo(() => answer.length, [answer]);
  const limitNumber = charLimit ? Number(charLimit) : null;
  const overLimit = limitNumber !== null && answerLength > limitNumber;

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
        <h1 className="text-2xl md:text-3xl font-bold">ES管理</h1>
        <p className="mt-3 text-gray-600">
          企業ごとのES設問・回答とステータスを記録して、選考対策に活用します。
        </p>
        <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-[380px_1fr]">
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">{editingId ? "ES編集" : "ES登録"}</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium">企業</label>
                {companies.length === 0 ? (
                  <p className="text-sm text-gray-500">先に企業を登録してください。</p>
                ) : (
                  <select
                    className="w-full rounded-md border px-3 py-2"
                    value={companyId ?? ""}
                    onChange={(e) => setCompanyId(Number(e.target.value))}
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">設問</label>
                <textarea className="w-full rounded-md border px-3 py-2" rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">文字数制限（任意）</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-md border px-3 py-2"
                  value={charLimit}
                  onChange={(e) => setCharLimit(e.target.value)}
                  placeholder="例：400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">回答</label>
                <textarea className="w-full rounded-md border px-3 py-2" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} />
                <p className={`mt-1 text-sm ${overLimit ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                  {answerLength}文字{limitNumber !== null && ` / ${limitNumber}文字`}
                  {overLimit && "（文字数制限を超えています）"}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">ステータス</label>
                <select className="w-full rounded-md border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="rounded-md bg-black px-4 py-2 text-white">
                  {editingId ? "更新する" : "登録する"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-md border px-4 py-2">
                    キャンセル
                  </button>
                )}
              </div>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">登録済みES</h2>
            <div className="mt-6 space-y-4">
              {entrySheets.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
                  まだESが登録されていません。
                </div>
              ) : (
                entrySheets.map((es) => {
                  const length = es.answer.length;
                  const limit = es.charLimit;
                  const over = limit !== null && length > limit;
                  return (
                    <div key={es.id} className="rounded-xl border bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold">{es.company?.name ?? "不明"}</h3>
                            <span className="rounded-full border px-2 py-0.5 text-xs text-gray-600">{es.status}</span>
                          </div>
                          <p className="mt-3 text-sm text-gray-700">
                            <span className="font-semibold">設問:</span> {es.question}
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                            <span className="font-semibold">回答:</span> {es.answer}
                          </p>
                          <p className={`mt-2 text-sm ${over ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                            {length}文字{limit !== null && ` / ${limit}文字`}
                            {over && "（文字数制限を超えています）"}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          <button type="button" onClick={() => handleEdit(es)} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100">
                            編集
                          </button>
                          <button type="button" onClick={() => handleDelete(es.id)} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100">
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
