import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Lock } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-terminal-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Lock className="w-16 h-16 text-terminal-gray mb-8" />
          <div className="h-2 w-64 bg-terminal-gray/20 rounded mb-8">
            <div className="h-full w-3/4 bg-terminal-green rounded animate-pulse" />
          </div>
        </div>
        
        <div className="terminal-window">
          <SupabaseAuth 
            supabaseClient={supabase}
            view={showSignUp ? "sign_up" : "sign_in"}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4AF626',
                    brandAccent: '#3AD617',
                    inputBackground: 'transparent',
                    inputText: '#4AF626',
                    inputBorder: '#4AF626',
                    inputBorderFocus: '#4AF626',
                    inputBorderHover: '#3AD617',
                    defaultButtonBackground: '#4AF626',
                    defaultButtonBackgroundHover: '#3AD617',
                    defaultButtonBorder: '#4AF626',
                    defaultButtonText: '#1A1F2C',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                label: 'sr-only',
                button: 'retro-button w-full',
                input: 'retro-input',
                anchor: 'text-terminal-green hover:text-terminal-green/80 transition-colors',
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: '',
                  password_label: '',
                  email_input_placeholder: 'Enter email',
                  password_input_placeholder: 'Enter password',
                  button_label: 'ACCESS SYSTEM',
                },
                sign_up: {
                  email_label: '',
                  password_label: '',
                  email_input_placeholder: 'Enter email',
                  password_input_placeholder: 'Create password',
                  button_label: 'CREATE ACCESS',
                }
              }
            }}
          />
        </div>

        <button 
          onClick={() => setShowSignUp(!showSignUp)}
          className="w-full text-center text-terminal-gray text-sm hover:text-terminal-green transition-colors duration-200 mt-4"
        >
          {showSignUp ? '> Return to login' : '> Request system access'}
        </button>
      </div>
    </div>
  );
};

export default Auth;