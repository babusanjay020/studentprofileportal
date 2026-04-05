const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import StudentRollLookup from "./StudentRollLookup";

export default function AttendanceForm({ currentUser }) {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    subject_name: "",
    total_classes: "",
    attended_classes: "",
    semester: ""
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => db.entities.Subject.list(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student) { toast.error("Please look up a student by roll number first."); return; }
    setLoading(true);
    const percentage = (parseInt(formData.attended_classes) / parseInt(formData.total_classes)) * 100;
    await db.entities.Attendance.create({
      ...formData,
      student_email: student.email,
      total_classes: parseInt(formData.total_classes),
      attended_classes: parseInt(formData.attended_classes),
      semester: parseInt(formData.semester),
      percentage: parseFloat(percentage.toFixed(2)),
      department: currentUser?.department || undefined
    });
    toast.success("Attendance record added successfully!");
    setFormData({ subject_name: "", total_classes: "", attended_classes: "", semester: "" });
    setStudent(null);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <CardTitle>Add Attendance Record</CardTitle>
          {currentUser?.department && <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{currentUser.department}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <StudentRollLookup onStudentFound={setStudent} currentUser={currentUser} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject_name">Subject *</Label>
              <Select value={formData.subject_name} onValueChange={(value) => {
                const subject = subjects.find(s => s.name === value);
                setFormData({ ...formData, subject_name: value, semester: subject?.semester?.toString() || "" });
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
              <Label htmlFor="semester">Semester *</Label>
              <Input id="semester" type="number" min="1" max="10" placeholder="e.g., 3" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_classes">Total Classes *</Label>
              <Input id="total_classes" type="number" min="1" placeholder="e.g., 40" value={formData.total_classes} onChange={(e) => setFormData({ ...formData, total_classes: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attended_classes">Attended Classes *</Label>
              <Input id="attended_classes" type="number" min="0" placeholder="e.g., 35" value={formData.attended_classes} onChange={(e) => setFormData({ ...formData, attended_classes: e.target.value })} required />
            </div>
          </div>

          <Button type="submit" disabled={loading || !student} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Adding..." : "Add Attendance Record"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}