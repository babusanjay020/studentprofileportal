const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Save, X, Lock, User } from "lucide-react";
import { toast } from "sonner";

const GRADES = ["O", "A+", "A", "B+", "B", "C", "D", "F"];
const GRADE_COLORS = { O: "bg-violet-100 text-violet-800", "A+": "bg-blue-100 text-blue-800", A: "bg-green-100 text-green-800", "B+": "bg-teal-100 text-teal-800", B: "bg-yellow-100 text-yellow-800", C: "bg-orange-100 text-orange-800", D: "bg-red-100 text-red-800", F: "bg-red-200 text-red-900" };

export default function EditScores({ currentUser }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterRoll, setFilterRoll] = useState("");
  const queryClient = useQueryClient();

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hod";
  const userDept = currentUser?.department;

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["scores-all"],
    queryFn: () => db.entities.Score.list(),
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: () => db.entities.User.list(),
  });

  const emailToStudent = allUsers.reduce((acc, u) => { acc[u.email] = u; return acc; }, {});

  const deptRecords = isAdmin ? records : records.filter(r => r.department === userDept);

  const filtered = filterRoll
    ? deptRecords.filter(r => {
        const stu = emailToStudent[r.student_email];
        return stu?.roll_number?.toLowerCase().includes(filterRoll.toLowerCase()) ||
               stu?.full_name?.toLowerCase().includes(filterRoll.toLowerCase());
      })
    : deptRecords;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Score.update(id, {
      ...data,
      semester: parseInt(data.semester),
      internal_marks: parseFloat(data.internal_marks) || 0,
      external_marks: parseFloat(data.external_marks) || 0,
      total_marks: parseFloat(data.total_marks),
      max_marks: parseFloat(data.max_marks),
      credits: parseFloat(data.credits) || 0,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores-all"] });
      toast.success("Score updated!");
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Score.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores-all"] });
      toast.success("Record deleted!");
    },
  });

  if (!isAdmin && !userDept) {
    return <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-lg p-4">⚠ Your account has no department assigned. Contact an admin.</div>;
  }

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <div className="flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 rounded-lg px-3 py-2">
          <Lock className="w-4 h-4" /> Showing only <strong>{userDept}</strong> department records
        </div>
      )}
      <div className="flex items-center gap-3">
        <Input placeholder="Search by roll number or name..." value={filterRoll} onChange={e => setFilterRoll(e.target.value)} className="max-w-xs" />
        <span className="text-sm text-slate-500">{filtered.length} record(s)</span>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No score records found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => {
            const stu = emailToStudent[record.student_email];
            return (
              <Card key={record.id} className="border border-slate-200">
                <CardContent className="p-4">
                  {editingId === record.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2 text-sm text-indigo-700">
                        <User className="w-4 h-4" />
                        <span><strong>{stu?.full_name || record.student_email}</strong> — Roll: {stu?.roll_number || "—"}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div><Label>Subject Name</Label><Input value={editData.subject_name} onChange={e => setEditData({ ...editData, subject_name: e.target.value })} /></div>
                        <div><Label>Subject Code</Label><Input value={editData.subject_code} onChange={e => setEditData({ ...editData, subject_code: e.target.value })} /></div>
                        <div><Label>Semester</Label><Input type="number" value={editData.semester} onChange={e => setEditData({ ...editData, semester: e.target.value })} /></div>
                        <div><Label>Internal Marks</Label><Input type="number" value={editData.internal_marks} onChange={e => setEditData({ ...editData, internal_marks: e.target.value })} /></div>
                        <div><Label>External Marks</Label><Input type="number" value={editData.external_marks} onChange={e => setEditData({ ...editData, external_marks: e.target.value })} /></div>
                        <div><Label>Total Marks</Label><Input type="number" value={editData.total_marks} onChange={e => setEditData({ ...editData, total_marks: e.target.value })} /></div>
                        <div><Label>Max Marks</Label><Input type="number" value={editData.max_marks} onChange={e => setEditData({ ...editData, max_marks: e.target.value })} /></div>
                        <div><Label>Credits</Label><Input type="number" value={editData.credits} onChange={e => setEditData({ ...editData, credits: e.target.value })} /></div>
                        <div>
                          <Label>Grade</Label>
                          <Select value={editData.grade} onValueChange={v => setEditData({ ...editData, grade: v })}>
                            <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                            <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => updateMutation.mutate({ id: record.id, data: editData })} disabled={updateMutation.isPending}><Save className="w-4 h-4 mr-1" /> Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{stu?.roll_number || "—"}</p>
                          <span className="text-slate-400">·</span>
                          <p className="font-medium text-slate-700">{stu?.full_name || record.student_email}</p>
                        </div>
                        <p className="text-sm text-slate-600">{record.subject_name} ({record.subject_code}) — Sem {record.semester}</p>
                        <p className="text-xs text-slate-500">{record.total_marks}/{record.max_marks} marks • {record.credits} credits</p>
                        {record.department && <p className="text-xs text-indigo-500">{record.department}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={GRADE_COLORS[record.grade] || "bg-gray-100"}>{record.grade}</Badge>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(record.id); setEditData({ ...record }); }}><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteMutation.mutate(record.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}