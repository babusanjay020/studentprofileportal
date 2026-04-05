import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const examTypeColors = {
  "Mid-Term": "bg-blue-100 text-blue-700 border-blue-200",
  "End-Term": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Supplementary": "bg-amber-100 text-amber-700 border-amber-200",
  "Internal": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function QuestionPaperCard({ paper }) {
  return (
    <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 shrink-0">
          <FileText className="w-6 h-6 text-slate-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
            {paper.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={cn("border", examTypeColors[paper.exam_type] || "bg-slate-100")}>
              {paper.exam_type}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {paper.subject_name}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {paper.year}
              </span>
              <span>Semester {paper.semester}</span>
            </div>
            
            {paper.file_url && (
              <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
                <a href={paper.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}