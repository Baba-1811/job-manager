import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const task = await prisma.task.update({
    where: { id: Number(params.id) },
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
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}