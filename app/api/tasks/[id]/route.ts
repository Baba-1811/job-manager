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
  const task = await prisma.task.update({
    where: { id: Number(id), userId: session.user.id },
    data: {
      title: body.title,
      companyId: body.companyId,
      dueDate: body.dueDate,
      priority: body.priority,
      status: body.status,
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.task.delete({
    where: { id: Number(id), userId: session.user.id },
  });
  return NextResponse.json({ success: true });
}