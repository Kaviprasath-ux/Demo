"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { PaperGenerator } from "@/components/assessment/paper-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Lock, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { mockPaperTemplates } from "@/lib/secure-paper-generation";

export default function PaperGenerationPage() {
  // Calculate stats
  const totalTemplates = mockPaperTemplates.length;
  const approvedTemplates = mockPaperTemplates.filter((t) => t.approvedBy).length;
  const highSecurityTemplates = mockPaperTemplates.filter(
    (t) => t.securityLevel === "high" || t.securityLevel === "maximum"
  ).length;

  return (
    <RouteGuard>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Secure Paper Generation
          </h1>
          <p className="text-muted-foreground">
            Generate randomized assessment papers with secure variants and answer keys
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
                  <p className="text-2xl font-bold">{totalTemplates}</p>
                  <p className="text-xs text-muted-foreground">Paper Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedTemplates}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Lock className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{highSecurityTemplates}</p>
                  <p className="text-xs text-muted-foreground">High Security</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <PaperGenerator />
          </div>

          <div className="space-y-4">
            {/* Security Notice */}
            <Card className="border-yellow-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  Security Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• Generated papers are encrypted with unique codes</p>
                  <p>• Answer keys are stored separately with restricted access</p>
                  <p>• All generation activities are logged for audit</p>
                  <p>• Papers should be printed only on authorized systems</p>
                  <p>• Distribution must follow established protocols</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button className="w-full p-2 text-left text-sm bg-muted/50 rounded hover:bg-muted transition-colors">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Create New Template
                    </span>
                  </button>
                  <button className="w-full p-2 text-left text-sm bg-muted/50 rounded hover:bg-muted transition-colors">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Schedule Generation
                    </span>
                  </button>
                  <button className="w-full p-2 text-left text-sm bg-muted/50 rounded hover:bg-muted transition-colors">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      View Audit Log
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Generations */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">YO Mid-Course</span>
                      <Badge variant="outline" className="text-[10px]">4 variants</Badge>
                    </div>
                    <p className="text-muted-foreground">2 hours ago • Lt. Col. Verma</p>
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">JCO Final Exam</span>
                      <Badge variant="outline" className="text-[10px]">6 variants</Badge>
                    </div>
                    <p className="text-muted-foreground">Yesterday • Maj. Kumar</p>
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Diagnostic Test</span>
                      <Badge variant="outline" className="text-[10px]">2 variants</Badge>
                    </div>
                    <p className="text-muted-foreground">3 days ago • Capt. Singh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
