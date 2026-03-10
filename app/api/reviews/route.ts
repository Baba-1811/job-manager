import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const body = await req.json();
  const review = await prisma.review.create({
    data: {
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