"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  Shield,
  Cog,
  FileText,
  Box,
  Rocket,
  Target,
  Crosshair,
  Users,
  Building,
  Globe,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Info,
  ChevronRight,
} from "lucide-react";

// Gun System Lifecycle Data
const gunSystemLifecycle = {
  legacy: [
    {
      name: "Bofors FH-77B",
      caliber: "155mm",
      inducted: 1987,
      status: "Phase-out",
      doctrineVersion: "2.1",
      digitalTwin: "Available",
      training: "Archived",
      notes: "Doctrine preserved for reference",
    },
    {
      name: "L70 AA Gun",
      caliber: "40mm",
      inducted: 1965,
      status: "Limited",
      doctrineVersion: "1.8",
      digitalTwin: "Basic",
      training: "Reference Only",
      notes: "Historical training modules",
    },
  ],
  current: [
    {
      name: "Dhanush",
      caliber: "155mm/45",
      inducted: 2019,
      status: "Active",
      doctrineVersion: "3.2",
      digitalTwin: "Full 3D",
      training: "Complete",
      notes: "Primary training focus",
    },
    {
      name: "K9 Vajra",
      caliber: "155mm/52",
      inducted: 2018,
      status: "Active",
      doctrineVersion: "3.1",
      digitalTwin: "Full 3D",
      training: "Complete",
      notes: "Self-propelled howitzer",
    },
    {
      name: "Pinaka MLRS",
      caliber: "214mm",
      inducted: 2006,
      status: "Active",
      doctrineVersion: "2.8",
      digitalTwin: "Full 3D",
      training: "Complete",
      notes: "Multi-barrel rocket system",
    },
    {
      name: "M777 ULH",
      caliber: "155mm/39",
      inducted: 2018,
      status: "Active",
      doctrineVersion: "3.0",
      digitalTwin: "Full 3D",
      training: "Complete",
      notes: "Ultra-light howitzer",
    },
  ],
  future: [
    {
      name: "ATAGS",
      caliber: "155mm/52",
      inducted: 2025,
      status: "Induction",
      doctrineVersion: "Draft",
      digitalTwin: "In Development",
      training: "Preparing",
      notes: "Advanced Towed Artillery Gun System",
    },
    {
      name: "Mounted Gun System",
      caliber: "155mm",
      inducted: 2026,
      status: "Planned",
      doctrineVersion: "Pending",
      digitalTwin: "Planned",
      training: "Planned",
      notes: "Truck-mounted variant",
    },
  ],
};

// Expansion Roadmap Data
const expansionRoadmap = [
  {
    phase: 1,
    name: "Artillery Corps",
    status: "current",
    startYear: 2024,
    systems: ["Dhanush", "K9 Vajra", "Pinaka", "M777", "ATAGS"],
    features: ["3D Digital Twin", "AI Doctrine Search", "Quiz & Assessment", "FDC Simulation"],
    progress: 75,
  },
  {
    phase: 2,
    name: "Air Defence Artillery",
    status: "next",
    startYear: 2025,
    systems: ["Akash", "MRSAM", "Barak-8", "L70 (Modernized)"],
    features: ["3D Models", "Tracking Simulation", "Engagement Scenarios", "Doctrine Integration"],
    progress: 15,
  },
  {
    phase: 3,
    name: "Armoured Corps",
    status: "planned",
    startYear: 2026,
    systems: ["T-90 Bhishma", "Arjun MBT", "BMP-2"],
    features: ["Gunnery Training", "Fire Control", "Maintenance Drills", "Tactical Scenarios"],
    progress: 0,
  },
  {
    phase: 4,
    name: "Infantry Weapons",
    status: "planned",
    startYear: 2027,
    systems: ["INSAS", "AK-203", "Sig Sauer", "Carl Gustav", "Javelin"],
    features: ["Marksmanship Training", "Small Arms Doctrine", "Safety Protocols", "Range Training"],
    progress: 0,
  },
];

