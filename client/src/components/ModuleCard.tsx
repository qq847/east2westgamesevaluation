import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GradeBadge from "./GradeBadge";
import { type LucideIcon } from "lucide-react";
import { Streamdown } from "streamdown";

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  grade: string;
  score: number;
  data: Record<string, any>;
  renderContent: (data: Record<string, any>) => React.ReactNode;
}

export default function ModuleCard({
  title,
  icon: Icon,
  iconColor,
  grade,
  score,
  data,
  renderContent,
}: ModuleCardProps) {
  return (
    <Card className="bg-card/80 border-border/50 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-secondary/50 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">评分: {score}/100</p>
            </div>
          </div>
          <GradeBadge grade={grade} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">{renderContent(data)}</div>
      </CardContent>
    </Card>
  );
}

// Reusable sub-components for module content
export function InfoRow({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground shrink-0 min-w-[5rem]">{label}:</span>
      <span className="text-foreground">{String(value)}</span>
    </div>
  );
}

export function RiskList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-xs">
          <span className="text-destructive mt-0.5">●</span>
          <span className="text-muted-foreground">{item}</span>
        </div>
      ))}
    </div>
  );
}

export function OpportunityList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-xs">
          <span className="text-e2w-green mt-0.5">●</span>
          <span className="text-muted-foreground">{item}</span>
        </div>
      ))}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-1.5 border-t border-border/30 pt-3">
      {children}
    </h4>
  );
}

export function ContentBlock({ text }: { text: string | undefined }) {
  if (!text) return null;
  return <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>;
}
