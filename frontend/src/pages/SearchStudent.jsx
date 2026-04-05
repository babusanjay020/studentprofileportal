import React, { useState } from "react";
import { Search, User, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { searchStudent, getAttendance, getScores } from "../api/studentApi";

export default function SearchStudent() {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!rollNumber) return;
    setLoading(true);
    try {
      const studentData = await searchStudent(rollNumber);
      if (studentData._id) {
        setStudent(studentData);
        const [att, sc] = await Promise.all([
          getAttendance(studentData._id),
          getScores(studentData._id)
        ]);
        setAttendance(att);
        setScores(sc);
      } else {
        setStudent(null);
        setAttendance([]);
        setScores([]);
      }
    } catch (err) {
      console.error(err);
      setStudent(null);
    }
    setLoading(false);
    setSearched(true);
  };

  const getGradeColor = (grade) => {
    const colors = {
      'O': 'bg-purple-100 text-purple-700',
      'A+': 'bg-green-100 text-green-700',
      'A': 'bg-blue-100 text-blue-700',
      'B+': 'bg-yellow-100 text-yellow-700',
      'B': 'bg-orange-100 text-orange-700',
      'C': 'bg-red-100 text-red-700',
      'F': 'bg-red-200 text-red-800',
    }
    return colors[grade] || 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Search Student</h1>
            <p className="text-sm text-slate-500">Search student profile by roll number</p>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Roll Number (e.g. 24031A0501)"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* No Student Found */}
        {searched && !student && (
          <div className="text-center text-slate-500 py-12 bg-white rounded-xl shadow-sm">
            ❌ No student found with roll number: <strong>{rollNumber}</strong>
          </div>
        )}

        {/* Student Profile */}
        {student && (
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                  {student.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
                  <p className="text-slate-500">{student.rollNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="font-medium text-slate-800">{student.department}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Year</p>
                  <p className="font-medium text-slate-800">{student.year}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-slate-800 text-sm">{student.email}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium text-slate-800">{student.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Attendance</h3>
              </div>
              {attendance.length === 0 ? (
                <p className="text-slate-500 text-sm">No attendance records found!</p>
              ) : (
                <div className="space-y-3">
                  {attendance.map(item => (
                    <div key={item._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.subject}</p>
                        <p className="text-sm text-slate-500">{item.attendedClasses}/{item.totalClasses} classes</p>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                          <div
                            className={`h-2 rounded-full ${item.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className={`text-xs font-medium text-right ${item.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scores */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Scores</h3>
              </div>
              {scores.length === 0 ? (
                <p className="text-slate-500 text-sm">No scores found!</p>
              ) : (
                <div className="space-y-3">
                  {scores.map(item => (
                    <div key={item._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.subject}</p>
                        <p className="text-sm text-slate-500">Marks: {item.marks}/{item.totalMarks} — Semester: {item.semester}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(item.grade)}`}>
                        {item.grade}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}