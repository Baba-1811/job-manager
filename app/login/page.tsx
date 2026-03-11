"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4">
      <h1 className="text-2xl font-bold">就活管理アプリ</h1>
      <p className="text-gray-600">ログインして就活情報を管理しましょう</p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="rounded-lg bg-blue-500 px-6 py-3 text-base text-white hover:bg-blue-600"
      >
        Googleでログイン
      </button>
    </div>
  );
}