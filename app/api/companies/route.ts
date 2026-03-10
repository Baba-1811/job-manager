import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(companies);
}

export async function POST(req: Request) {
  const body = await req.json();
  const company = await prisma.company.create({
    data: {
      name: body.name,
      industry: body.industry,
      interestLevel: body.interestLevel,
      status: body.status,
    },
  });
  return NextResponse.json(company);
}