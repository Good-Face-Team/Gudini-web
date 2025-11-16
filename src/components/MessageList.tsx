import { useEffect, useRef } from "react";
import { Message } from "./Message";
import { Loader2 } from "lucide-react";

interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: MessageData[];
  isLoading?: boolean;
  streamingContent?: string;
}

export function MessageList({ messages, isLoading, streamingContent }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-primary">G</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Добро пожаловать в Gudini</h3>
              <p className="text-muted-foreground">
                Задайте вопрос, и я помогу вам найти ответ
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={new Date(message.created_at)}
            />
          ))}
          
          {isLoading && streamingContent && (
            <div className="py-6 px-6 bg-ai-message animate-fade-in">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-semibold">
                    G
                  </div>
                  <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
                    {streamingContent}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && !streamingContent && (
            <div className="py-6 px-6 bg-ai-message animate-fade-in">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-semibold">
                    G
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Думаю...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
