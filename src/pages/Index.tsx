import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatSidebar } from "@/components/ChatSidebar";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Перенаправление на страницу входа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <ChatSidebar
        chats={[]}
        currentChatId={null}
        onNewChat={() => console.log("new chat")}
        onSelectChat={() => {}}
        onDeleteChat={() => {}}
        onRenameChat={() => {}}
        user={user}
        onSignOut={() => supabase.auth.signOut().then(() => navigate("/auth"))}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Главная страница</h1>
          <p>Добро пожаловать, {user.email}!</p>
        </div>
        
        <div className="flex-1 p-4">
          <p>ChatSidebar добавлен</p>
          <button 
            onClick={() => alert('React работает!')}
            className="bg-primary text-white p-2 rounded mt-4"
          >
            Тестовая кнопка
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
