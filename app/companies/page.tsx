"use client";

import { useEffect, useState, useMemo } from "react";
import CompanyCard from "../components/CompanyCard";
import CompanySummary from "../components/CompanySummary";
import { Company } from "../../types/company";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [interestLevel, setInterestLevel] = useState("高");
  const [status, setStatus] = useState("応募前");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterInterest, setFilterInterest] = useState("すべて");
  const [filterStatus, setFilterStatus] = useState("すべて");

  // DBから企業一覧を取得
  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setName("");
    setIndustry("");
    setInterestLevel("高");
    setStatus("応募前");
    setEditingCompanyId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim()) {
      alert("企業名と業界を入力してください。");
      return;
    }

    if (editingCompanyId !== null) {
      // 更新
      const res = await fetch(`/api/companies/${editingCompanyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, industry, interestLevel, status }),
      });
      const updated = await res.json();
      setCompanies(companies.map((c) => (c.id === editingCompanyId ? updated : c)));
      resetForm();
      return;
    }

    // 新規追加
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, industry, interestLevel, status }),
    });
    const newCompany = await res.json();
    setCompanies([newCompany, ...companies]);
    resetForm();
  };

  const handleDeleteCompany = async (id: number) => {
    await fetch(`/api/companies/${id}`, { method: "DELETE" });
    setCompanies(companies.filter((c) => c.id !== id));
    if (editingCompanyId === id) resetForm();
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompanyId(company.id);
    setName(company.name);
    setIndustry(company.industry);
    setInterestLevel(company.interestLevel);
    setStatus(company.status);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        searchQuery === "" ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInterest =
        filterInterest === "すべて" || company.interestLevel === filterInterest;
      const matchesStatus =
        filterStatus === "すべて" || company.status === filterStatus;
      return matchesSearch && matchesInterest && matchesStatus;
    });
  }, [companies, searchQuery, filterInterest, filterStatus]);

  const hasActiveFilter =
    searchQuery !== "" || filterInterest !== "すべて" || filterStatus !== "すべて";

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">企業管理</h1>
        <p className="mt-3 text-gray-600">
          企業情報・志望度・選考ステータスをまとめて管理します。
        </p>

        <div className="mt-8">
          <CompanySummary companies={companies} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">
              {editingCompanyId !== null ? "企業編集" : "企業登録"}
            </h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium">企業名</label>
                <input
                  type="text"
                  placeholder="例: サイバーエージェント"
                  className="w-full rounded-md border px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">業界</label>
                <input
                  type="text"
                  placeholder="例: IT / SIer / コンサル"
                  className="w-full rounded-md border px-3 py-2"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">志望度</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={interestLevel}
                  onChange={(e) => setInterestLevel(e.target.value)}
                >
                  <option>高</option>
                  <option>中</option>
                  <option>低</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">選考ステータス</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>応募前</option>
                  <option>ES提出済み</option>
                  <option>Webテスト済み</option>
                  <option>面接予定</option>
                  <option>内定</option>
                  <option>お祈り</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-md bg-black px-4 py-2 text-white">
                  {editingCompanyId !== null ? "更新する" : "登録する"}
                </button>
                {editingCompanyId !== null && (
                  <button type="button" onClick={resetForm} className="rounded-md border px-4 py-2">
                    キャンセル
                  </button>
                )}
              </div>
            </form>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">登録済み企業</h2>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setFilterInterest("すべて"); setFilterStatus("すべて"); }}
                  className="text-sm text-gray-500 hover:text-black underline"
                >
                  フィルターをリセット
                </button>
              )}
            </div>

            <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="企業名・業界で検索..."
                  className="w-full rounded-md border px-3 py-2 pl-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">志望度</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={filterInterest}
                    onChange={(e) => setFilterInterest(e.target.value)}
                  >
                    <option>すべて</option>
                    <option>高</option>
                    <option>中</option>
                    <option>低</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">選考ステータス</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>すべて</option>
                    <option>応募前</option>
                    <option>ES提出済み</option>
                    <option>Webテスト済み</option>
                    <option>面接予定</option>
                    <option>内定</option>
                    <option>お祈り</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-500">{filteredCompanies.length} 件 / 全 {companies.length} 件</p>
            </div>

            <div className="mt-4 space-y-4">
              {filteredCompanies.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
                  {hasActiveFilter ? "条件に一致する企業が見つかりません。" : "まだ企業が登録されていません。"}
                </div>
              ) : (
                filteredCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    onDelete={handleDeleteCompany}
                    onEdit={handleEditCompany}
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