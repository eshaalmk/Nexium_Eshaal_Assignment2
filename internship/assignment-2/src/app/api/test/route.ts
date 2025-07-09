// src/app/api/test/route.ts

import { supabase } from "@/lib/supabase";
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🧪 Test MongoDB
    const mongoClient = await clientPromise;
    const mongoDb = mongoClient.db("blogs");
    const collections = await mongoDb.listCollections().toArray();

    // 🧪 Test Supabase
    const { data: summaries, error } = await supabase.from("summaries").select("*").limit(1);

    return NextResponse.json({
      mongoCollections: collections.map((c) => c.name),
      supabaseTest: summaries || [],
      supabaseError: error || null,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
