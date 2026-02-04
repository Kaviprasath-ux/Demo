"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  Target,
  ClipboardList,
  Shield,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  Download,
  Plane,
} from "lucide-react";
import { Button } from "@military/ui";
import { useAI } from "@/lib/ai/use-ai";
import { helicopterSystems } from "@/lib/helicopter-systems";
import { aviationContext } from "@/lib/ai/config";
import type { JointFirePlan, AirSupportRequest, SafetyReview } from "@/lib/ai/types";

type GeneratorMode = "fire-plan" | "air-request" | "safety-review" | "questions";

export default function AIGeneratorPage() {
  const [mode, setMode] = useState<GeneratorMode>("fire-plan");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [firePlanForm, setFirePlanForm] = useState({
    operationType: "offensive",
    terrain: "plains",
    weather: "clear",
    objectives: "",
    artilleryUnits: ["Alpha Battery - Bofors FH-77B"],
    aviationAssets: ["Rudra_WSI"],
  });

  const [airRequestForm, setAirRequestForm] = useState({
    targetDescription: "",
    targetLat: "34.0580",
    targetLng: "74.7920",
    friendlyLat: "34.0560",
    friendlyLng: "74.7880",
    supportType: "CAS",
    priority: "priority",
  });

  // Results
  const [firePlan, setFirePlan] = useState<JointFirePlan | null>(null);
  const [airRequest, setAirRequest] = useState<AirSupportRequest | null>(null);
  const [safetyReview, setSafetyReview] = useState<SafetyReview | null>(null);

  const { generateJointFirePlan, generateAirSupportRequest, reviewPlanSafety, isLoading } = useAI();

  const handleGenerateFirePlan = async () => {
    try {
      const plan = await generateJointFirePlan({
        operationType: firePlanForm.operationType,
        terrain: firePlanForm.terrain,
        weather: firePlanForm.weather,
        objectives: firePlanForm.objectives,
        artilleryUnits: firePlanForm.artilleryUnits,
        aviationAssets: firePlanForm.aviationAssets,
      });
      setFirePlan(plan);
    } catch (err) {
      console.error("Failed to generate fire plan:", err);
    }
  };

  const handleGenerateAirRequest = async () => {
    try {
      const request = await generateAirSupportRequest({
        targetDescription: airRequestForm.targetDescription,
        targetLocation: {
          lat: parseFloat(airRequestForm.targetLat),
          lng: parseFloat(airRequestForm.targetLng),
        },
        friendlyLocation: {
          lat: parseFloat(airRequestForm.friendlyLat),
          lng: parseFloat(airRequestForm.friendlyLng),
        },
        supportType: airRequestForm.supportType,
        priority: airRequestForm.priority,
      });
      setAirRequest(request);
    } catch (err) {
      console.error("Failed to generate air request:", err);
    }
  };

  const handleSafetyReview = async () => {
    if (!firePlan) return;
    try {
      const review = await reviewPlanSafety(firePlan);
      setSafetyReview(review);
    } catch (err) {
      console.error("Failed to review safety:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modes = [
    { id: "fire-plan", label: "Joint Fire Plan", icon: Target, description: "Generate coordinated artillery-aviation fire plans" },
    { id: "air-request", label: "Air Support Request", icon: Plane, description: "Create standardized air support request formats" },
    { id: "safety-review", label: "Safety Review", icon: Shield, description: "Review plans for safety and ROE compliance" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Mission Generator</h1>
            <p className="text-sm text-muted-foreground">
              Generate joint fire plans, air requests, and safety reviews using AI agents
            </p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as GeneratorMode)}
              className={`p-4 rounded-xl border text-left transition-all ${
                mode === m.id
                  ? "bg-primary/10 border-primary"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <m.icon className={`w-5 h-5 ${mode === m.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">{m.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              {mode === "fire-plan" && "Fire Plan Parameters"}
              {mode === "air-request" && "Air Support Request Details"}
              {mode === "safety-review" && "Select Plan to Review"}
            </h2>

            {mode === "fire-plan" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Operation Type</label>
                    <select
                      value={firePlanForm.operationType}
                      onChange={(e) => setFirePlanForm({ ...firePlanForm, operationType: e.target.value })}
                      className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                    >
                      <option value="offensive">Offensive</option>
                      <option value="defensive">Defensive</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Terrain</label>
                    <select
                      value={firePlanForm.terrain}
                      onChange={(e) => setFirePlanForm({ ...firePlanForm, terrain: e.target.value })}
                      className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                    >
                      {aviationContext.terrainTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Weather</label>
                  <select
                    value={firePlanForm.weather}
                    onChange={(e) => setFirePlanForm({ ...firePlanForm, weather: e.target.value })}
                    className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                  >
                    {aviationContext.weatherConditions.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Aviation Assets</label>
                  <select
                    value={firePlanForm.aviationAssets[0]}
                    onChange={(e) => setFirePlanForm({ ...firePlanForm, aviationAssets: [e.target.value] })}
                    className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                  >
                    {helicopterSystems.filter(h => h.category === "attack").map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Mission Objectives</label>
                  <textarea
                    value={firePlanForm.objectives}
                    onChange={(e) => setFirePlanForm({ ...firePlanForm, objectives: e.target.value })}
                    placeholder="Describe the mission objectives..."
                    className="w-full mt-1 bg-muted border border-border rounded-lg p-3 text-sm min-h-[100px]"
                  />
                </div>

                <Button onClick={handleGenerateFirePlan} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Joint Fire Plan
                    </>
                  )}
                </Button>
              </div>
            )}

            {mode === "air-request" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Target Description</label>
                  <textarea
                    value={airRequestForm.targetDescription}
                    onChange={(e) => setAirRequestForm({ ...airRequestForm, targetDescription: e.target.value })}
                    placeholder="Describe the target..."
                    className="w-full mt-1 bg-muted border border-border rounded-lg p-3 text-sm min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Target Lat</label>
                    <input
                      type="text"
                      value={airRequestForm.targetLat}
                      onChange={(e) => setAirRequestForm({ ...airRequestForm, targetLat: e.target.value })}
                      className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Target Lng</label>
                    <input
                      type="text"
                      value={airRequestForm.targetLng}
                      onChange={(e) => setAirRequestForm({ ...airRequestForm, targetLng: e.target.value })}
                      className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Support Type</label>
                    <select
                      value={airRequestForm.supportType}
                      onChange={(e) => setAirRequestForm({ ...airRequestForm, supportType: e.target.value })}
                      className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                    >
                      <option value="CAS">CAS</option>
                      <option value="ISR">ISR</option>
                      <option value="CASEVAC">CASEVAC</option>
                      <option value="escort">Escort</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Priority</label>
                    <select
                      value={airRequestForm.priority}
                      onChange={(e) => setAirRequestForm({ ...airRequestForm, priority: e.target.value })}
                      className="w-full mt-1 bg-muted border border-border rounded-lg p-2 text-sm"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="priority">Priority</option>
                      <option value="routine">Routine</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleGenerateAirRequest} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Request...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Air Support Request
                    </>
                  )}
                </Button>
              </div>
            )}

            {mode === "safety-review" && (
              <div className="space-y-4">
                {firePlan ? (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">{firePlan.missionName}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {firePlan.operationType} operation in {firePlan.terrain} terrain
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Generated: {new Date(firePlan.generatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Button onClick={handleSafetyReview} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Reviewing Safety...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Run Safety Review
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Generate a Joint Fire Plan first to review its safety.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Output Display */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Generated Output</h2>
              {(firePlan || airRequest || safetyReview) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const content = JSON.stringify(
                      mode === "fire-plan" ? firePlan :
                      mode === "air-request" ? airRequest :
                      safetyReview,
                      null,
                      2
                    );
                    copyToClipboard(content, "output");
                  }}
                >
                  {copiedId === "output" ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy JSON
                    </>
                  )}
                </Button>
              )}
            </div>

            {mode === "fire-plan" && firePlan && (
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold text-primary">{firePlan.missionName}</h3>
                  <p className="text-muted-foreground">ID: {firePlan.id}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Timings</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted rounded">H-Hour: {firePlan.timings.hHour}</div>
                    <div className="p-2 bg-muted rounded">Arty Start: {firePlan.timings.artilleryStart}</div>
                    <div className="p-2 bg-muted rounded">Avn On-Station: {firePlan.timings.aviationOnStation}</div>
                    <div className="p-2 bg-muted rounded">Avn Off-Station: {firePlan.timings.aviationOffStation}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Communications</h4>
                  <div className="text-xs space-y-1">
                    <p>Primary: {firePlan.communications.primaryFreq}</p>
                    <p>Alternate: {firePlan.communications.alternateFreq}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Safety Notes</h4>
                  <ul className="text-xs space-y-1">
                    {firePlan.safetyNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Shield className="w-3 h-3 text-amber-500 mt-0.5" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Citations</h4>
                  <div className="flex flex-wrap gap-1">
                    {firePlan.citations.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "air-request" && airRequest && (
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">Air Support Request</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      airRequest.priority === "urgent" ? "bg-red-500/20 text-red-500" :
                      airRequest.priority === "priority" ? "bg-amber-500/20 text-amber-500" :
                      "bg-emerald-500/20 text-emerald-500"
                    }`}>
                      {airRequest.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">ID: {airRequest.id}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Target</h4>
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-medium">{airRequest.target.description}</p>
                    <p className="text-muted-foreground mt-1">
                      Grid: {airRequest.target.gridReference}
                    </p>
                    <p className="text-muted-foreground">
                      Type: {airRequest.target.targetType}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Control</h4>
                  <p className="text-xs">Type: {airRequest.terminalControl}</p>
                  <p className="text-xs">Controller: {airRequest.controllerCallsign}</p>
                </div>
              </div>
            )}

            {mode === "safety-review" && safetyReview && (
              <div className="space-y-4 text-sm">
                <div className={`p-3 rounded-lg ${
                  safetyReview.overallSafe ? "bg-green-500/10" : "bg-red-500/10"
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${safetyReview.overallSafe ? "text-green-500" : "text-red-500"}`}>
                      {safetyReview.overallSafe ? "Plan is Safe" : "Safety Concerns Detected"}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      safetyReview.riskLevel === "low" ? "bg-green-500/20 text-green-500" :
                      safetyReview.riskLevel === "medium" ? "bg-amber-500/20 text-amber-500" :
                      "bg-red-500/20 text-red-500"
                    }`}>
                      {safetyReview.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommendation: {safetyReview.overallRecommendation.replace(/_/g, " ")}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Safety Checks</h4>
                  <div className="space-y-2">
                    {safetyReview.checks.map((check, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        {check.status === "pass" ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : check.status === "warning" ? (
                          <Shield className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Shield className="w-4 h-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{check.item}</p>
                          <p className="text-muted-foreground">{check.details}</p>
                          {check.mitigation && (
                            <p className="text-primary">Mitigation: {check.mitigation}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {safetyReview.requiredChanges && safetyReview.requiredChanges.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-amber-500">Required Changes</h4>
                    <ul className="text-xs space-y-1">
                      {safetyReview.requiredChanges.map((change, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!firePlan && !airRequest && !safetyReview && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Generated content will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
