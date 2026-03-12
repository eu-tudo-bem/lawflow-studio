import { useEffect, useRef, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: "admin" | "staff" | "client";
}

// Module-level cache: maps "userId:role" → authorized boolean
// Cleared automatically when the user logs out (user becomes null).
const roleCache = new Map<string, boolean>();

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  // Track the user+role pair currently being verified to avoid duplicate calls
  const verifyingRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Clear cache on logout
      roleCache.clear();
      navigate(requiredRole === "client" ? "/client-login" : "/login", { replace: true });
      return;
    }

    const cacheKey = `${user.id}:${requiredRole}`;

    // Return cached result immediately — no flash, no extra network call
    if (roleCache.has(cacheKey)) {
      const cached = roleCache.get(cacheKey)!;
      setAuthorized(cached);
      if (!cached) navigate("/unauthorized", { replace: true });
      return;
    }

    // Prevent duplicate in-flight calls for the same key
    if (verifyingRef.current === cacheKey) return;
    verifyingRef.current = cacheKey;

    const checkRole = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-role", {
          body: { expected_role: requiredRole },
        });

        const isAuthorized = !error && !!data?.authorized;
        roleCache.set(cacheKey, isAuthorized);
        setAuthorized(isAuthorized);

        if (!isAuthorized) {
          navigate("/unauthorized", { replace: true });
        }
      } catch {
        roleCache.set(cacheKey, false);
        setAuthorized(false);
        navigate("/unauthorized", { replace: true });
      } finally {
        verifyingRef.current = null;
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
