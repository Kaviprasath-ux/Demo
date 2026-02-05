"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Settings,
  User,
  Bell,
  Shield,
  Eye,
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
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold text-foreground">
              {user?.name.charAt(0) || "U"}
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
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
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
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Session Reminders</p>
              <p className="text-sm text-muted-foreground">Get notified before scheduled training sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Assessment Alerts</p>
              <p className="text-sm text-muted-foreground">Notifications for pending assessments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Joint Exercise Updates</p>
              <p className="text-sm text-muted-foreground">Updates on joint exercise planning and status</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Trainee Progress Alerts</p>
              <p className="text-sm text-muted-foreground">Alerts when trainees need attention</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Display Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Date Format</label>
            <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none">
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Time Format</label>
            <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none">
              <option value="24h">24-hour</option>
              <option value="12h">12-hour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Default View</label>
            <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none">
              <option value="dashboard">Dashboard</option>
              <option value="sessions">Training Sessions</option>
              <option value="trainees">FOO Trainees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm" className="border-border">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
            </div>
            <select className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
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
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
