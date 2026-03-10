import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      companyName: body.companyName,
      interviewDate: body.interviewDate,
      questions: body.questions,
      answers: body.answers,
      goodPoints: body.goodPoints,
      improvements: body.improvements,
      nextAction: body.nextAction,
      rating: body.rating,
    },
  });
  return NextResponse.json(review);
}