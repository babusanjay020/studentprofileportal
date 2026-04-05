import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const gradeColors = {
  "O": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "A+": "bg-blue-100 text-blue-700 border-blue-200",
  "A": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "B+": "bg-violet-100 text-violet-700 border-violet-200",
  "B": "bg-purple-100 text-purple-700 border-purple-200",
  "C": "bg-amber-100 text-amber-700 border-amber-200",
  "D": "bg-orange-100 text-orange-700 border-orange-200",
  "F": "bg-red-100 text-red-700 border-red-200",
};

export default function ScoreCard({ score }) {
  const percentage = (score.total_marks / score.max_marks) * 100;

  return (
    <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {score.subject_name}
          </h3>
          <p className="text-sm text-slate-500">{score.subject_code}</p>
        </div>
        {score.grade && (
          <Badge className={cn("text-lg px-3 py-1 font-bold border", gradeColors[score.grade] || "bg-slate-100")}>
            {score.grade}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {score.internal_marks !== undefined && (
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Internal</p>
            <p className="text-lg font-bold text-slate-800">{score.internal_marks}</p>
          </div>
        )}
        {score.external_marks !== undefined && (
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wide">External</p>
            <p className="text-lg font-bold text-slate-800">{score.external_marks}</p>
          </div>
        )}
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <p className="text-xs text-indigo-600 uppercase tracking-wide">Total</p>
          <p className="text-lg font-bold text-indigo-700">{score.total_marks}/{score.max_marks}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Credits: {score.credits || '-'}</span>
        <span className={cn(
          "font-semibold",
          percentage >= 60 ? "text-emerald-600" : percentage >= 40 ? "text-amber-600" : "text-red-600"
        )}>
          {percentage.toFixed(1)}%
        </span>
      </div>
    </Card>
  );
}