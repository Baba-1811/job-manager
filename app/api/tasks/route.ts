import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { dueDate: "asc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const task = await prisma.task.create({
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