const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { toast } from "sonner";
import StudentRollLookup from "./StudentRollLookup";

export default function ScoreForm({ currentUser }) {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    subject_name: "", subject_code: "", semester: "",
    internal_marks: "", external_marks: "", total_marks: "", max_marks: "100", grade: "", credits: ""
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => db.entities.Subject.list(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student) { toast.error("Please look up a student by roll number first."); return; }
    setLoading(true);
    await db.entities.Score.create({
      ...formData,
      student_email: student.email,
      semester: parseInt(formData.semester),
      internal_marks: parseFloat(formData.internal_marks),
      external_marks: parseFloat(formData.external_marks),
      total_marks: parseFloat(formData.total_marks),
      max_marks: parseFloat(formData.max_marks),
      credits: parseFloat(formData.credits),
      department: currentUser?.department || undefined
    });
    toast.success("Score record added successfully!");
    setFormData({ subject_name: "", subject_code: "", semester: "", internal_marks: "", external_marks: "", total_marks: "", max_marks: "100", grade: "", credits: "" });
    setStudent(null);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <CardTitle>Add Score Record</CardTitle>
          {currentUser?.department && <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{currentUser.department}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <StudentRollLookup onStudentFound={setStudent} currentUser={currentUser} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Subject *</Label>
              <Select value={formData.subject_name} onValueChange={(value) => {
                const subject = subjects.find(s => s.name === value);
                setFormData({ ...formData, subject_name: value, subject_code: subject?.code || "", semester: subject?.semester?.toString() || "", credits: subject?.credits?.toString() || "" });
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
              <Label>Internal Marks</Label>
              <Input type="number" min="0" step="0.01" placeholder="e.g., 25" value={formData.internal_marks} onChange={(e) => setFormData({ ...formData, internal_marks: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>External Marks</Label>
              <Input type="number" min="0" step="0.01" placeholder="e.g., 70" value={formData.external_marks} onChange={(e) => setFormData({ ...formData, external_marks: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Total Marks *</Label>
              <Input type="number" min="0" step="0.01" placeholder="e.g., 85" value={formData.total_marks} onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Maximum Marks *</Label>
              <Input type="number" min="1" step="0.01" placeholder="e.g., 100" value={formData.max_marks} onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label>Grade *</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>
                  {["O","A+","A","B+","B","C","D","F"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Credits *</Label>
              <Input type="number" min="1" max="10" placeholder="e.g., 4" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} required />
            </div>
          </div>

          <Button type="submit" disabled={loading || !student} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Adding..." : "Add Score Record"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}