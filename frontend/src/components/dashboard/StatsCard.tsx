
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
 
interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}
 
export default function StatsCard({ title, value, subtitle, icon: Icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div className={cn("relative overflow-hidden p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          {trend && (
            <div className={cn("flex items-center gap-1 text-sm font-medium", trendUp ? "text-emerald-600" : "text-red-500")}>
              <span>{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
}