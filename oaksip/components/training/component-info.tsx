"use client";

import { useTrainingStore } from "@/lib/training-store";
import { getComponentById } from "@/lib/gun-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, AlertTriangle, Info } from "lucide-react";

export function ComponentInfo() {
  const { selectedComponent, setSelectedComponent } = useTrainingStore();

  if (!selectedComponent) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Component Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Click on any component
              <br />
              to view its details
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const component = getComponentById(selectedComponent);

  if (!component) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{component.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setSelectedComponent(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Badge variant="secondary" className="w-fit text-xs">
          {component.id.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100%-1rem)]">
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Description
              </h4>
              <p className="text-sm">{component.description}</p>
            </div>

            {/* Technical Specs */}
            {component.technicalSpecs && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">
                  Technical Specifications
                </h4>
                <div className="space-y-1">
                  {Object.entries(component.technicalSpecs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0"
                    >
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Notes */}
            {component.safetyNotes && component.safetyNotes.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  Safety Notes
                </h4>
                <ul className="space-y-1">
                  {component.safetyNotes.map((note, index) => (
                    <li
                      key={index}
                      className="text-sm text-yellow-600 dark:text-yellow-500 flex items-start gap-2"
                    >
                      <span className="text-yellow-500 mt-1">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
