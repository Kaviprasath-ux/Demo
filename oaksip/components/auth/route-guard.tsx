"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, type UserRole } from "@/lib/store";
import { Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// =============================================================================
// ROUTE CONFIGURATION
// Backend developer: This can be moved to a config file or fetched from API
// =============================================================================

interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const routeConfigs: RouteConfig[] = [
  // Public routes (no auth required)
  { path: "/login", allowedRoles: [] },

  // All authenticated users
  { path: "/dashboard", allowedRoles: ["admin", "instructor", "trainee"] },
  { path: "/search", allowedRoles: ["admin", "instructor", "trainee"] },
  { path: "/quiz", allowedRoles: ["admin", "instructor", "trainee"] },
  { path: "/training", allowedRoles: ["admin", "instructor", "trainee"] },
  { path: "/simulator", allowedRoles: ["admin", "instructor", "trainee"] },

  // Admin and Instructor only
  { path: "/documents", allowedRoles: ["admin", "instructor"], redirectTo: "/dashboard" },

  // Admin only
  { path: "/audit", allowedRoles: ["admin"], redirectTo: "/dashboard" },
];

function getRouteConfig(pathname: string): RouteConfig | undefined {
  return routeConfigs.find((config) => {
    if (config.path === pathname) return true;
    // Support dynamic routes (e.g., /quiz/[id])
    if (pathname.startsWith(config.path + "/")) return true;
    return false;
  });
}

// =============================================================================
// ROUTE GUARD COMPONENT
// =============================================================================

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const routeConfig = getRouteConfig(pathname);

    // Allow public routes
    if (routeConfig?.allowedRoles.length === 0) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role-based access
    if (routeConfig && user) {
      if (!routeConfig.allowedRoles.includes(user.role)) {
        router.push(routeConfig.redirectTo || "/dashboard");
      }
    }
  }, [pathname, isAuthenticated, user, router]);

  const routeConfig = getRouteConfig(pathname);

  // Show nothing while redirecting unauthenticated users
  if (!isAuthenticated && routeConfig?.allowedRoles.length !== 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show access denied for unauthorized roles
  if (
    isAuthenticated &&
    user &&
    routeConfig &&
    routeConfig.allowedRoles.length > 0 &&
    !routeConfig.allowedRoles.includes(user.role)
  ) {
    return <AccessDenied requiredRoles={routeConfig.allowedRoles} />;
  }

  return <>{children}</>;
}

// =============================================================================
// ACCESS DENIED COMPONENT
// =============================================================================

interface AccessDeniedProps {
  requiredRoles: UserRole[];
}

function AccessDenied({ requiredRoles }: AccessDeniedProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Access Denied
              </h2>
              <p className="text-sm text-muted-foreground">
                You don&apos;t have permission to access this page.
              </p>
            </div>
            <div className="w-full space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Your role:</span>{" "}
                <span className="capitalize">{user?.role}</span>
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Required:</span>{" "}
                {requiredRoles.map((r) => r).join(" or ")}
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// ROLE-BASED VISIBILITY COMPONENT
// =============================================================================

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
