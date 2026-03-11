"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import SettingsPanel from "./SettingsPanel";
import { useSettings, getSettingsClasses } from "../contexts/SettingsContext";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();
  const { themeColorClass } = getSettingsClasses(settings);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          就活管理アプリ
        </Link>

        {/* スマホ：ハンバーガー＋設定ボタン */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="relative">
            <button
              onClick={() => { setSettingsOpen(!settingsOpen); setMenuOpen(false); }}
              className="text-xl"
            >
              ⚙️
            </button>
            {settingsOpen && (
              <SettingsPanel onClose={() => setSettingsOpen(false)} />
            )}
          </div>
          <button
            className="text-2xl"
            onClick={() => { setMenuOpen(!menuOpen); setSettingsOpen(false); }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* PCナビ */}
        <nav className="hidden md:flex gap-4 text-sm items-center">
          <Link href="/" className="hover:underline">ホーム</Link>
          <Link href="/companies" className="hover:underline">企業一覧</Link>
          <Link href="/tasks" className="hover:underline">タスク一覧</Link>
          <Link href="/reviews" className="hover:underline">面接振り返り</Link>

          {/* 設定ボタン（PC） */}
          <div className="relative ml-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="text-xl hover:opacity-70"
            >
              ⚙️
            </button>
            {settingsOpen && (
              <SettingsPanel onClose={() => setSettingsOpen(false)} />
            )}
          </div>

          {session?.user && (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-gray-500">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={`${themeColorClass} hover:opacity-80 px-3 py-1 rounded text-sm text-white`}
              >
                ログアウト
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* スマホメニュー */}
      {menuOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)}>ホーム</Link>
          <Link href="/companies" onClick={() => setMenuOpen(false)}>企業一覧</Link>
          <Link href="/tasks" onClick={() => setMenuOpen(false)}>タスク一覧</Link>
          <Link href="/reviews" onClick={() => setMenuOpen(false)}>面接振り返り</Link>
          {session?.user && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-gray-500">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={`${themeColorClass} hover:opacity-80 px-3 py-1 rounded text-sm text-white`}
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