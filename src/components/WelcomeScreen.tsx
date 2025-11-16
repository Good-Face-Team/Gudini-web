import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface WelcomeScreenProps {
  onStartChat: (message: string) => void;
}

export function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onStartChat(message);
    }
  };

  const suggestions = [
    "Помоги мне написать код на Python",
    "Объясни квантовую физику простыми словами",
    "Создай план тренировок на неделю",
    "Расскажи о последних новостях в IT",
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mx-auto shadow-lg">
            <span className="text-5xl font-bold text-primary-foreground">G</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Добро пожаловать в Gudini</h1>
            <p className="text-lg text-muted-foreground">
              Ваш AI-ассистент от Good Face Team
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Задайте вопрос или начните диалог..."
              className="min-h-[120px] pr-12 text-lg"
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim()}
              className="absolute right-2 bottom-2 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Или попробуйте:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                className="p-4 text-left rounded-lg border border-border hover:bg-accent/50 transition-all hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-sm">{suggestion}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
