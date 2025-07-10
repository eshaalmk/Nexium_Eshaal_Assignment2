import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { summarizeText } from "@/lib/summarize";
import { translateToUrdu } from "@/lib/translate";
import { supabase } from "@/lib/supabase";
import clientPromise from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch URL: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Adjust selector to your blog's structure
    const fullText = $("article p")
      .map((i, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join("\n\n");

    const summary = summarizeText(fullText);
    const translated = translateToUrdu(summary);

    // ✅ Save full text to MongoDB
    const client = await clientPromise;
    const db = client.db("blogs");
    const collection = db.collection("fulltext");

    await collection.insertOne({
      url,
      fullText,
      created_at: new Date(),
    });

    // ✅ Save summary to Supabase
    await supabase.from("summaries").insert([
      {
        url,
        summary_en: summary,
        summary_ur: translated,
      },
    ]);

    return NextResponse.json({ fullText, summary, translated });

  } catch (error) {
    console.error("❌ Error in /api/scrape:", error);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
