"use client";

import { useEffect, useState } from "react";
import { Review } from "../../types/review";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyName, setCompanyName] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [goodPoints, setGoodPoints] = useState("");
  const [improvements, setImprovements] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [rating, setRating] = useState("3");

  // DBから振り返り一覧を取得
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setCompanyName("");
    setInterviewDate("");
    setQuestions("");
    setAnswers("");
    setGoodPoints("");
    setImprovements("");
    setNextAction("");
    setRating("3");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyName.trim() || !interviewDate.trim() || !questions.trim() || !answers.trim()) {
      alert("企業名・面接日・質問・回答は必須です。");
      return;
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName, interviewDate, questions, answers,
        goodPoints, improvements, nextAction, rating,
      }),
    });
    const newReview = await res.json();
    setReviews([newReview, ...reviews]);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews(reviews.filter((r) => r.id !== id));
  };

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
        <h1 className="text-3xl font-bold">面接振り返り一覧</h1>
        <p className="mt-3 text-gray-600">
          面接で聞かれたことや改善点を記録して、次回に活かします。
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">振り返り登録</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium">企業名</label>
                <input type="text" className="w-full rounded-md border px-3 py-2" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">面接日</label>
                <input type="date" className="w-full rounded-md border px-3 py-2" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">聞かれた質問</label>
                <textarea className="w-full rounded-md border px-3 py-2" rows={3} value={questions} onChange={(e) => setQuestions(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">自分の回答</label>
                <textarea className="w-full rounded-md border px-3 py-2" rows={3} value={answers} onChange={(e) => setAnswers(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">うまく答えられたこと</label>
                <textarea className="w-full rounded-md border px-3 py-2" rows={2} value={goodPoints} onChange={(e) => setGoodPoints(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">改善点</label>
                <textarea className="w-full rounded-md border px-3 py-2" rows={2} value={improvements} onChange={(e) => setImprovements(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">次回やること</label>
                <textarea className="w-full rounded-md border px-3 py-2" rows={2} value={nextAction} onChange={(e) => setNextAction(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">自己評価</label>
                <select className="w-full rounded-md border px-3 py-2" value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <button type="submit" className="rounded-md bg-black px-4 py-2 text-white">
                登録する
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">登録済み振り返り</h2>
            <div className="mt-6 space-y-4">
              {reviews.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-gray-500 shadow-sm">
                  まだ振り返りが登録されていません。
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full">
                        <h3 className="text-xl font-semibold">{review.companyName}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          面接日: {review.interviewDate} / 自己評価: {review.rating}
                        </p>
                        <div className="mt-4 space-y-3 text-sm text-gray-700">
                          <p><span className="font-semibold">質問:</span> {review.questions}</p>
                          <p><span className="font-semibold">回答:</span> {review.answers}</p>
                          <p><span className="font-semibold">良かった点:</span> {review.goodPoints}</p>
                          <p><span className="font-semibold">改善点:</span> {review.improvements}</p>
                          <p><span className="font-semibold">次回やること:</span> {review.nextAction}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}