import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QASection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const answer =
        "I don't have specific information on that topic in the current briefing sources. Try asking about the company's strategy, financial performance, or recent developments.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-primary" />
          Follow-up Q&A
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length > 0 && (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "text-sm rounded-lg p-3",
                  msg.role === "user"
                    ? "bg-primary/10 text-foreground ml-8"
                    : "bg-muted text-foreground/90 mr-8"
                )}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-muted text-muted-foreground text-sm rounded-lg p-3 mr-8 animate-pulse">
                Analyzing sources…
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question…"
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QASection;
