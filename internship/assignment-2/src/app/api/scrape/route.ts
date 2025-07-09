import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

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

    // Adjust this selector depending on the site layout
    const fullText = $("article p")
  .map((i, el) => $(el).text().trim())
  .get()
  .filter(Boolean) // remove empty paragraphs
  .join("\n\n");

    return NextResponse.json({ fullText });

  } catch (error) {
    console.error("❌ Error in /api/scrape:", error);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}



