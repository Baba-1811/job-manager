// app/components/Header.tsx
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          就活管理アプリ
        </Link>

        {/* ハンバーガーボタン（スマホのみ表示） */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* PCナビ（md以上で表示） */}
        <nav className="hidden md:flex gap-4 text-sm items-center">
          <Link href="/" className="hover:underline">ホーム</Link>
          <Link href="/companies" className="hover:underline">企業一覧</Link>
          <Link href="/tasks" className="hover:underline">タスク一覧</Link>
          <Link href="/reviews" className="hover:underline">面接振り返り</Link>
          {session?.user && (
            <div className="flex items-center gap-3 ml-4">
              <span className="text-gray-500">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
              >
                ログアウト
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* スマホメニュー（開いた時だけ表示） */}
      {menuOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:underline">ホーム</Link>
          <Link href="/companies" onClick={() => setMenuOpen(false)} className="hover:underline">企業一覧</Link>
          <Link href="/tasks" onClick={() => setMenuOpen(false)} className="hover:underline">タスク一覧</Link>
          <Link href="/reviews" onClick={() => setMenuOpen(false)} className="hover:underline">面接振り返り</Link>
          {session?.user && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-gray-500">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
              >
                ログアウト
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}