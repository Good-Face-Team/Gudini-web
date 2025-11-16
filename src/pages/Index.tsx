import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

  // ПРОСТЕЙШАЯ ГЛАВНАЯ СТРАНИЦА БЕЗ СЛОЖНЫХ КОМПОНЕНТОВ
  return (
    <div className="flex h-screen w-full bg-background">
      <div className="w-64 bg-sidebar-background p-4">
        <h2 className="text-lg font-bold mb-4">Gudini Chat</h2>
        <button 
          onClick={() => supabase.auth.signOut().then(() => navigate("/auth"))}
          className="w-full bg-red-500 text-white p-2 rounded"
        >
          Выйти
        </button>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Главная страница</h1>
          <p>Добро пожаловать, {user.email}!</p>
        </div>
        
        <div className="flex-1 p-4">
          <p>React работает! Ошибка CSS обойдена.</p>
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
