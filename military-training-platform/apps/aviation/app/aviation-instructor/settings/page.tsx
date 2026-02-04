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
  Plane,
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
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-emerald-500" />
          Settings
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {user?.name.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
              <p className="text-gray-400">{user?.rank}</p>
              <p className="text-sm text-gray-500">{user?.unit}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Display Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rank</label>
              <input
                type="text"
                defaultValue={user?.rank}
                disabled
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Unit</label>
              <input
                type="text"
                defaultValue={user?.unit}
                disabled
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Regiment</label>
              <input
                type="text"
                defaultValue={user?.regiment}
                disabled
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Flight Session Reminders</p>
              <p className="text-sm text-gray-500">Get notified before scheduled flight sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Assessment Alerts</p>
              <p className="text-sm text-gray-500">Notifications for pending pilot assessments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Joint Operation Updates</p>
              <p className="text-sm text-gray-500">Updates on joint operation planning and status</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Pilot Progress Alerts</p>
              <p className="text-sm text-gray-500">Alerts when pilots need attention or milestone reached</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Weather Alerts</p>
              <p className="text-sm text-gray-500">Notifications for weather changes affecting flights</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-500" />
            Display Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date Format</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Time Format</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
              <option value="24h">24-hour (Military)</option>
              <option value="12h">12-hour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default View</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
              <option value="dashboard">Dashboard</option>
              <option value="sessions">Flight Sessions</option>
              <option value="pilots">Pilot Trainees</option>
              <option value="joint-operations">Joint Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Units</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
              <option value="metric">Metric (km, m)</option>
              <option value="nautical">Nautical (nm, ft)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight Preferences */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Plane className="w-5 h-5 text-emerald-500" />
            Flight Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default Helicopter</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
              <option value="alh-dhruv">ALH Dhruv</option>
              <option value="rudra">Rudra (ALH WSI)</option>
              <option value="chetak">Chetak</option>
              <option value="apache">Apache AH-64E</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default Session Duration</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Auto Pre-flight Checklist</p>
              <p className="text-sm text-gray-500">Show pre-flight checklist for every session</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Security
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm" className="border-gray-700">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Session Timeout</p>
              <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
            </div>
            <select className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Login Notifications</p>
              <p className="text-sm text-gray-500">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            Settings saved
          </div>
        )}
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
