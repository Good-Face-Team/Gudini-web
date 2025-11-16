import { useState } from "react";
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export function Message({ role, content, timestamp }: MessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group py-6 px-6 animate-fade-in",
        role === "assistant" ? "bg-ai-message" : "bg-user-message"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4">
          {/* Avatar */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold",
              role === "assistant"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {role === "assistant" ? "G" : "У"}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            </div>

            {/* Actions */}
            {role === "assistant" && (
              <div
                className={cn(
                  "flex items-center gap-1 pt-2 transition-all",
                  showActions ? "opacity-100" : "opacity-0"
                )}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2 transition-fast"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      <span className="text-xs">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      <span className="text-xs">Копировать</span>
                    </>
                  )}
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 transition-fast">
                  <ThumbsUp className="w-3 h-3" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 transition-fast">
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            )}

            {timestamp && (
              <p className="text-xs text-muted-foreground">
                {timestamp.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
