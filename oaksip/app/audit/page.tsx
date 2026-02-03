"use client";

import { useState } from "react";
import {
  Shield,
  Search,
  Filter,
  Download,
  LogIn,
  LogOut,
  FileText,
  MessageSquare,
  Target,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockAuditLogs } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  const actionTypes = ["all", "QUERY", "LOGIN", "LOGOUT", "DOCUMENT_VIEW", "SIMULATOR_ACCESS", "AUDIT_VIEW"];

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.query?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction =
      selectedAction === "all" || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const actionIcons: Record<string, React.ElementType> = {
    QUERY: MessageSquare,
    LOGIN: LogIn,
    LOGOUT: LogOut,
    DOCUMENT_VIEW: FileText,
    SIMULATOR_ACCESS: Target,
    AUDIT_VIEW: Eye,
  };

  const actionColors: Record<string, string> = {
    QUERY: "bg-blue-500/10 text-blue-500",
    LOGIN: "bg-green-500/10 text-green-500",
    LOGOUT: "bg-orange-500/10 text-orange-500",
    DOCUMENT_VIEW: "bg-purple-500/10 text-purple-500",
    SIMULATOR_ACCESS: "bg-cyan-500/10 text-cyan-500",
    AUDIT_VIEW: "bg-yellow-500/10 text-yellow-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Audit Logs
          </h1>
          <p className="text-muted-foreground">
            Monitor system access, user queries, and security events.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAuditLogs.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAuditLogs.filter((l) => l.action === "QUERY").length}
                </p>
                <p className="text-xs text-muted-foreground">Queries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <LogIn className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAuditLogs.filter((l) => l.action === "LOGIN").length}
                </p>
                <p className="text-xs text-muted-foreground">Logins Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Eye className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(mockAuditLogs.map((l) => l.userId)).size}
                </p>
                <p className="text-xs text-muted-foreground">Unique Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, query, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              {actionTypes.map((action) => (
                <Button
                  key={action}
                  variant={selectedAction === action ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs capitalize"
                  onClick={() => setSelectedAction(action)}
                >
                  {action === "all" ? "All" : action.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Activity Log ({filteredLogs.length} events)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-1 p-4">
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No audit logs found matching your criteria.
                  </p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const ActionIcon = actionIcons[log.action] || Shield;
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${actionColors[log.action]}`}
                      >
                        <ActionIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {log.userName}
                            </p>
                            <Badge variant="outline" className="text-[10px]">
                              {log.userId}
                            </Badge>
                          </div>
                          <Badge
                            variant="outline"
                            className={actionColors[log.action]}
                          >
                            {log.action.replace("_", " ")}
                          </Badge>
                        </div>
                        {log.query && (
                          <p className="text-sm text-muted-foreground">
                            &ldquo;{log.query}&rdquo;
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDate(log.timestamp)}</span>
                          <span>IP: {log.ip}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
