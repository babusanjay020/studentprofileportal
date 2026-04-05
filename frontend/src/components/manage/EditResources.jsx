const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Save, X, Lock } from "lucide-react";
import { toast } from "sonner";

const RESOURCE_TYPES = ["Notes", "Video", "Book", "Website", "Tutorial", "Syllabus"];
const TYPE_COLORS = { Notes: "bg-blue-100 text-blue-800", Video: "bg-red-100 text-red-800", Book: "bg-amber-100 text-amber-800", Website: "bg-cyan-100 text-cyan-800", Tutorial: "bg-green-100 text-green-800", Syllabus: "bg-purple-100 text-purple-800" };

export default function EditResources({ currentUser }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterText, setFilterText] = useState("");
  const queryClient = useQueryClient();

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hod";
  const userDept = currentUser?.department;

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["resources-all"],
    queryFn: () => db.entities.Resource.list(),
  });

  const deptRecords = isAdmin ? records : records.filter(r => r.department === userDept);
  const filtered = filterText
    ? deptRecords.filter(r => r.title?.toLowerCase().includes(filterText.toLowerCase()) || r.subject_name?.toLowerCase().includes(filterText.toLowerCase()))
    : deptRecords;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Resource.update(id, {
      ...data,
      semester: parseInt(data.semester) || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources-all"] });
      toast.success("Resource updated!");
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Resource.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources-all"] });
      toast.success("Resource deleted!");
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
        <Input placeholder="Filter by title or subject..." value={filterText} onChange={e => setFilterText(e.target.value)} className="max-w-xs" />
        <span className="text-sm text-slate-500">{filtered.length} record(s)</span>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No resources found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => (
            <Card key={record.id} className="border border-slate-200">
              <CardContent className="p-4">
                {editingId === record.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div><Label>Title</Label><Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} /></div>
                      <div><Label>Subject Name</Label><Input value={editData.subject_name} onChange={e => setEditData({ ...editData, subject_name: e.target.value })} /></div>
                      <div><Label>Semester</Label><Input type="number" value={editData.semester} onChange={e => setEditData({ ...editData, semester: e.target.value })} /></div>
                      <div>
                        <Label>Resource Type</Label>
                        <Select value={editData.resource_type} onValueChange={v => setEditData({ ...editData, resource_type: v })}>
                          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                          <SelectContent>{RESOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div><Label>URL</Label><Input value={editData.url} onChange={e => setEditData({ ...editData, url: e.target.value })} /></div>
                      <div><Label>Description</Label><Input value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} /></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => updateMutation.mutate({ id: record.id, data: editData })} disabled={updateMutation.isPending}><Save className="w-4 h-4 mr-1" /> Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800">{record.title}</p>
                      <p className="text-sm text-slate-600">{record.subject_name} {record.semester ? `— Sem ${record.semester}` : ""}</p>
                      {record.description && <p className="text-xs text-slate-500 truncate max-w-sm">{record.description}</p>}
                      {record.department && <p className="text-xs text-indigo-500">{record.department}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={TYPE_COLORS[record.resource_type] || "bg-gray-100"}>{record.resource_type}</Badge>
                      <Button size="sm" variant="outline" onClick={() => { setEditingId(record.id); setEditData({ ...record }); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteMutation.mutate(record.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}