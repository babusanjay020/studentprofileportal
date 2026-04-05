import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Video, BookOpen, Globe, GraduationCap, FileStack } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  "Notes": { icon: FileText, color: "bg-blue-100 text-blue-600" },
  "Video": { icon: Video, color: "bg-red-100 text-red-600" },
  "Book": { icon: BookOpen, color: "bg-amber-100 text-amber-600" },
  "Website": { icon: Globe, color: "bg-emerald-100 text-emerald-600" },
  "Tutorial": { icon: GraduationCap, color: "bg-violet-100 text-violet-600" },
  "Syllabus": { icon: FileStack, color: "bg-indigo-100 text-indigo-600" },
};

export default function ResourceCard({ resource }) {
  const config = typeConfig[resource.resource_type] || typeConfig["Notes"];
  const Icon = config.icon;
  const link = resource.url || resource.file_url;

  return (
    <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl shrink-0", config.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {resource.title}
            </h3>
            <Badge variant="outline" className="shrink-0">
              {resource.resource_type}
            </Badge>
          </div>
          
          {resource.description && (
            <p className="text-sm text-slate-500 mb-3 line-clamp-2">{resource.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {resource.subject_name && <span>{resource.subject_name}</span>}
              {resource.semester && <span>• Sem {resource.semester}</span>}
            </div>
            
            {link && (
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" asChild>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}