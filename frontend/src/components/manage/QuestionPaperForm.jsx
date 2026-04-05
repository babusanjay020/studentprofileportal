const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export default function QuestionPaperForm({ currentUser }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", subject_name: "", subject_code: "", semester: "", year: "", exam_type: "Mid-Term", file_url: ""
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => db.entities.Subject.list(),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, file_url });
    toast.success("File uploaded successfully!");
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await db.entities.QuestionPaper.create({
      ...formData,
      semester: parseInt(formData.semester),
      year: parseInt(formData.year),
      department: currentUser?.department || undefined
    });
    toast.success("Question paper added successfully!");
    setFormData({ title: "", subject_name: "", subject_code: "", semester: "", year: "", exam_type: "Mid-Term", file_url: "" });
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <CardTitle>Add Question Paper</CardTitle>
          {currentUser?.department && <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{currentUser.department}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Paper Title *</Label>
              <Input placeholder="e.g., Data Structures Mid-Term 2024" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select value={formData.subject_name} onValueChange={(value) => {
                const subject = subjects.find(s => s.name === value);
                setFormData({ ...formData, subject_name: value, subject_code: subject?.code || "", semester: subject?.semester?.toString() || "" });
              }}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>{subject.name} ({subject.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year *</Label>
              <Input type="number" min="2000" max="2100" placeholder="e.g., 2024" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label>Exam Type *</Label>
              <Select value={formData.exam_type} onValueChange={(value) => setFormData({ ...formData, exam_type: value })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                  <SelectItem value="End-Term">End-Term</SelectItem>
                  <SelectItem value="Supplementary">Supplementary</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester *</Label>
              <Input type="number" min="1" max="10" placeholder="e.g., 3" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Upload Paper (PDF)</Label>
              <div className="flex gap-2">
                <Input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} className="flex-1" />
                {formData.file_url && <Button type="button" variant="outline" onClick={() => window.open(formData.file_url, '_blank')}>View</Button>}
              </div>
              {uploading && <p className="text-xs text-indigo-600">Uploading...</p>}
            </div>
          </div>

          <Button type="submit" disabled={loading || uploading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Adding..." : "Add Question Paper"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}