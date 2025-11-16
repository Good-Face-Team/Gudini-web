import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useChats(userId: string | undefined) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }

    fetchChats();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('chats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки чатов",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (title: string) => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({ title, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Ошибка создания чата",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;
      
      toast({
        title: "Чат удален",
        description: "Чат успешно удален",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка удаления чата",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq('id', chatId);

      if (error) throw error;
      
      toast({
        title: "Чат переименован",
        description: "Название чата обновлено",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка переименования",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    chats,
    loading,
    createChat,
    deleteChat,
    renameChat,
    refreshChats: fetchChats,
  };
}
