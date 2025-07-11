
"use client";

type ScrapeResult = {
  fullText: string;
  summary: string;
  translated: string;
};


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy } from "lucide-react";
import ThemeToggle from "@/components/themetoggle";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapeResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);
      setData(null);

      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to fetch");

      setData(result);
      toast.success("Content fetched successfully!");
    } catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(err.message || "Something went wrong.");
  } else {
    toast.error("Something went wrong.");
  }
} finally {
  setLoading(false);
}
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
  <main className="max-w-3xl mx-auto p-6 space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Blog Summarizer</h1>
      <ThemeToggle />
    </div>

    <Card>
      <CardContent className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Blog URL</Label>
            <Input
              id="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Summarize Blog
          </Button>
        </form>
      </CardContent>
    </Card>

    {loading && (
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[80%]" />
        <Skeleton className="h-6 w-[60%]" />
      </div>
    )}

    {data && (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Section title="Summary" content={data.summary} onCopy={() => copyToClipboard(data.summary)} />
          <Section title="Urdu Translation" content={data.translated} onCopy={() => copyToClipboard(data.translated)} />
        </CardContent>
      </Card>
    )}
  </main>
);
}

function Section({ title, content, onCopy }: { title: string; content: string; onCopy: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-bold">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-muted-foreground whitespace-pre-line">{content}</p>
    </div>
  );
}
