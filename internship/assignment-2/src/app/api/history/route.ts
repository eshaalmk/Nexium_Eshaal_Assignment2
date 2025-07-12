import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("summaries")
      .select("id, url, summary_en, summary_ur, created_at")
      .order("created_at", { ascending: false })
      .limit(10); // limit to recent 10

    if (error) throw error;

    return NextResponse.json({ history: data });
  } catch (err) {
    console.error("Error fetching history:", err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
