"use client";

import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Bell,
  Shield,
  GraduationCap,
  Users,
  Plane,
  Crosshair,
  ClipboardCheck,
} from "lucide-react";
import {
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@military/ui";
import { useAuthStore, useUIStore, type AviationRole } from "@/lib/store";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const roleConfig: Record<AviationRole, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Shield }> = {
    admin: { label: "Admin", variant: "destructive", icon: Shield },
    "aviation-instructor": { label: "Aviation Instructor", variant: "default", icon: Plane },
    "artillery-instructor": { label: "Artillery Instructor", variant: "default", icon: Crosshair },
    cadet: { label: "Cadet", variant: "secondary", icon: GraduationCap },
    auditor: { label: "Auditor", variant: "outline", icon: ClipboardCheck },
  };

  const currentRole = user ? roleConfig[user.role as AviationRole] : null;
  const RoleIcon = currentRole?.icon || User;

  return (
    <header
      className={cn(
        "fixed top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-6 backdrop-blur-sm transition-all duration-300",
        sidebarOpen ? "left-64" : "left-16",
        "right-0"
      )}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Aviation AI Training System
        </h2>
        <Badge variant="outline" className="hidden sm:inline-flex">
          OFFLINE MODE
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Badge - More prominent */}
        {user && currentRole && (
          <Badge variant={currentRole.variant} className="hidden md:inline-flex gap-1.5">
            <RoleIcon className="h-3 w-3" />
            {currentRole.label}
          </Badge>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.unit}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.rank}</p>
                  <Badge variant={currentRole?.variant} className="w-fit mt-1">
                    {currentRole?.label}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
