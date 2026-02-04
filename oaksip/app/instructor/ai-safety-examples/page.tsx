"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  XCircle,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  User,
  Bot,
  FileWarning,
  Siren,
  Scale,
  Info,
} from "lucide-react";
import {
  refusalExamples,
  conflictExamples,
  safetyOverrideExamples,
  safetyRules,
} from "@/lib/ai-safety";

export default function AISafetyExamplesPage() {
  return (
    <RouteGuard requiredRoles={["instructor", "admin", "leadership"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            AI Safety & Refusal Examples
          </h1>
          <p className="text-muted-foreground mt-1">
            Concrete examples showing how AI handles edge cases, conflicts, and safety overrides.
            These examples build trust by demonstrating AI knows its limits.
          </p>
        </div>

        {/* Trust Statement */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">AI Trust Principles</h3>
                <p className="text-muted-foreground">
                  The OAKSIP AI is designed with safety as the primary concern. It will:
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <strong>REFUSE</strong> to provide guidance on bypassing safety systems
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <strong>FLAG</strong> conflicting doctrine for instructor review
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <strong>HALT</strong> training simulations on safety violations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <strong>ESCALATE</strong> suspicious query patterns to instructors
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different example types */}
        <Tabs defaultValue="refusals" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="refusals" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Refusals
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Conflicts
            </TabsTrigger>
            <TabsTrigger value="overrides" className="flex items-center gap-2">
              <Siren className="h-4 w-4" />
              Overrides
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <FileWarning className="h-4 w-4" />
              Rules
            </TabsTrigger>
          </TabsList>

          {/* Refusal Examples */}
          <TabsContent value="refusals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Proper Refusal Examples</h2>
              <Badge variant="outline" className="text-red-500 border-red-500">
                {refusalExamples.length} Examples
              </Badge>
            </div>
            <p className="text-muted-foreground">
              These examples show how AI properly refuses dangerous or out-of-scope requests
              while providing helpful alternatives.
            </p>

            <div className="space-y-4">
              {refusalExamples.map((example) => (
                <Card key={example.id} className="border-red-500/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        {example.category}
                      </CardTitle>
                      <Badge variant="outline">{example.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* User Query */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="h-4 w-4" />
                        <span>Cadet Query</span>
                      </div>
                      <p className="font-medium">{example.userQuery}</p>
                    </div>

                    {/* AI Response */}
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-red-500 mb-2">
                        <Bot className="h-4 w-4" />
                        <span>AI Response (Refusal)</span>
                      </div>
                      <p className="text-sm">{example.aiResponse}</p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                      <span><strong>Reason:</strong> {example.reason}</span>
                      <span><strong>Action:</strong> {example.action}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Conflict Examples */}
          <TabsContent value="conflicts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Doctrine Conflict Handling</h2>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                {conflictExamples.length} Examples
              </Badge>
            </div>
            <p className="text-muted-foreground">
              These examples show how AI handles conflicting information from different doctrine sources,
              always flagging for instructor review rather than guessing.
            </p>

            <div className="space-y-4">
              {conflictExamples.map((example) => (
                <Card key={example.id} className="border-yellow-500/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Scale className="h-5 w-5 text-yellow-500" />
                        {example.topic}
                      </CardTitle>
                      <Badge variant="outline">{example.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Conflicting Sources */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-500/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Source 1</span>
                          <Badge variant="secondary" className="text-xs">
                            v{example.source1.version}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {example.source1.document}
                        </p>
                        <p className="text-sm font-medium">{example.source1.content}</p>
                      </div>
                      <div className="p-4 bg-purple-500/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Source 2</span>
                          <Badge variant="secondary" className="text-xs">
                            v{example.source2.version}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {example.source2.document}
                        </p>
                        <p className="text-sm font-medium">{example.source2.content}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-yellow-600 mb-2">
                        <Bot className="h-4 w-4" />
                        <span>AI Response (Conflict Detection)</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{example.aiResponse}</p>
                    </div>

                    {/* Resolution */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span><strong>Resolution:</strong> {example.resolution}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Safety Override Examples */}
          <TabsContent value="overrides" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Safety Override Actions</h2>
              <Badge variant="outline" className="text-orange-500 border-orange-500">
                {safetyOverrideExamples.length} Examples
              </Badge>
            </div>
            <p className="text-muted-foreground">
              These examples show how AI actively intervenes when safety violations are detected
              during training simulations or assessments.
            </p>

            <div className="space-y-4">
              {safetyOverrideExamples.map((example) => (
                <Card key={example.id} className="border-orange-500/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Siren className="h-5 w-5 text-orange-500" />
                        {example.scenario}
                      </CardTitle>
                      <Badge variant="outline">{example.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Violation */}
                    <div className="p-4 bg-red-500/10 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-red-500 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Detected Violation</span>
                      </div>
                      <p className="font-medium">{example.violation}</p>
                    </div>

                    {/* AI Action */}
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                        <Bot className="h-4 w-4" />
                        <span>AI Immediate Action</span>
                      </div>
                      <p className="text-sm font-medium">{example.aiAction}</p>
                    </div>

                    {/* Consequence */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span><strong>Consequence:</strong> {example.consequence}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Safety Rules */}
          <TabsContent value="rules" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Safety Rules</h2>
              <Badge variant="outline" className="text-primary border-primary">
                {safetyRules.length} Rules
              </Badge>
            </div>
            <p className="text-muted-foreground">
              These are the active safety rules configured in the system. Any query matching
              these triggers will receive the specified response.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Triggers</th>
                    <th className="text-center py-3 px-4">Severity</th>
                    <th className="text-left py-3 px-4">Escalate To</th>
                  </tr>
                </thead>
                <tbody>
                  {safetyRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-border/50">
                      <td className="py-3 px-4 font-mono text-xs">{rule.id}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{rule.category}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {rule.trigger.slice(0, 3).map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                          {rule.trigger.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{rule.trigger.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={rule.severity === "block" ? "destructive" : "secondary"}
                        >
                          {rule.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {rule.escalateTo || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rule Response Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Sample Rule Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm">{safetyRules[0].response}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  );
}
