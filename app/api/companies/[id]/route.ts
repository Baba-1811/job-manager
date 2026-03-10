import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const company = await prisma.company.update({
    where: { id: Number(params.id) },
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
  { params }: { params: { id: string } }
) {
  await prisma.company.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}