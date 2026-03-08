import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          就活管理アプリ
        </Link>

        <nav className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>
          <Link href="/companies" className="hover:underline">
            企業一覧
          </Link>
          <Link href="/tasks" className="hover:underline">
            タスク一覧
          </Link>
          <Link href="/reviews" className="hover:underline">
            面接振り返り
          </Link>
        </nav>
      </div>
    </header>
  );
}