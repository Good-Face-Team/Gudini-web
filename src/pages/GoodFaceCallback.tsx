import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function GoodFaceCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      // Для HashRouter получаем параметры из хэша
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const code = hashParams.get("code");

      if (!code) {
        toast({
          title: "Ошибка авторизации",
          description: "Код авторизации не найден",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      try {
        // Exchange code for token
        const tokenResponse = await fetch(
          "https://id.goodfaceteam.ru/public/token.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              // Для GitHub Pages используем полный URL
              redirect_uri: "https://good-face-team.github.io/Gudini-web/#/goodface-callback",
              client_id:
                "12566d9ce28b060e1fb61a8f1c51b121e3e855c8810b217101d9b6668cc979a5",
              client_secret:
                "495c3f7564d1fe39ee64ab24d003843b588551803f080d902d2d90707903ec82",
            }),
          }
        );

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
          throw new Error("Failed to get access token");
        }

        // Get user data
        const userResponse = await fetch(
          "https://id.goodfaceteam.ru/public/user.php",
          {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          }
        );

        const userData = await userResponse.json();
        if (!userData.id) {
          throw new Error("Failed to get user data");
        }

        // Проверяем существует ли пользователь в Supabase
        const { data: existingUser, error: userError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', userData.email)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          throw userError;
        }

        if (existingUser) {
          // Если пользователь существует, создаем сессию через magic link
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: userData.email,
          });

          if (signInError) throw signInError;

          toast({
            title: "Добро пожаловать!",
            description: "Проверьте вашу почту для входа",
          });
        } else {
          // Регистрируем нового пользователя
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: userData.email,
            password: Math.random().toString(36).slice(-8) + "Aa1!",
            options: {
              data: {
                full_name: `${userData.first_name} ${userData.last_name}`,
                avatar_url: userData.avatar,
              },
            },
          });

          if (signUpError) throw signUpError;

          // Сразу логиним пользователя после регистрации
          if (authData.user) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: userData.email,
              password: Math.random().toString(36).slice(-8) + "Aa1!",
            });

            if (signInError) throw signInError;
          }

          toast({
            title: "Добро пожаловать!",
            description: "Аккаунт успешно создан",
          });
        }

        navigate("/");
      } catch (error: any) {
        console.error("Good Face auth error:", error);
        toast({
          title: "Ошибка авторизации",
          description: error.message || "Произошла ошибка при авторизации",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="text-lg">Авторизация через Good Face ID...</p>
      </div>
    </div>
  );
}
