"use client";

import { useState } from "react";
import { Company } from "../../types/company";

type CompanyFormProps = {
  onAdd: (company: Company) => void;
};

export default function CompanyForm({ onAdd }: CompanyFormProps) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [interestLevel, setInterestLevel] = useState("高");
  const [status, setStatus] = useState("応募前");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !industry.trim()) {
      alert("企業名と業界を入力してください。");
      return;
    }

    const newCompany: Company = {
      id: Date.now(),
      name,
      industry,
      interestLevel,
      status,
    };

    onAdd(newCompany);

    setName("");
    setIndustry("");
    setInterestLevel("高");
    setStatus("応募前");
  };

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">企業登録</h2>

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
          <label className="mb-1 block text-sm font-medium">
            選考ステータス
          </label>
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