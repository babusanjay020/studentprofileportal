import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BookOpen, AlertCircle, CheckCircle } from "lucide-react";

export default function AttendanceCard({ attendance }) {
  const percentage = attendance.percentage || 
    ((attendance.attended_classes / attendance.total_classes) * 100);
  
  const isLow = percentage < 75;
  const isCritical = percentage < 50;

  return (
    <Card className={cn(
      "p-5 border-0 shadow-sm hover:shadow-md transition-all duration-300",
      isCritical && "ring-2 ring-red-200",
      isLow && !isCritical && "ring-2 ring-amber-200"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl",
            isCritical ? "bg-red-100" : isLow ? "bg-amber-100" : "bg-emerald-100"
          )}>
            <BookOpen className={cn(
              "w-5 h-5",
              isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-emerald-600"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{attendance.subject_name}</h3>
            <p className="text-sm text-slate-500">Semester {attendance.semester}</p>
          </div>
        </div>
        {isCritical ? (
          <AlertCircle className="w-5 h-5 text-red-500" />
        ) : isLow ? (
          <AlertCircle className="w-5 h-5 text-amber-500" />
        ) : (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">
            {attendance.attended_classes} / {attendance.total_classes} classes
          </span>
          <span className={cn(
            "font-bold",
            isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-emerald-600"
          )}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <Progress 
          value={percentage} 
          className={cn(
            "h-2",
            isCritical ? "[&>div]:bg-red-500" : isLow ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"
          )}
        />
        {isLow && (
          <p className="text-xs text-slate-500 mt-2">
            Need {Math.ceil((0.75 * attendance.total_classes - attendance.attended_classes) / 0.25)} more classes to reach 75%
          </p>
        )}
      </div>
    </Card>
  );
}