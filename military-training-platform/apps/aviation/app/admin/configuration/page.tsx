"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Settings,
  Shield,
  Bell,
  Server,
  Save,
  CheckCircle2,
  Lock,
  Clock,
  Percent,
  Mail,
  Database,
  Globe,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useAdminStore, SystemConfig } from "@/lib/stores/admin-store";

export default function ConfigurationPage() {
  const { configs, updateConfig } = useAdminStore();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleValueChange = (id: string, value: string) => {
    setEditedValues({ ...editedValues, [id]: value });
  };

  const handleSave = (id: string) => {
    const newValue = editedValues[id];
    if (newValue !== undefined) {
      updateConfig(id, newValue);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSaveAll = () => {
    Object.entries(editedValues).forEach(([id, value]) => {
      updateConfig(id, value);
    });
    setEditedValues({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getValue = (config: SystemConfig) => {
    return editedValues[config.id] !== undefined
      ? editedValues[config.id]
      : config.value;
  };

  const isModified = (config: SystemConfig) => {
    return editedValues[config.id] !== undefined && editedValues[config.id] !== config.value;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return <Shield className="w-5 h-5 text-red-400" />;
      case "training":
        return <Percent className="w-5 h-5 text-green-400" />;
      case "notifications":
        return <Bell className="w-5 h-5 text-emerald-400" />;
      case "integration":
        return <Globe className="w-5 h-5 text-emerald-400" />;
      default:
        return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "security":
        return "border-red-500/30 bg-red-500/5";
      case "training":
        return "border-green-500/30 bg-green-500/5";
      case "notifications":
        return "border-emerald-500/30 bg-emerald-500/5";
      case "integration":
        return "border-emerald-500/30 bg-emerald-500/5";
      default:
        return "border-gray-500/30 bg-gray-500/5";
    }
  };

  const getConfigIcon = (key: string) => {
    switch (key) {
      case "session_timeout":
        return <Clock className="w-4 h-4" />;
      case "max_login_attempts":
        return <Lock className="w-4 h-4" />;
      case "assessment_passing_score":
        return <Percent className="w-4 h-4" />;
      case "notification_email":
        return <Mail className="w-4 h-4" />;
      case "system_name":
        return <Server className="w-4 h-4" />;
      case "backup_frequency":
        return <Database className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, SystemConfig[]>);

  const categoryLabels: Record<string, string> = {
    general: "General Settings",
    security: "Security Settings",
    training: "Training Settings",
    notifications: "Notification Settings",
    integration: "Integration Settings",
  };

  const hasChanges = Object.keys(editedValues).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-500" />
            System Configuration
          </h1>
          <p className="text-gray-400 mt-1">
            Manage system settings and parameters
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              Saved
            </div>
          )}
          {hasChanges && (
            <Button
              onClick={handleSaveAll}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          )}
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-400 font-medium">Configuration Warning</p>
          <p className="text-sm text-gray-400">
            Changing these settings may affect system behavior. Please review changes
            carefully before saving.
          </p>
        </div>
      </div>

      {/* Configuration Sections */}
      {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
        <div
          key={category}
          className={`bg-[#12121a] border rounded-xl ${getCategoryColor(category)}`}
        >
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            {getCategoryIcon(category)}
            <h2 className="font-semibold text-white">
              {categoryLabels[category] || category}
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {categoryConfigs.map((config) => (
              <div
                key={config.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isModified(config)
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-[#0a0a0f] border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-gray-500">
                      {getConfigIcon(config.key)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{config.key}</p>
                        {isModified(config) && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                            Modified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {config.description}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Last modified: {config.lastModified} by {config.modifiedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {config.key === "notification_email" ? (
                      <select
                        value={getValue(config)}
                        onChange={(e) => handleValueChange(config.id, e.target.value)}
                        className="px-3 py-2 bg-[#12121a] border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none min-w-[120px]"
                      >
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    ) : config.key === "backup_frequency" ? (
                      <select
                        value={getValue(config)}
                        onChange={(e) => handleValueChange(config.id, e.target.value)}
                        className="px-3 py-2 bg-[#12121a] border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none min-w-[120px]"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={getValue(config)}
                        onChange={(e) => handleValueChange(config.id, e.target.value)}
                        className="px-3 py-2 bg-[#12121a] border border-gray-700 rounded-lg text-white focus:border-emerald-500 focus:outline-none w-32 text-right"
                      />
                    )}
                    {isModified(config) && (
                      <Button
                        size="sm"
                        onClick={() => handleSave(config.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* System Actions */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            System Actions
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-lg">
            <div>
              <p className="text-white font-medium">Clear Cache</p>
              <p className="text-sm text-gray-500">
                Clear all cached data and refresh system
              </p>
            </div>
            <Button variant="outline" className="border-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-lg">
            <div>
              <p className="text-white font-medium">Manual Backup</p>
              <p className="text-sm text-gray-500">
                Create an immediate database backup
              </p>
            </div>
            <Button variant="outline" className="border-gray-700">
              <Database className="w-4 h-4 mr-2" />
              Backup Now
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-lg">
            <div>
              <p className="text-white font-medium">Reset to Defaults</p>
              <p className="text-sm text-gray-500">
                Restore all settings to factory defaults
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-500" />
            System Information
          </h2>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0a0a0f] p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Platform Version</p>
              <p className="text-white font-mono">v2.1.0</p>
            </div>
            <div className="bg-[#0a0a0f] p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Environment</p>
              <p className="text-white font-mono">Production</p>
            </div>
            <div className="bg-[#0a0a0f] p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Server Region</p>
              <p className="text-white font-mono">Asia Pacific (Mumbai)</p>
            </div>
            <div className="bg-[#0a0a0f] p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Last Deployment</p>
              <p className="text-white font-mono">2024-12-20 06:00 IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
