"use client";

import { useEffect, useState, useMemo } from "react";
import CompanyCard from "../components/CompanyCard";
import CompanySummary from "../components/CompanySummary";
import { Company } from "../../types/company";

const initialCompanies: Company[] = [
  {
    id: 1,
    name: "伊藤忠テクノソリューションズ",
    industry: "SIer",
    interestLevel: "高",
    status: "応募前",
  },
  {
    id: 2,
    name: "アクセンチュア",
    industry: "コンサル",
    interestLevel: "中",
    status: "ES提出済み",
  },
  {
    id: 3,
    name: "サイバーエージェント",
    industry: "IT",
    interestLevel: "高",
    status: "面接予定",
  },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  // フォーム
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [interestLevel, setInterestLevel] = useState("高");
  const [status, setStatus] = useState("応募前");

  // ★ 検索・フィルター用 state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInterest, setFilterInterest] = useState("すべて");
  const [filterStatus, setFilterStatus] = useState("すべて");

  useEffect(() => {
    const savedCompanies = localStorage.getItem("companies");
    if (savedCompanies) {
      try {
        const parsed = JSON.parse(savedCompanies);
        if (Array.isArray(parsed)) {
          const validCompanies = parsed.filter(
            (item) =>
              item &&
              typeof item.id === "number" &&
              typeof item.name === "string" &&
              typeof item.industry === "string" &&
              typeof item.interestLevel === "string" &&
              typeof item.status === "string"
          );
          setCompanies(validCompanies.length > 0 ? validCompanies : initialCompanies);
        } else {
          setCompanies(initialCompanies);
        }
      } catch {
        setCompanies(initialCompanies);
      }
    } else {
      setCompanies(initialCompanies);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
  }, [companies]);

  const resetForm = () => {
    setName("");
    setIndustry("");
    setInterestLevel("高");
    setStatus("応募前");
    setEditingCompanyId(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim()) {
      alert("企業名と業界を入力してください。");
      return;
    }
    if (editingCompanyId !== null) {
      setCompanies(companies.map((company) =>
        company.id === editingCompanyId
          ? { ...company, name, industry, interestLevel, status }
          : company
      ));
      resetForm();
      return;
    }
    const newCompany: Company = {
      id: Date.now(),
      name,
      industry,
      interestLevel,
      status,
    };
    setCompanies([newCompany, ...companies]);
    resetForm();
  };

  const handleDeleteCompany = (id: number) => {
    setCompanies(companies.filter((company) => company.id !== id));
    if (editingCompanyId === id) resetForm();
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompanyId(company.id);
    setName(company.name);
    setIndustry(company.industry);
    setInterestLevel(company.interestLevel);
    setStatus(company.status);
  };

  // ★ フィルター・検索ロジック
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
          {/* 登録フォーム */}
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
                <button
                  type="submit"
                  className="rounded-md bg-black px-4 py-2 text-white"
                >
                  {editingCompanyId !== null ? "更新する" : "登録する"}
                </button>
                {editingCompanyId !== null && (
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

          {/* 企業一覧 + 検索・フィルター */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">登録済み企業</h2>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterInterest("すべて");
                    setFilterStatus("すべて");
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
                  placeholder="企業名・業界で検索..."
                  className="w-full rounded-md border px-3 py-2 pl-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* フィルター選択 */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    志望度
                  </label>
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
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    選考ステータス
                  </label>
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

              {/* 件数表示 */}
              <p className="text-xs text-gray-500">
                {filteredCompanies.length} 件 / 全 {companies.length} 件
              </p>
            </div>

            {/* 企業カード一覧 */}
            <div className="mt-4 space-y-4">
              {filteredCompanies.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
                  {hasActiveFilter
                    ? "条件に一致する企業が見つかりません。"
                    : "まだ企業が登録されていません。"}
                </div>
              ) : (
                filteredCompanies
                  .filter(Boolean)
                  .map((company) => (
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