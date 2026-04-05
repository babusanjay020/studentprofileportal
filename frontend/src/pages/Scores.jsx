import React, { useState, useEffect } from "react";
import { getScores, addScore, deleteScore, getAllStudents } from "../api/studentApi";

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [activeYear, setActiveYear] = useState("1");
  const [activeExamType, setActiveExamType] = useState(null);
  const [semester, setSemester] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentId = localStorage.getItem("studentId");
  const role = localStorage.getItem("role");
  const teacherDepartment = localStorage.getItem("department");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (role === 'teacher') {
        const allStudents = await getAllStudents();
        const deptStudents = allStudents
          .filter(s => s.department === teacherDepartment)
          .sort((a, b) => {
            const getType = (roll) => {
              const code = roll.substring(4, 6);
              if (code === '31') return 1;
              if (code === '35') return 2;
              return 3;
            };
            const typeA = getType(a.rollNumber);
            const typeB = getType(b.rollNumber);
            if (typeA !== typeB) return typeA - typeB;
            return a.rollNumber.localeCompare(b.rollNumber);
          });
        setStudents(deptStudents);
        const scoreArrays = await Promise.all(
          deptStudents.map(s => getScores(s._id))
        );
        setScores(scoreArrays.flat());
      } else {
        const data = await getScores(studentId);
        setScores(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStudentScores = (studentId, examType, sem) => {
    return scores.filter(s =>
      s.studentId === studentId &&
      s.examType === examType &&
      s.semester === Number(sem)
    );
  };

  const calculateSGPA = (studentId, sem) => {
    const semScores = scores.filter(s =>
      s.studentId === studentId &&
      s.examType === 'Semester' &&
      s.semester === Number(sem)
    );
    if (semScores.length === 0) return 'N/A';
    const gradePoints = { 'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0 };
    const total = semScores.reduce((sum, s) => sum + (gradePoints[s.grade] || 0), 0);
    return (total / semScores.length).toFixed(2);
  };

  const getGradeColor = (grade) => {
    const colors = {
      'S': 'bg-purple-100 text-purple-700',
      'A': 'bg-green-100 text-green-700',
      'B': 'bg-blue-100 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-orange-100 text-orange-700',
      'E': 'bg-red-100 text-red-700',
      'F': 'bg-red-200 text-red-800',
    }
    return colors[grade] || 'bg-slate-100 text-slate-700'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Teacher View
  if (role === 'teacher') {
    const yearStudents = students.filter(s => s.year === activeYear);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Scores</h1>
              <p className="text-sm text-slate-500">{teacherDepartment}</p>
            </div>
            {(activeExamType || selectedStudent) && (
              <button
                onClick={() => {
                  if (selectedStudent) {
                    setSelectedStudent(null);
                  } else {
                    setActiveExamType(null);
                    setSemester("");
                  }
                }}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 text-sm"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Year Tabs */}
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
            {["1", "2", "3", "4"].map(year => (
              <button
                key={year}
                onClick={() => {
                  setActiveYear(year);
                  setActiveExamType(null);
                  setSemester("");
                  setSelectedStudent(null);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeYear === year
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Year {year}
              </button>
            ))}
          </div>

          {/* Exam Type Selection */}
          {!activeExamType && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Select Exam Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Mid Exam 1", "Mid Exam 2", "Semester"].map(type => (
                  <div key={type} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-3">{type}</h3>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Semester No."
                        min="1"
                        max="8"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        id={`sem-${type}`}
                      />
                      <button
                        onClick={() => {
                          const sem = document.getElementById(`sem-${type}`).value;
                          if (!sem) {
                            alert('Please enter semester number!');
                            return;
                          }
                          setSemester(sem);
                          setActiveExamType(type);
                          setSelectedStudent(null);
                        }}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Detail View */}
          {activeExamType && selectedStudent && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">{selectedStudent.name}</h2>
                    <p className="text-sm text-slate-500">{selectedStudent.rollNumber}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium text-indigo-600">{activeExamType}</p>
                    <p className="text-xs text-slate-500">Semester {semester}</p>
                  </div>
                </div>
              </div>

              {/* Subject Scores */}
              <div className="space-y-3">
                {getStudentScores(selectedStudent._id, activeExamType, semester).length === 0 ? (
                  <div className="text-center text-slate-500 py-8 bg-white rounded-xl">
                    No scores found!
                  </div>
                ) : (
                  getStudentScores(selectedStudent._id, activeExamType, semester).map(item => (
                    <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                          <p className="text-sm text-slate-500">Marks: {item.marks}/{item.totalMarks}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(item.grade)}`}>
                          {item.grade}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Students List */}
          {activeExamType && !selectedStudent && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {activeExamType} — Semester {semester} — Year {activeYear}
              </h2>

              {yearStudents.length === 0 ? (
                <div className="text-center text-slate-500 py-12">
                  No students found in Year {activeYear}!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearStudents.map(student => {
                    const studentScores = getStudentScores(student._id, activeExamType, semester);
                    const sgpa = activeExamType === 'Semester' ? calculateSGPA(student._id, semester) : null;

                    return (
                      <div
                        key={student._id}
                        onClick={() => setSelectedStudent(student)}
                        className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                            {student.name[0]}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.rollNumber}</p>
                          </div>
                          {activeExamType === 'Semester' && (
                            <div className="text-right">
                              <p className="text-lg font-bold text-indigo-600">{sgpa}</p>
                              <p className="text-xs text-slate-500">SGPA</p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {studentScores.length} subjects → Click to view
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  // Student View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold text-slate-800">Scores</h1>

        {/* Group by exam type */}
        {["Mid Exam 1", "Mid Exam 2", "Semester"].map(examType => {
          const examScores = scores.filter(s => s.examType === examType);
          if (examScores.length === 0) return null;
          return (
            <div key={examType}>
              <h2 className="text-lg font-semibold text-slate-700 mb-3">{examType}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {examScores.map(item => (
                  <div key={item._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGradeColor(item.grade)}`}>
                        {item.grade}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Marks</span>
                        <span>{item.marks}/{item.totalMarks}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Semester</span>
                        <span>{item.semester}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {scores.length === 0 && (
          <div className="text-center text-slate-500 py-12">No scores found!</div>
        )}

      </div>
    </div>
  );
}