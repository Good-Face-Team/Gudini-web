import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseAIChatProps {
  onDelta: (text: string) => void;
  onDone: () => void;
  model?: string;
  enableWebSearch?: boolean;
}

export function useAIChat({ onDelta, onDone, model, enableWebSearch }: UseAIChatProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const streamChat = async (messages: { role: string; content: string }[]) => {
    setIsStreaming(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            model: model || "google/gemini-2.5-flash",
            enableWebSearch: enableWebSearch || false,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Превышен лимит запросов",
            description: "Попробуйте позже",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Требуется пополнение",
            description: "Пополните баланс Lovable AI",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to start stream");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onDelta(content);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onDelta(content);
          } catch {}
        }
      }

      onDone();
    } catch (error: any) {
      console.error("Streaming error:", error);
      toast({
        title: "Ошибка соединения",
        description: error.message,
        variant: "destructive",
      });
      onDone();
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    streamChat,
    isStreaming,
  };
}
