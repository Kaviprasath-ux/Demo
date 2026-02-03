"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  label: string;
  value: number;
}

interface DataChartProps {
  title: string;
  data: DataPoint[];
  maxValue?: number;
  valueLabel?: string;
  color?: "primary" | "success" | "warning";
}

export function DataChart({
  title,
  data,
  maxValue,
  valueLabel = "",
  color = "primary",
}: DataChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value)) * 1.2;

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.label}</span>
                <span className="font-medium text-foreground">
                  {item.value}
                  {valueLabel}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${colorClasses[color]}`}
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface SimpleBarChartProps {
  title: string;
  data: { label: string; value: number }[];
  height?: number;
}

export function SimpleBarChart({ title, data, height = 200 }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.value)) * 1.1;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2" style={{ height }}>
          {data.map((item, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full flex-1">
                <div
                  className="absolute bottom-0 w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                  style={{ height: `${(item.value / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
