import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { InputPanel } from "@/components/InputPanel";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useChats } from "@/hooks/useChats";
import { useMessages } from "@/hooks/useMessages";
import { useAIChat } from "@/hooks/useAIChat";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");
  const [deepThinking, setDeepThinking] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { chats, loading: chatsLoading, createChat, deleteChat, renameChat } = useChats(user?.id);
  const { messages, loading: messagesLoading, addMessage, setMessages } = useMessages(currentChatId);

  const { streamChat } = useAIChat({
    onDelta: (text) => {
      setStreamingContent((prev) => prev + text);
    },
    onDone: async () => {
      if (streamingContent && currentChatId) {
        await addMessage("assistant", streamingContent);
        setStreamingContent("");
      }
      setIsStreaming(false);
    },
    model: selectedModel,
    enableWebSearch: webSearch,
  });

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleStartChat = async (message: string) => {
    if (!user) return;

    // Create new chat with first message as title
    const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");
    const newChat = await createChat(title);
    
    if (newChat) {
      setCurrentChatId(newChat.id);
      await handleSendMessage(message, newChat.id);
    }
  };

  const handleSendMessage = async (content: string, chatId?: string) => {
    const targetChatId = chatId || currentChatId;
    if (!targetChatId || !user) return;

    // Add user message
    await addMessage("user", content);

    // Start streaming AI response
    setIsStreaming(true);
    setStreamingContent("");

    const allMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content },
    ];

    await streamChat(allMessages);
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const handleClearChat = () => {
    if (currentChatId) {
      handleDeleteChat(currentChatId);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  const showWelcome = !currentChatId && messages.length === 0;
  const currentChat = chats.find((c) => c.id === currentChatId);

  return (
    <div className="flex h-screen w-full bg-background">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={renameChat}
        user={user}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {!showWelcome && (
          <>
            <ChatHeader
              chatTitle={currentChat?.title || "Новый чат"}
              selectedModel={selectedModel}
              onClearChat={handleClearChat}
            />

            <MessageList
              messages={messages}
              isLoading={isStreaming}
              streamingContent={streamingContent}
            />

            <InputPanel
              onSend={(msg) => handleSendMessage(msg)}
              disabled={isStreaming}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              deepThinking={deepThinking}
              onDeepThinkingChange={setDeepThinking}
              webSearch={webSearch}
              onWebSearchChange={setWebSearch}
            />
          </>
        )}

        {showWelcome && <WelcomeScreen onStartChat={handleStartChat} />}
      </div>
    </div>
  );
};

export default Index;
