"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { VersionHistoryPanel } from "@/components/content/version-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, FileText, GitBranch, Shield, AlertTriangle, Check } from "lucide-react";
import { mockVersionedContent } from "@/lib/content-versioning";

export default function ContentVersioningPage() {
  // Calculate stats from mock data
  const totalDocuments = mockVersionedContent.length;
  const totalVersions = mockVersionedContent.reduce(
    (sum, item) => sum + item.versions.length + 1,
    0
  );
  const pendingReview = mockVersionedContent.filter(
    (item) => item.currentVersion.status === "pending_review"
  ).length;
  const lockedDocuments = mockVersionedContent.filter((item) => item.isLocked).length;

  return (
    <RouteGuard>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="h-6 w-6" />
            Content Version Control
          </h1>
          <p className="text-muted-foreground">
            Manage document versions, review changes, and track content history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalDocuments}</p>
                  <p className="text-xs text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <History className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalVersions}</p>
                  <p className="text-xs text-muted-foreground">Total Versions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingReview}</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Shield className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lockedDocuments}</p>
                  <p className="text-xs text-muted-foreground">Locked Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VersionHistoryPanel />
          </div>

          <div className="space-y-4">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockVersionedContent
                    .sort((a, b) => b.currentVersion.createdAt - a.currentVersion.createdAt)
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="flex items-start gap-2 text-xs">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium truncate">{item.currentVersion.title}</p>
                          <p className="text-muted-foreground">
                            {item.currentVersion.changeDescription}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            by {item.currentVersion.createdBy} •{" "}
                            {new Date(item.currentVersion.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Levels */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">By Security Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Badge className="bg-gray-500">UNCLASSIFIED</Badge>
                    </span>
                    <span className="font-medium">
                      {mockVersionedContent.filter(
                        (c) => c.currentVersion.metadata.securityLevel === "unclassified"
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Badge className="bg-yellow-500">RESTRICTED</Badge>
                    </span>
                    <span className="font-medium">
                      {mockVersionedContent.filter(
                        (c) => c.currentVersion.metadata.securityLevel === "restricted"
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Badge className="bg-orange-500">CONFIDENTIAL</Badge>
                    </span>
                    <span className="font-medium">
                      {mockVersionedContent.filter(
                        (c) => c.currentVersion.metadata.securityLevel === "confidential"
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Badge className="bg-red-500">SECRET</Badge>
                    </span>
                    <span className="font-medium">
                      {mockVersionedContent.filter(
                        (c) => c.currentVersion.metadata.securityLevel === "secret"
                      ).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Control Guidelines */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Version Control Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    • <strong>Major versions (X.0):</strong> Significant content changes or structural revisions
                  </p>
                  <p>
                    • <strong>Minor versions (X.Y):</strong> Small updates, corrections, or clarifications
                  </p>
                  <p>
                    • <strong>Review required:</strong> All changes must be reviewed before publishing
                  </p>
                  <p>
                    • <strong>Document locking:</strong> Lock documents while editing to prevent conflicts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
