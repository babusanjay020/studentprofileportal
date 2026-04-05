const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function ResourceForm({ currentUser }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", subject_name: "", semester: "", resource_type: "Notes", url: "", file_url: ""
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
    await db.entities.Resource.create({
      ...formData,
      semester: formData.semester ? parseInt(formData.semester) : undefined,
      department: currentUser?.department || undefined
    });
    toast.success("Resource added successfully!");
    setFormData({ title: "", description: "", subject_name: "", semester: "", resource_type: "Notes", url: "", file_url: "" });
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <CardTitle>Add Learning Resource</CardTitle>
          {currentUser?.department && <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{currentUser.department}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Resource Title *</Label>
              <Input placeholder="e.g., Data Structures Complete Notes" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea placeholder="Brief description of the resource..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Resource Type *</Label>
              <Select value={formData.resource_type} onValueChange={(value) => setFormData({ ...formData, resource_type: value })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {["Notes","Video","Book","Website","Tutorial","Syllabus"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="e.g., Data Structures" value={formData.subject_name} onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Input type="number" min="1" max="10" placeholder="e.g., 3" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>External URL</Label>
              <Input type="url" placeholder="https://example.com/resource" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Or Upload File</Label>
              <div className="flex gap-2">
                <Input type="file" onChange={handleFileUpload} disabled={uploading} className="flex-1" />
                {formData.file_url && <Button type="button" variant="outline" onClick={() => window.open(formData.file_url, '_blank')}>View</Button>}
              </div>
              {uploading && <p className="text-xs text-indigo-600">Uploading...</p>}
            </div>
          </div>

          <Button type="submit" disabled={loading || uploading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Adding..." : "Add Resource"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}