// Version Governance
const versionGovernance = [
  {
    component: "Doctrine Database",
    currentVersion: "3.2.1",
    lastUpdate: "2025-01-15",
    nextUpdate: "2025-04-01",
    authority: "School of Artillery",
  },
  {
    component: "3D Digital Twin Models",
    currentVersion: "2.1.0",
    lastUpdate: "2025-01-10",
    nextUpdate: "2025-03-15",
    authority: "DRDO/OFB",
  },
  {
    component: "Training Curriculum",
    currentVersion: "4.0.0",
    lastUpdate: "2024-12-01",
    nextUpdate: "2025-06-01",
    authority: "DGMI",
  },
  {
    component: "Safety Protocols",
    currentVersion: "5.1.2",
    lastUpdate: "2025-01-20",
    nextUpdate: "As Required",
    authority: "Safety Directorate",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Active": "bg-green-500/20 text-green-500 border-green-500/30",
    "Phase-out": "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    "Limited": "bg-orange-500/20 text-orange-500 border-orange-500/30",
    "Induction": "bg-blue-500/20 text-blue-500 border-blue-500/30",
    "Planned": "bg-purple-500/20 text-purple-500 border-purple-500/30",
    "current": "bg-green-500/20 text-green-500 border-green-500/30",
    "next": "bg-blue-500/20 text-blue-500 border-blue-500/30",
    "planned": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <Badge variant="outline" className={styles[status] || ""}>
      {status}
    </Badge>
  );
}

