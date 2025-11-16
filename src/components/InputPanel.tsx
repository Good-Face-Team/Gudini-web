import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Globe, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InputPanelProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  deepThinking: boolean;
  onDeepThinkingChange: (value: boolean) => void;
  webSearch: boolean;
  onWebSearchChange: (value: boolean) => void;
}

const AI_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  { id: "openai/gpt-5", name: "GPT-5" },
];

export function InputPanel({
  onSend,
  disabled,
  selectedModel,
  onModelChange,
  deepThinking,
  onDeepThinkingChange,
  webSearch,
  onWebSearchChange,
}: InputPanelProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 py-4 space-y-4">
        {/* Options Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="deep-thinking"
                checked={deepThinking}
                onCheckedChange={onDeepThinkingChange}
              />
              <Label htmlFor="deep-thinking" className="flex items-center gap-1 cursor-pointer">
                <Brain className="w-4 h-4" />
                Глубокое мышление
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="web-search"
                checked={webSearch}
                onCheckedChange={onWebSearchChange}
              />
              <Label htmlFor="web-search" className="flex items-center gap-1 cursor-pointer">
                <Globe className="w-4 h-4" />
                Веб-поиск
              </Label>
            </div>
          </div>
        </div>

        {/* Input Row */}
        <div className="relative flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-fast"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Отправьте сообщение..."
            className="min-h-[44px] max-h-[200px] resize-none transition-fast"
            disabled={disabled}
            rows={1}
          />

          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="shrink-0 bg-primary hover:bg-primary-hover transition-fast"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Gudini может совершать ошибки. Проверяйте важную информацию.
        </p>
      </div>
    </div>
  );
}
