"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ThemeToggle from "@/components/themetoggle";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";

type ScrapeResult = {
  fullText: string;
  summary: string;
  translated: string;
};

type HistoryItem = {
  id: number;
  url: string;
  summary_en: string;
  summary_ur: string;
  created_at: string;
};

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return toast.error("Please enter a URL.");
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
      fetchHistory();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const fetchHistory = async () => {
    const res = await fetch("/api/history");
    const result = await res.json();
    if (result.history) setHistory(result.history);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 bg-gradient-to-br from-muted to-background rounded-xl shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          📝 Blog Summarizer
        </h1>
        <ThemeToggle />
      </div>

      <Card className="bg-card/80 backdrop-blur border border-border shadow-md hover:shadow-xl transition-all">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url" className="flex items-center gap-1">
                🔗 Blog URL
              </Label>
              <Input
                id="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:scale-[1.02] transition-transform duration-200"
            >
              🚀 Summarize Blog
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <Loader label="Summarizing your blog..." />}


      {data && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/90 backdrop-blur border border-border shadow-md hover:shadow-lg transition-all rounded-lg">
            <CardContent className="p-6 space-y-4">
              <Section
                title="Summary"
                content={data.summary}
                onCopy={() => copyToClipboard(data.summary)}
              />
              <Section
                title="Urdu Translation"
                content={data.translated}
                onCopy={() => copyToClipboard(data.translated)}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 mt-6">
            📜 Recent Summaries
          </h2>
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="bg-card/90 backdrop-blur border border-border shadow-md hover:shadow-lg transition-all rounded-lg">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium underline">{item.url}</p>
                  <Section
                    title="Summary"
                    content={item.summary_en}
                    onCopy={() => copyToClipboard(item.summary_en)}
                  />
                  <Section
                    title="Urdu Translation"
                    content={item.summary_ur}
                    onCopy={() => copyToClipboard(item.summary_ur)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

function Section({
  title,
  content,
  onCopy,
}: {
  title: string;
  content: string;
  onCopy: () => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-md font-bold flex items-center gap-1">
          {title === "Summary" ? "📄" : "🌐"} {title}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-muted-foreground whitespace-pre-line">{content}</p>
    </div>
  );
}
