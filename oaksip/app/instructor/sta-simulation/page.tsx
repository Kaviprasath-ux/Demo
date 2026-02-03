"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { STASimulationPanel } from "@/components/training/sta-simulation-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radar,
  Map,
  AlertTriangle,
  Target,
  Radio,
  Settings,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

export default function STASimulationPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network refresh
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <RouteGuard>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Radar className="h-6 w-6" />
              STA/ISR Simulation
            </h1>
            <p className="text-muted-foreground">
              Surveillance & Target Acquisition Network Training
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-500 border-green-500">
              NETWORK ACTIVE
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* STA Network Panel - Main */}
          <div className="lg:col-span-2">
            <STASimulationPanel />
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Tactical Map Placeholder */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Tactical Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-green-900/20 to-green-950/40 rounded-lg flex items-center justify-center border border-green-500/20">
                  <div className="text-center text-muted-foreground">
                    <Map className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tactical Display</p>
                    <p className="text-xs">Grid Zone: 43Q</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>High Priority</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Low</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Network Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Sensor Coverage</span>
                  <span className="font-medium text-green-500">87%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Data Link Quality</span>
                  <span className="font-medium text-green-500">Excellent</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Target Track Files</span>
                  <span className="font-medium">6 Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Fire Missions</span>
                  <span className="font-medium text-orange-500">1 Pending</span>
                </div>
              </CardContent>
            </Card>

            {/* Communications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-muted/30 rounded border-l-2 border-green-500">
                    <p className="font-medium">Alpha 1-1 → FDC</p>
                    <p className="text-muted-foreground">Target acquired, grid 5678 9012</p>
                    <p className="text-[10px] text-muted-foreground mt-1">2 min ago</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded border-l-2 border-blue-500">
                    <p className="font-medium">Eagle Eye 1 → FDC</p>
                    <p className="text-muted-foreground">Convoy spotted moving north</p>
                    <p className="text-[10px] text-muted-foreground mt-1">5 min ago</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded border-l-2 border-purple-500">
                    <p className="font-medium">CBR → FDC</p>
                    <p className="text-muted-foreground">Counter-battery track initiated</p>
                    <p className="text-[10px] text-muted-foreground mt-1">8 min ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-yellow-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-500">
                  <AlertTriangle className="h-4 w-4" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-yellow-500/10 rounded">
                    <p className="font-medium">UAV Shadow 2 - Low Battery</p>
                    <p className="text-muted-foreground">45% remaining, RTB recommended</p>
                  </div>
                  <div className="p-2 bg-orange-500/10 rounded">
                    <p className="font-medium">FO Bravo 2-1 - Laser Degraded</p>
                    <p className="text-muted-foreground">Laser designator performance reduced</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Training Objectives */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training Objectives - STA Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-1">Target Detection</h4>
                <p className="text-xs text-muted-foreground">
                  Identify and classify targets using multi-sensor data fusion
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-1">Fire Mission Coordination</h4>
                <p className="text-xs text-muted-foreground">
                  Process fire requests from FOs and UAV operators
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-1">Sensor Management</h4>
                <p className="text-xs text-muted-foreground">
                  Monitor sensor health and optimize coverage patterns
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-1">Battle Tracking</h4>
                <p className="text-xs text-muted-foreground">
                  Maintain accurate Common Operating Picture (COP)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
