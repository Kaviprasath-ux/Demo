"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Loader2,
  Lock,
  User,
  Shield,
  GraduationCap,
  Users,
  Crosshair,
  ClipboardCheck,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  Badge,
} from "@military/ui";
import { useAuthStore, mockUsers, roleConfig, type AviationRole } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showTestUsers, setShowTestUsers] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For demo, accept any credentials
      const user = mockUsers[0];
      if (user) {
        login(user);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUserLogin = async (userId: string) => {
    setLoadingUserId(userId);
    setError("");

    try {
      const user = mockUsers.find((u) => u.id === userId);
      if (user) {
        login(user);
        router.push("/dashboard");
      } else {
        setError("Failed to login as test user.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoadingUserId(null);
    }
  };

  const getRoleIcon = (role: AviationRole) => {
    switch (role) {
      case "admin":
        return Shield;
      case "aviation-instructor":
        return Plane;
      case "artillery-instructor":
        return Crosshair;
      case "cadet":
        return GraduationCap;
      case "auditor":
        return ClipboardCheck;
      default:
        return User;
    }
  };

  const getRoleBadgeVariant = (role: AviationRole) => {
    switch (role) {
      case "admin":
        return "destructive" as const;
      case "aviation-instructor":
        return "default" as const;
      case "artillery-instructor":
        return "default" as const;
      case "cadet":
        return "secondary" as const;
      case "auditor":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="dark min-h-screen bg-background">
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Login Card */}
        <Card className="relative w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-4 text-center">
            {/* Logo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Plane className="h-9 w-9 text-primary-foreground" />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                AVATS
              </h1>
              <p className="text-sm text-muted-foreground">
                Aviation AI Training System
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Test Users Section - For Demo */}
            {showTestUsers && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Quick Login (Demo)
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTestUsers(false)}
                    className="h-6 text-xs"
                  >
                    Use credentials
                  </Button>
                </div>
                <div className="grid gap-2">
                  {mockUsers.map((testUser) => {
                    const RoleIcon = getRoleIcon(testUser.role);
                    const config = roleConfig[testUser.role];
                    return (
                      <Button
                        key={testUser.id}
                        variant="outline"
                        className="h-auto justify-start py-3"
                        onClick={() => handleTestUserLogin(testUser.id)}
                        disabled={loadingUserId !== null}
                      >
                        {loadingUserId === testUser.id ? (
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        ) : (
                          <RoleIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="flex-1 text-left">
                          <p className="font-medium">{testUser.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {testUser.rank} • {testUser.unit}
                          </p>
                        </div>
                        <Badge variant={getRoleBadgeVariant(testUser.role)}>
                          {config.label}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Credential Login Form - For Production */}
            {!showTestUsers && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Login with credentials
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTestUsers(true)}
                    className="h-6 text-xs"
                  >
                    Use test users
                  </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-foreground"
                    >
                      Service Number / Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your service number"
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  SECURE ACCESS
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Army Aviation Training School
                <br />
                <span className="text-primary">Joint Fire Support Platform</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="relative mt-8 text-center text-xs text-muted-foreground">
          For authorized personnel only
          <br />
          All activities are monitored and logged
        </p>
      </div>
    </div>
  );
}
