"use client";

import { useState } from "react";
import {
  History,
  GitBranch,
  Eye,
  ArrowLeft,
  FileText,
  Clock,
  User,
  Check,
  Lock,
  ChevronRight,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mockVersionedContent,
  type ContentVersion,
  type ContentItem,
  getVersionHistory,
  getStatusColor,
  getSecurityColor,
  formatVersionDate,
  compareVersions,
  type VersionDiff,
} from "@/lib/content-versioning";
import { cn } from "@/lib/utils";

// Version Timeline Item
function VersionTimelineItem({
  version,
  isCurrentVersion,
  onView,
  onCompare,
  previousVersion,
}: {
  version: ContentVersion;
  isCurrentVersion: boolean;
  onView: () => void;
  onCompare?: () => void;
  previousVersion?: ContentVersion;
}) {
  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border last:hidden" />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-0 w-5 h-5 rounded-full flex items-center justify-center",
          isCurrentVersion ? "bg-primary" : "bg-muted border-2 border-border"
        )}
      >
        {isCurrentVersion && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>

      {/* Content */}
      <div className={cn("p-3 rounded-lg border", isCurrentVersion && "border-primary/50 bg-primary/5")}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">v{version.versionNumber}</span>
              <Badge className={cn("text-[10px]", getStatusColor(version.status))}>
                {version.status.replace("_", " ").toUpperCase()}
              </Badge>
              {isCurrentVersion && (
                <Badge variant="outline" className="text-[10px]">
                  CURRENT
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{version.changeDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {version.createdBy}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatVersionDate(version.createdAt)}
          </span>
          {version.approvedBy && (
            <span className="flex items-center gap-1 text-green-600">
              <Check className="h-3 w-3" />
              {version.approvedBy}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onView}>
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          {previousVersion && onCompare && (
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onCompare}>
              <GitBranch className="h-3 w-3 mr-1" />
              Compare
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Version Viewer Dialog
function VersionViewer({ version }: { version: ContentVersion; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{version.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={cn(getStatusColor(version.status))}>
              {version.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge className={cn(getSecurityColor(version.metadata.securityLevel))}>
              {version.metadata.securityLevel.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">v{version.versionNumber}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Created By</p>
          <p className="font-medium">{version.createdBy}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Created At</p>
          <p className="font-medium">{formatVersionDate(version.createdAt)}</p>
        </div>
        {version.approvedBy && (
          <>
            <div>
              <p className="text-muted-foreground">Approved By</p>
              <p className="font-medium">{version.approvedBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Approved At</p>
              <p className="font-medium">{formatVersionDate(version.approvedAt!)}</p>
            </div>
          </>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Metadata</p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{version.metadata.category}</Badge>
          {version.metadata.subcategory && (
            <Badge variant="outline">{version.metadata.subcategory}</Badge>
          )}
          {version.metadata.weaponSystem && (
            <Badge variant="outline">{version.metadata.weaponSystem}</Badge>
          )}
          {version.metadata.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Content</p>
        <ScrollArea className="h-[300px] border rounded-lg p-4 bg-muted/30">
          <pre className="text-sm whitespace-pre-wrap font-mono">{version.content}</pre>
        </ScrollArea>
      </div>

      <div className="text-xs text-muted-foreground">
        Hash: <code>{version.hash}</code>
      </div>
    </div>
  );
}

// Version Diff Viewer
function VersionDiffViewer({
  oldVersion,
  newVersion,
  diff,
}: {
  oldVersion: ContentVersion;
  newVersion: ContentVersion;
  diff: VersionDiff;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="outline">v{oldVersion.versionNumber}</Badge>
          <ChevronRight className="h-4 w-4" />
          <Badge variant="outline">v{newVersion.versionNumber}</Badge>
        </div>
        <span className="text-muted-foreground">{newVersion.changeDescription}</span>
      </div>

      {diff.metadataChanges.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Metadata Changes</h4>
          <div className="space-y-1">
            {diff.metadataChanges.map((change, i) => (
              <div key={i} className="text-xs p-2 bg-muted/50 rounded">
                <span className="font-medium">{change.field}:</span>{" "}
                <span className="text-red-500 line-through">{change.oldValue}</span>{" "}
                <span className="text-green-500">{change.newValue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {diff.added.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2 text-green-600">Added Lines ({diff.added.length})</h4>
          <div className="space-y-1">
            {diff.added.slice(0, 5).map((line, i) => (
              <div key={i} className="text-xs p-2 bg-green-500/10 rounded font-mono">
                + {line}
              </div>
            ))}
            {diff.added.length > 5 && (
              <p className="text-xs text-muted-foreground">...and {diff.added.length - 5} more lines</p>
            )}
          </div>
        </div>
      )}

      {diff.removed.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2 text-red-600">Removed Lines ({diff.removed.length})</h4>
          <div className="space-y-1">
            {diff.removed.slice(0, 5).map((line, i) => (
              <div key={i} className="text-xs p-2 bg-red-500/10 rounded font-mono">
                - {line}
              </div>
            ))}
            {diff.removed.length > 5 && (
              <p className="text-xs text-muted-foreground">...and {diff.removed.length - 5} more lines</p>
            )}
          </div>
        </div>
      )}

      {diff.modified.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2 text-yellow-600">Modified Lines ({diff.modified.length})</h4>
          <div className="space-y-1">
            {diff.modified.slice(0, 5).map((line, i) => (
              <div key={i} className="text-xs p-2 bg-yellow-500/10 rounded font-mono">
                {line}
              </div>
            ))}
            {diff.modified.length > 5 && (
              <p className="text-xs text-muted-foreground">...and {diff.modified.length - 5} more lines</p>
            )}
          </div>
        </div>
      )}

      {diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0 && (
        <p className="text-sm text-muted-foreground">No content changes detected.</p>
      )}
    </div>
  );
}

// Content Item Card
function ContentItemCard({
  item,
  onSelectItem,
}: {
  item: ContentItem;
  onSelectItem: (item: ContentItem) => void;
}) {
  const versionCount = item.versions.length + 1; // +1 for current version

  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-all"
      onClick={() => onSelectItem(item)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{item.currentVersion.title}</h4>
              {item.isLocked && (
                <span title={`Locked by ${item.lockedBy}`}>
                  <Lock className="h-3 w-3 text-yellow-500" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge className={cn("text-[10px]", getStatusColor(item.currentVersion.status))}>
                {item.currentVersion.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge className={cn("text-[10px]", getSecurityColor(item.currentVersion.metadata.securityLevel))}>
                {item.currentVersion.metadata.securityLevel.toUpperCase()}
              </Badge>
              <span className="text-muted-foreground">v{item.currentVersion.versionNumber}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <History className="h-3 w-3" />
                {versionCount} versions
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.currentVersion.createdBy}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main Version History Panel
export function VersionHistoryPanel() {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [viewingVersion, setViewingVersion] = useState<ContentVersion | null>(null);
  const [comparingVersions, setComparingVersions] = useState<{
    old: ContentVersion;
    new: ContentVersion;
  } | null>(null);

  const handleCompare = (newVersion: ContentVersion, oldVersion: ContentVersion) => {
    setComparingVersions({ old: oldVersion, new: newVersion });
  };

  // List view
  if (!selectedItem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Content Version Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {mockVersionedContent.map((item) => (
                <ContentItemCard
                  key={item.id}
                  item={item}
                  onSelectItem={setSelectedItem}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Version history view
  const versions = getVersionHistory(selectedItem.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2"
              onClick={() => setSelectedItem(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to List
            </Button>
            <CardTitle className="text-lg">{selectedItem.currentVersion.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn(getStatusColor(selectedItem.currentVersion.status))}>
                {selectedItem.currentVersion.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge className={cn(getSecurityColor(selectedItem.currentVersion.metadata.securityLevel))}>
                <Shield className="h-3 w-3 mr-1" />
                {selectedItem.currentVersion.metadata.securityLevel.toUpperCase()}
              </Badge>
              {selectedItem.isLocked && (
                <Badge variant="outline" className="text-yellow-600">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked by {selectedItem.lockedBy}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Restore
            </Button>
            <Button size="sm">
              <GitBranch className="h-4 w-4 mr-1" />
              New Version
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          <div className="space-y-0">
            {versions.map((version, index) => {
              const isCurrentVersion = version.versionId === selectedItem.currentVersionId;
              const previousVersion = versions[index + 1];

              return (
                <VersionTimelineItem
                  key={version.versionId}
                  version={version}
                  isCurrentVersion={isCurrentVersion}
                  previousVersion={previousVersion}
                  onView={() => setViewingVersion(version)}
                  onCompare={
                    previousVersion
                      ? () => handleCompare(version, previousVersion)
                      : undefined
                  }
                />
              );
            })}
          </div>
        </ScrollArea>

        {/* View Version Dialog */}
        <Dialog open={!!viewingVersion} onOpenChange={() => setViewingVersion(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Version Details</DialogTitle>
            </DialogHeader>
            {viewingVersion && (
              <VersionViewer
                version={viewingVersion}
                onClose={() => setViewingVersion(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Compare Versions Dialog */}
        <Dialog open={!!comparingVersions} onOpenChange={() => setComparingVersions(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Version Comparison</DialogTitle>
            </DialogHeader>
            {comparingVersions && (
              <VersionDiffViewer
                oldVersion={comparingVersions.old}
                newVersion={comparingVersions.new}
                diff={compareVersions(comparingVersions.old, comparingVersions.new)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Compact version info for embedding
export function CompactVersionInfo({ contentId }: { contentId: string }) {
  const item = mockVersionedContent.find((c) => c.id === contentId);
  if (!item) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant="outline" className="text-[10px]">
        v{item.currentVersion.versionNumber}
      </Badge>
      <span className="text-muted-foreground">
        {formatVersionDate(item.currentVersion.createdAt)}
      </span>
      {item.isLocked && <Lock className="h-3 w-3 text-yellow-500" />}
    </div>
  );
}
