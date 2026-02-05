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
        return <Percent className="w-5 h-5 text-primary" />;
      case "notifications":
        return <Bell className="w-5 h-5 text-primary" />;
      case "integration":
        return <Globe className="w-5 h-5 text-primary" />;
      default:
        return <Settings className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "security":
        return "border-red-500/30 bg-red-500/5";
      case "training":
        return "border-primary/30 bg-primary/5";
      case "notifications":
        return "border-primary/30 bg-primary/5";
      case "integration":
        return "border-primary/30 bg-primary/5";
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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            System Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage system settings and parameters
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              Saved
            </div>
          )}
          {hasChanges && (
            <Button
              onClick={handleSaveAll}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          )}
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-primary font-medium">Configuration Warning</p>
          <p className="text-sm text-muted-foreground">
            Changing these settings may affect system behavior. Please review changes
            carefully before saving.
          </p>
        </div>
      </div>

      {/* Configuration Sections */}
      {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
        <div
          key={category}
          className={`bg-card border rounded-lg ${getCategoryColor(category)}`}
        >
          <div className="p-4 border-b border-border flex items-center gap-3">
            {getCategoryIcon(category)}
            <h2 className="font-semibold text-foreground">
              {categoryLabels[category] || category}
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {categoryConfigs.map((config) => (
              <div
                key={config.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isModified(config)
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-muted-foreground">
                      {getConfigIcon(config.key)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">{config.key}</p>
                        {isModified(config) && (
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                            Modified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {config.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last modified: {config.lastModified} by {config.modifiedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {config.key === "notification_email" ? (
                      <select
                        value={getValue(config)}
                        onChange={(e) => handleValueChange(config.id, e.target.value)}
                        className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none min-w-[120px]"
                      >
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    ) : config.key === "backup_frequency" ? (
                      <select
                        value={getValue(config)}
                        onChange={(e) => handleValueChange(config.id, e.target.value)}
                        className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none min-w-[120px]"
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
                        className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none w-32 text-right"
                      />
                    )}
                    {isModified(config) && (
                      <Button
                        size="sm"
                        onClick={() => handleSave(config.id)}
                        className="bg-primary hover:bg-primary/90"
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
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            System Actions
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-foreground font-medium">Clear Cache</p>
              <p className="text-sm text-muted-foreground">
                Clear all cached data and refresh system
              </p>
            </div>
            <Button variant="outline" className="border-border">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-foreground font-medium">Manual Backup</p>
              <p className="text-sm text-muted-foreground">
                Create an immediate database backup
              </p>
            </div>
            <Button variant="outline" className="border-border">
              <Database className="w-4 h-4 mr-2" />
              Backup Now
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-foreground font-medium">Reset to Defaults</p>
              <p className="text-sm text-muted-foreground">
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
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Server className="w-5 h-5 text-muted-foreground" />
            System Information
          </h2>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Platform Version</p>
              <p className="text-foreground font-mono">v2.1.0</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Environment</p>
              <p className="text-foreground font-mono">Production</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Server Region</p>
              <p className="text-foreground font-mono">Asia Pacific (Mumbai)</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Last Deployment</p>
              <p className="text-foreground font-mono">2024-12-20 06:00 IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
