"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Settings,
  User,
  Bell,
  Eye,
  FileText,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-red-500" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your audit preferences and account settings
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-foreground">
              {user?.name.charAt(0) || "A"}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.rank}</p>
              <p className="text-sm text-muted-foreground">{user?.unit}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Display Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Rank</label>
              <input
                type="text"
                defaultValue={user?.rank}
                disabled
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Unit</label>
              <input
                type="text"
                defaultValue={user?.unit}
                disabled
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Regiment</label>
              <input
                type="text"
                defaultValue={user?.regiment}
                disabled
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Compliance Alerts</p>
              <p className="text-sm text-muted-foreground">Notifications for compliance status changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Finding Due Dates</p>
              <p className="text-sm text-muted-foreground">Reminders for upcoming finding deadlines</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Report Generation</p>
              <p className="text-sm text-muted-foreground">Notifications when reports are ready</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Metric Threshold Alerts</p>
              <p className="text-sm text-muted-foreground">Alert when metrics fall below targets</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-500" />
            Display Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Date Format</label>
            <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-red-500 focus:outline-none">
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Default Dashboard View</label>
            <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-red-500 focus:outline-none">
              <option value="overview">Overview</option>
              <option value="compliance">Compliance Focus</option>
              <option value="findings">Findings Focus</option>
              <option value="metrics">Metrics Focus</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Show Critical Findings First</p>
              <p className="text-sm text-muted-foreground">Prioritize critical and major findings in lists</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Report Preferences */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            Report Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Default Report Format</label>
            <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-red-500 focus:outline-none">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="word">Word Document</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Include Charts in Reports</p>
              <p className="text-sm text-muted-foreground">Auto-generate visual charts for metrics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Include Executive Summary</p>
              <p className="text-sm text-muted-foreground">Auto-generate summary section in reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-5 h-5" />
            Settings saved
          </div>
        )}
        <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
