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
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-red-500" />
          Settings
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your audit preferences and account settings
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {user?.name.charAt(0) || "A"}
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
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
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
            <Bell className="w-5 h-5 text-red-500" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Compliance Alerts</p>
              <p className="text-sm text-gray-500">Notifications for compliance status changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Finding Due Dates</p>
              <p className="text-sm text-gray-500">Reminders for upcoming finding deadlines</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Report Generation</p>
              <p className="text-sm text-gray-500">Notifications when reports are ready</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Metric Threshold Alerts</p>
              <p className="text-sm text-gray-500">Alert when metrics fall below targets</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-500" />
            Display Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date Format</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none">
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default Dashboard View</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none">
              <option value="overview">Overview</option>
              <option value="compliance">Compliance Focus</option>
              <option value="findings">Findings Focus</option>
              <option value="metrics">Metrics Focus</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Show Critical Findings First</p>
              <p className="text-sm text-gray-500">Prioritize critical and major findings in lists</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Report Preferences */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            Report Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default Report Format</label>
            <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="word">Word Document</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Include Charts in Reports</p>
              <p className="text-sm text-gray-500">Auto-generate visual charts for metrics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Include Executive Summary</p>
              <p className="text-sm text-gray-500">Auto-generate summary section in reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
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
        <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
