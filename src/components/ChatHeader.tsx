import { Share2, Trash2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

interface ChatHeaderProps {
  chatTitle: string;
  selectedModel: string;
  onClearChat: () => void;
}

export function ChatHeader({ chatTitle, selectedModel, onClearChat }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{chatTitle}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span>{selectedModel}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="transition-fast"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Переключить тему</span>
        </Button>

        <Button variant="ghost" size="sm" className="transition-fast">
          <Share2 className="w-4 h-4 mr-2" />
          Поделиться
        </Button>

        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive transition-fast" onClick={onClearChat}>
          <Trash2 className="w-4 h-4 mr-2" />
          Очистить
        </Button>
      </div>
    </header>
  );
}
