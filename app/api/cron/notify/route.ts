import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  // Vercel Cron からのリクエストを認証
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const todayStr = today.toISOString().split("T")[0];
  const threeDaysStr = threeDaysLater.toISOString().split("T")[0];

  // 全ユーザーを取得
  const users = await prisma.user.findMany({
    where: { email: { not: undefined } },
  });

  let notifiedCount = 0;

  for (const user of users) {
    if (!user.email) continue;

    // 期限が今日〜3日以内で未完了のタスクを取得
    const urgentTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: { not: "完了" },
        dueDate: { gte: todayStr, lte: threeDaysStr },
      },
      include: { company: true },
      orderBy: { dueDate: "asc" },
    });

    if (urgentTasks.length === 0) continue;

    // メール本文を組み立て
    const taskList = urgentTasks
      .map((task) => {
        const due = new Date(task.dueDate);
        const diffDays = Math.ceil(
          (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        const dueLabel =
          diffDays === 0 ? "今日が締切" : `あと${diffDays}日`;
        const priorityLabel =
          task.priority === "高" ? "🔴 高" : task.priority === "中" ? "🟡 中" : "⚪ 低";
        return `・【${dueLabel}】${task.title}（${task.company.name}）優先度: ${priorityLabel}`;
      })
      .join("\n");

    await resend.emails.send({
      from: "就活管理アプリ <onboarding@resend.dev>",
      to: user.email,
      subject: `📋 締切が近いタスクが${urgentTasks.length}件あります`,
      text: `${user.name ?? ""}さん、締切が近いタスクをお知らせします。\n\n${taskList}\n\n就活管理アプリで確認してください。\nhttps://job-manager-eight.vercel.app`,
    });

    notifiedCount++;
  }

  return NextResponse.json({ success: true, notifiedUsers: notifiedCount });
}
