import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const company = await prisma.company.update({
    where: { id: Number(id) },
    data: {
      name: body.name,
      industry: body.industry,
      interestLevel: body.interestLevel,
      status: body.status,
    },
  });
  return NextResponse.json(company);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.company.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ success: true });
}