export default function LifecyclePage() {
  return (
    <RouteGuard requiredRoles={["leadership", "admin", "instructor"]}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Map className="h-8 w-8 text-primary" />
            Gun System Lifecycle & Platform Roadmap
          </h1>
          <p className="text-muted-foreground mt-1">
            20-30 year strategic view of platform evolution and gun system coverage
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Systems</p>
                  <p className="text-3xl font-bold">{gunSystemLifecycle.current.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-3xl font-bold">{gunSystemLifecycle.future.length}</p>
                </div>
                <Rocket className="h-8 w-8 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Legacy Archive</p>
                  <p className="text-3xl font-bold">{gunSystemLifecycle.legacy.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expansion Phases</p>
                  <p className="text-3xl font-bold">{expansionRoadmap.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gun System Lifecycle Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-primary" />
              Gun System Lifecycle Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Current Systems */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Current Induction (Full Training Coverage)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">System</th>
                        <th className="text-left py-2 px-3">Caliber</th>
                        <th className="text-center py-2 px-3">Inducted</th>
                        <th className="text-center py-2 px-3">Status</th>
                        <th className="text-center py-2 px-3">Doctrine Ver.</th>
                        <th className="text-center py-2 px-3">Digital Twin</th>
                        <th className="text-center py-2 px-3">Training</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gunSystemLifecycle.current.map((system) => (
                        <tr key={system.name} className="border-b border-border/50">
                          <td className="py-3 px-3 font-medium">{system.name}</td>
                          <td className="py-3 px-3">{system.caliber}</td>
                          <td className="py-3 px-3 text-center">{system.inducted}</td>
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={system.status} />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline">v{system.doctrineVersion}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge className="bg-green-500">{system.digitalTwin}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge className="bg-green-500">{system.training}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Future Systems */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  Future Induction (In Development)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">System</th>
                        <th className="text-left py-2 px-3">Caliber</th>
                        <th className="text-center py-2 px-3">Expected</th>
                        <th className="text-center py-2 px-3">Status</th>
                        <th className="text-center py-2 px-3">Doctrine Ver.</th>
                        <th className="text-center py-2 px-3">Digital Twin</th>
                        <th className="text-center py-2 px-3">Training</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gunSystemLifecycle.future.map((system) => (
                        <tr key={system.name} className="border-b border-border/50 opacity-80">
                          <td className="py-3 px-3 font-medium">{system.name}</td>
                          <td className="py-3 px-3">{system.caliber}</td>
                          <td className="py-3 px-3 text-center">{system.inducted}</td>
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={system.status} />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline">{system.doctrineVersion}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="secondary">{system.digitalTwin}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="secondary">{system.training}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legacy Systems */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Legacy Systems (Archived)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm opacity-70">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">System</th>
                        <th className="text-left py-2 px-3">Caliber</th>
                        <th className="text-center py-2 px-3">Inducted</th>
                        <th className="text-center py-2 px-3">Status</th>
                        <th className="text-center py-2 px-3">Doctrine Ver.</th>
                        <th className="text-center py-2 px-3">Digital Twin</th>
                        <th className="text-left py-2 px-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gunSystemLifecycle.legacy.map((system) => (
                        <tr key={system.name} className="border-b border-border/50">
                          <td className="py-3 px-3 font-medium">{system.name}</td>
                          <td className="py-3 px-3">{system.caliber}</td>
                          <td className="py-3 px-3 text-center">{system.inducted}</td>
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={system.status} />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline">v{system.doctrineVersion}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="secondary">{system.digitalTwin}</Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{system.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Expansion Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Sovereign Military Training Intelligence Stack - Expansion Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Same core platform, different doctrine packs. Starting with Artillery, expanding across Indian Armed Forces.
            </p>

            <div className="space-y-6">
              {expansionRoadmap.map((phase, index) => (
                <div
                  key={phase.phase}
                  className={`relative p-6 rounded-lg border-2 ${
                    phase.status === "current"
                      ? "border-green-500/50 bg-green-500/5"
                      : phase.status === "next"
                      ? "border-blue-500/50 bg-blue-500/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  {/* Connector line */}
                  {index < expansionRoadmap.length - 1 && (
                    <div className="absolute left-1/2 -bottom-6 w-0.5 h-6 bg-border" />
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            phase.status === "current"
                              ? "bg-green-500"
                              : phase.status === "next"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {phase.phase}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{phase.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Target: {phase.startYear}
                          </p>
                        </div>
                        <StatusBadge status={phase.status} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            WEAPON SYSTEMS
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {phase.systems.map((sys) => (
                              <Badge key={sys} variant="outline">
                                {sys}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            PLATFORM FEATURES
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {phase.features.map((feat) => (
                              <Badge key={feat} variant="secondary">
                                {feat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-3xl font-bold">{phase.progress}%</p>
                      <Progress value={phase.progress} className="h-2 mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Version Governance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-primary" />
              Version Governance & Patch Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              All platform components follow strict version control. Updates are coordinated with respective authorities.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Component</th>
                    <th className="text-center py-2 px-3">Current Version</th>
                    <th className="text-center py-2 px-3">Last Update</th>
                    <th className="text-center py-2 px-3">Next Scheduled</th>
                    <th className="text-left py-2 px-3">Update Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {versionGovernance.map((item) => (
                    <tr key={item.component} className="border-b border-border/50">
                      <td className="py-3 px-3 font-medium">{item.component}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="outline">v{item.currentVersion}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center">{item.lastUpdate}</td>
                      <td className="py-3 px-3 text-center">{item.nextUpdate}</td>
                      <td className="py-3 px-3 text-muted-foreground">{item.authority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Platform Longevity Statement */}
        <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">20-30 Year Platform Survivability</h3>
                <p className="text-muted-foreground mb-4">
                  This platform is designed to evolve alongside artillery systems. Just as the Indian Army
                  maintains guns for 20-30 years, OAKSIP architecture supports:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Modular doctrine packs</strong> - New systems added without core changes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Version-controlled training</strong> - Historical doctrine preserved</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Sovereign AI</strong> - On-premises deployment, no foreign dependencies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Incremental upgrades</strong> - Platform evolves with technology</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
