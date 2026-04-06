import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { getAttendance, deleteAttendance, getScores, deleteScore, getQuestionPapers, deleteQuestionPaper, getResources, deleteResource, getAllStudents } from "../api/studentApi";

export default function EditData() {
  const [activeYear, setActiveYear] = useState("1");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("attendance");
  const [attendance, setAttendance] = useState([]);
  const [scores, setScores] = useState([]);
  const [papers, setPapers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const teacherDepartment = localStorage.getItem("department");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'teacher') {
      navigate('/dashboard');
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
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
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchStudentData = async (student) => {
    try {
      const [att, sc, pp, rs] = await Promise.all([
        getAttendance(student._id),
        getScores(student._id),
        getQuestionPapers(),
        getResources(),
      ]);
      setAttendance(att);
      setScores(sc);
      setPapers(pp);
      setResources(rs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    fetchStudentData(student);
    setActiveTab("attendance");
  };

  const handleDeleteAttendance = async (id) => {
    await deleteAttendance(id);
    fetchStudentData(selectedStudent);
  };

  const handleDeleteScore = async (id) => {
    await deleteScore(id);
    fetchStudentData(selectedStudent);
  };

  const handleDeletePaper = async (id) => {
    await deleteQuestionPaper(id);
    fetchStudentData(selectedStudent);
  };

  const handleDeleteResource = async (id) => {
    await deleteResource(id);
    fetchStudentData(selectedStudent);
  };

  const yearStudents = students.filter(s => s.year === activeYear);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Pencil className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Data</h1>
              <p className="text-slate-600">{teacherDepartment}</p>
            </div>
          </div>
          {selectedStudent && (
            <button
              onClick={() => setSelectedStudent(null)}
              className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 text-sm"
            >
              ← Back to Students
            </button>
          )}
        </div>

        {/* Year Tabs */}
        {!selectedStudent && (
          <>
            <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
              {["1", "2", "3", "4"].map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
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

            {/* Students List */}
            {yearStudents.length === 0 ? (
              <div className="text-center text-slate-500 py-12 bg-white rounded-xl">
                No students found in Year {activeYear}!
              </div>
            ) : (
              <div className="space-y-3">
                {yearStudents.map(student => (
                  <div
                    key={student._id}
                    onClick={() => handleSelectStudent(student)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                      {student.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-sm text-slate-500">{student.rollNumber}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Student Data View */}
        {selectedStudent && (
          <div className="space-y-4">

            {/* Student Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                {selectedStudent.name[0]}
              </div>
              <div>
                <h2 className="font-bold text-slate-800">{selectedStudent.name}</h2>
                <p className="text-sm text-slate-500">{selectedStudent.rollNumber} — Year {selectedStudent.year}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
              {["attendance", "scores", "papers", "resources"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <div className="space-y-3">
                {attendance.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 bg-white rounded-xl">No attendance records!</div>
                ) : (
                  attendance.map(item => (
                    <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                        <p className="text-sm text-slate-500">{item.attendedClasses}/{item.totalClasses} — {item.percentage}%</p>
                      </div>
                      <button onClick={() => handleDeleteAttendance(item._id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Scores Tab */}
            {activeTab === "scores" && (
              <div className="space-y-3">
                {scores.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 bg-white rounded-xl">No scores found!</div>
                ) : (
                  scores.map(item => (
                    <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                        <p className="text-sm text-slate-500">
                          {item.examType} — Marks: {item.marks}/{item.totalMarks} — Grade: {item.grade} — Sem: {item.semester}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteScore(item._id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Papers Tab */}
            {activeTab === "papers" && (
              <div className="space-y-3">
                {papers.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 bg-white rounded-xl">No question papers!</div>
                ) : (
                  papers.map(item => (
                    <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                        <p className="text-sm text-slate-500">Year: {item.year} — Sem: {item.semester} — {item.department}</p>
                      </div>
                      <button onClick={() => handleDeletePaper(item._id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === "resources" && (
              <div className="space-y-3">
                {resources.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 bg-white rounded-xl">No resources!</div>
                ) : (
                  resources.map(item => (
                    <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-slate-800">{item.title}</h3>
                        <p className="text-sm text-slate-500">{item.subject} — {item.department}</p>
                      </div>
                      <button onClick={() => handleDeleteResource(item._id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}