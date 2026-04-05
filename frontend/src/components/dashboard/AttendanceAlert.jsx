import { AlertTriangle, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AttendanceAlert({ attendance }) {
  const lowAttendance = attendance.filter(a => a.percentage < 75);
  
  if (lowAttendance.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-0">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-100">
            <TrendingDown className="w-5 h-5 text-emerald-600 rotate-180" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800">Great Attendance!</h3>
            <p className="text-sm text-emerald-600">All subjects are above 75% attendance</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-0 border-l-4 border-l-amber-500">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-amber-100 shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="font-semibold text-amber-800">Low Attendance Alert</h3>
            <p className="text-sm text-amber-600">Improve attendance in these subjects to avoid detention</p>
          </div>
          <div className="space-y-2">
            {lowAttendance.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <span className="font-medium text-slate-700">{item.subject_name}</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  item.percentage < 50 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                )}>
                  {item.percentage?.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}