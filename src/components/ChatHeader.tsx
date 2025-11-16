import { Share2, Trash2, Moon, Sun, Menu, MessageSquarePlus } from "lucide-react";
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
  onToggleSidebar: () => void;
  onNewChat: () => void;
  showMobileControls?: boolean;
}

export function ChatHeader({ 
  chatTitle, 
  selectedModel, 
  onClearChat, 
  onToggleSidebar,
  onNewChat,
  showMobileControls = false 
}: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Кнопка меню для мобильных */}
        {showMobileControls && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold truncate max-w-[150px] lg:max-w-none">
            {chatTitle}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="hidden sm:inline">{selectedModel}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Кнопка нового чата для мобильных */}
        {showMobileControls && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="lg:hidden"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="transition-fast hidden sm:flex"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Переключить тему</span>
        </Button>

        <Button variant="ghost" size="sm" className="transition-fast hidden sm:flex">
          <Share2 className="w-4 h-4 mr-2" />
          <span className="hidden lg:inline">Поделиться</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive transition-fast">
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Очистить</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClearChat}>
              Очистить чат
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
