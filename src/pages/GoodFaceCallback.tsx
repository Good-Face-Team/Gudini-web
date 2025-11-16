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
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

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
              redirect_uri: window.location.origin + "/#/goodface-callback",
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

        // Create or login user in Supabase
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userData.email)
          .single();

        if (!existingUser) {
          // Sign up new user
          const { error: signUpError } = await supabase.auth.signUp({
            email: userData.email,
            password: Math.random().toString(36).slice(-8) + "Aa1!", // Random password
            options: {
              data: {
                full_name: `${userData.first_name} ${userData.last_name}`,
              },
            },
          });

          if (signUpError) throw signUpError;
        }

        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: Math.random().toString(36).slice(-8) + "Aa1!",
        });

        if (signInError) {
          // If password doesn't match, update it
          const { error: updateError } = await supabase.auth.updateUser({
            password: Math.random().toString(36).slice(-8) + "Aa1!",
          });
          if (updateError) throw updateError;
        }

        toast({
          title: "Добро пожаловать!",
          description: "Вы успешно вошли через Good Face ID",
        });
        navigate("/");
      } catch (error: any) {
        console.error("Good Face auth error:", error);
        toast({
          title: "Ошибка авторизации",
          description: error.message,
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
