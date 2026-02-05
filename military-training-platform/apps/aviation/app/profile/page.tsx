"use client";

import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Building2,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback } from "@military/ui";
import { useAuthStore, roleConfig, type AviationRole } from "@/lib/store";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const role = user ? roleConfig[user.role as AviationRole] : null;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.rank}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">{role?.label}</Badge>
                <Badge variant="outline">{user.id}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Rank</p>
                  <p className="text-sm font-medium">{user.rank}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Unit</p>
                  <p className="text-sm font-medium">{user.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Regiment</p>
                  <p className="text-sm font-medium">{user.regiment}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium">{role?.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Role Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{role?.description}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Service ID</p>
                <p className="text-sm font-mono">{user.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Platform Access</p>
                <p className="text-sm">AVATS - Joint Fire Support Platform</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Clearance Level</p>
                <Badge variant="outline">Restricted</Badge>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="text-sm font-medium">Offline / Sovereign</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI Engine</p>
                  <p className="text-sm font-medium">Local LLM (Ollama)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <p className="text-sm font-medium">AVATS v1.0</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="default" className="mt-0.5">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
