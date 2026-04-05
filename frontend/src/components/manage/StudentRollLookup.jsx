const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";

/**
 * StudentRollLookup
 * Props:
 *   onStudentFound(student) — called with student user object when verified
 *   currentUser — to check department restriction
 * 
 * Exposes: roll number input → lookup → shows name + confirms department
 */
export default function StudentRollLookup({ onStudentFound, currentUser }) {
  const [rollNumber, setRollNumber] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | found | error
  const [student, setStudent] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hod";

  const handleLookup = async () => {
    if (!rollNumber.trim()) return;
    setStatus("loading");
    setStudent(null);
    setErrorMsg("");

    const results = await db.entities.User.filter({ roll_number: rollNumber.trim() });
    const found = results[0];

    if (!found) {
      setStatus("error");
      setErrorMsg("No student found with this roll number.");
      onStudentFound(null);
      return;
    }

    // Department check for lecturers
    if (!isAdmin && currentUser?.department && found.department !== currentUser.department) {
      setStatus("error");
      setErrorMsg(`This student belongs to "${found.department || 'another'}" dept. You can only manage ${currentUser.department} students.`);
      onStudentFound(null);
      return;
    }

    setStudent(found);
    setStatus("found");
    onStudentFound(found);
  };

  const handleClear = () => {
    setRollNumber("");
    setStudent(null);
    setStatus("idle");
    setErrorMsg("");
    onStudentFound(null);
  };

  return (
    <div className="space-y-2">
      <Label>Roll Number *</Label>
      <div className="flex gap-2">
        <Input
          placeholder="e.g., 2021CS001"
          value={rollNumber}
          onChange={e => { setRollNumber(e.target.value); if (status !== "idle") handleClear(); setRollNumber(e.target.value); }}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleLookup())}
          className={status === "found" ? "border-green-400 bg-green-50" : status === "error" ? "border-red-400 bg-red-50" : ""}
        />
        {status === "found" ? (
          <Button type="button" variant="outline" onClick={handleClear} className="text-red-500 shrink-0">
            <XCircle className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleLookup} disabled={status === "loading" || !rollNumber.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {status === "found" && student && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span><strong>{student.full_name}</strong> — {student.department} {student.semester ? `• Sem ${student.semester}` : ""}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}