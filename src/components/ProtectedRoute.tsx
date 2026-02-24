import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: "admin" | "staff" | "client";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(requiredRole === "client" ? "/client-login" : "/login", { replace: true });
      return;
    }

    const checkRole = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-role", {
          body: { expected_role: requiredRole },
        });

        if (error || !data?.authorized) {
          setAuthorized(false);
          navigate("/unauthorized", { replace: true });
        } else {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
        navigate("/unauthorized", { replace: true });
      }
    };

    checkRole();
  }, [user, loading, requiredRole, navigate]);

  if (loading || authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
