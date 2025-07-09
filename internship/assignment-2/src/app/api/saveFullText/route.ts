// src/app/api/saveFullText/route.ts

import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fullText } = await req.json(); // The blog content

  const client = await clientPromise;
  const db = client.db("blogs"); // your DB name

  await db.collection("fulltext").insertOne({ text: fullText });

  return NextResponse.json({ success: true });
}
