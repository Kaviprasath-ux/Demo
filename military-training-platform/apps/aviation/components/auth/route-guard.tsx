"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, type AviationRole } from "@/lib/store";
import { Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent, Button } from "@military/ui";

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

interface RouteConfig {
  path: string;
  allowedRoles: AviationRole[];
  redirectTo?: string;
}

// Route configuration for Aviation Training Platform
const routeConfigs: RouteConfig[] = [
  // Public routes (no auth required)
  { path: "/login", allowedRoles: [] },

  // All authenticated users - Dashboard & Profile
  { path: "/dashboard", allowedRoles: ["admin", "aviation-instructor", "artillery-instructor", "cadet", "auditor"] },
  { path: "/profile", allowedRoles: ["admin", "aviation-instructor", "artillery-instructor", "cadet", "auditor"] },

  // Training & Simulator - Instructors and Cadets
  { path: "/training", allowedRoles: ["aviation-instructor", "artillery-instructor", "cadet"], redirectTo: "/dashboard" },
  { path: "/search", allowedRoles: ["aviation-instructor", "artillery-instructor", "cadet"], redirectTo: "/dashboard" },

  // Documents - All authenticated users
  { path: "/documents", allowedRoles: ["admin", "aviation-instructor", "artillery-instructor", "cadet", "auditor"], redirectTo: "/dashboard" },

  // Admin-only routes
  { path: "/admin/users", allowedRoles: ["admin"], redirectTo: "/dashboard" },
  { path: "/admin/helicopter-systems", allowedRoles: ["admin"], redirectTo: "/dashboard" },
  { path: "/admin/roe-management", allowedRoles: ["admin"], redirectTo: "/dashboard" },
  { path: "/admin/nfz-management", allowedRoles: ["admin"], redirectTo: "/dashboard" },
  { path: "/admin/document-ingestion", allowedRoles: ["admin"], redirectTo: "/dashboard" },
  { path: "/admin/dataset-factory", allowedRoles: ["admin"], redirectTo: "/dashboard" },
  { path: "/admin/content", allowedRoles: ["admin"], redirectTo: "/dashboard" },
  { path: "/admin/audit-logs", allowedRoles: ["admin", "auditor"], redirectTo: "/dashboard" },
  { path: "/admin/configuration", allowedRoles: ["admin"], redirectTo: "/dashboard" },

  // Instructor routes
  { path: "/instructor", allowedRoles: ["aviation-instructor", "artillery-instructor"], redirectTo: "/dashboard" },
  { path: "/aviation-instructor", allowedRoles: ["aviation-instructor", "admin"], redirectTo: "/dashboard" },
  { path: "/artillery-instructor", allowedRoles: ["artillery-instructor", "admin"], redirectTo: "/dashboard" },

  // Cadet routes
  { path: "/cadet", allowedRoles: ["cadet"], redirectTo: "/dashboard" },

  // Auditor routes
  { path: "/auditor", allowedRoles: ["auditor"], redirectTo: "/dashboard" },
];

function getRouteConfig(pathname: string): RouteConfig | undefined {
  return routeConfigs.find((config) => {
    if (config.path === pathname) return true;
    if (pathname.startsWith(config.path + "/")) return true;
    return false;
  });
}

// =============================================================================
// ROUTE GUARD COMPONENT
// =============================================================================

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: AviationRole[];
}

export function RouteGuard({ children, requiredRoles }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const routeConfig = getRouteConfig(pathname);
  const allowedRoles = requiredRoles || routeConfig?.allowedRoles || [];

  useEffect(() => {
    // Allow public routes
    if (allowedRoles.length === 0) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role-based access
    if (user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        router.push(routeConfig?.redirectTo || "/dashboard");
      }
    }
  }, [pathname, isAuthenticated, user, router, allowedRoles, routeConfig?.redirectTo]);

  // Show nothing while redirecting unauthenticated users
  if (!isAuthenticated && allowedRoles.length !== 0) {
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
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <AccessDenied requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
}

// =============================================================================
// ACCESS DENIED COMPONENT
// =============================================================================

interface AccessDeniedProps {
  requiredRoles: AviationRole[];
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
                <span className="capitalize">{user?.role.replace("-", " ")}</span>
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Required:</span>{" "}
                {requiredRoles.map((r) => r.replace("-", " ")).join(" or ")}
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
  allowedRoles: AviationRole[];
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
