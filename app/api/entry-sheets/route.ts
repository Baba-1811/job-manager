import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entrySheets = await prisma.entrySheet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { company: true },
  });
  return NextResponse.json(entrySheets);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const entrySheet = await prisma.entrySheet.create({
    data: {
      userId: session.user.id,
      companyId: body.companyId,
      question: body.question,
      answer: body.answer,
      charLimit: body.charLimit ? Number(body.charLimit) : null,
      status: body.status,
    },
    include: { company: true },
  });
  return NextResponse.json(entrySheet);
}
