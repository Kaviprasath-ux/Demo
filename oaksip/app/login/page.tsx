"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Loader2, Lock, User, Shield, GraduationCap, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store";
import { mockUsers } from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsUser, isAuthenticated } = useAuthStore();
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
      const success = await login(username, password);
      if (success) {
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
      const success = await loginAsUser(userId);
      if (success) {
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield;
      case "instructor":
        return GraduationCap;
      case "leadership":
        return Award;
      case "trainee":
        return Users;
      default:
        return User;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const;
      case "instructor":
        return "default" as const;
      case "leadership":
        return "secondary" as const;
      case "trainee":
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
              <Target className="h-9 w-9 text-primary-foreground" />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                OAKSIP
              </h1>
              <p className="text-sm text-muted-foreground">
                Artillery AI Knowledge System
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
                            {testUser.id}
                          </p>
                        </div>
                        <Badge variant={getRoleBadgeVariant(testUser.role)}>
                          {testUser.role}
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
                School of Artillery, Deolali
                <br />
                <span className="text-primary">Offline Knowledge System</span>
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
