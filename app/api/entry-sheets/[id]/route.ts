import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const entrySheet = await prisma.entrySheet.update({
    where: { id: Number(id), userId: session.user.id },
    data: {
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.entrySheet.delete({
    where: { id: Number(id), userId: session.user.id },
  });
  return NextResponse.json({ success: true });
}
