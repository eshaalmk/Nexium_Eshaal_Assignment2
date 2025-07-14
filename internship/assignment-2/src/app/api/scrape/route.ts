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
    // Broader set of selectors to cover more layouts
const selectors = [
  "article p",
  ".entry-content p",
  ".post-content p",
  ".blog-content p",
  ".content-area p",
  "main p",
  ".post p",
  ".et_pb_text_inner p"
];

let paragraphs: string[] = [];
let maxLength = 0;

selectors.forEach((selector) => {
  const elements = $(selector);
  if (elements.length) {
    const textArr = elements
      .map((i, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    const totalLength = textArr.join(" ").length;

    if (totalLength > maxLength) {
      paragraphs = textArr;
      maxLength = totalLength;
    }
  }
});


// 🛡️ Fallback: if no paragraphs matched, try all <p> tags in body (excluding nav/header/footer)
if (paragraphs.length === 0) {
  const fallbackParagraphs = $("body p")
    .filter((_, el) => {
      const parent = $(el).parents();
      return !parent.is("header, nav, footer, aside");
    })
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  if (fallbackParagraphs.length > 0) {
    paragraphs = fallbackParagraphs;
  }
}

const fullText = paragraphs.join("\n\n");



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
