import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          就活管理アプリ
        </Link>

        <nav className="flex gap-4 text-sm items-center">
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
          {session?.user && (
            <div className="flex items-center gap-3 ml-4">
              <span className="text-gray-500">{session.user.name}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
                >
                  ログアウト
                </button>
              </form>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}