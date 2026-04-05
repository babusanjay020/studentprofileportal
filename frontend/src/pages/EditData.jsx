import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Calendar, TrendingUp, FileText, BookOpen, Trash2 } from "lucide-react";
import { getAttendance, deleteAttendance, getScores, deleteScore, getQuestionPapers, deleteQuestionPaper, getResources, deleteResource, getAllStudents } from "../api/studentApi";

export default function EditData() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [attendance, setAttendance] = useState([]);
  const [scores, setScores] = useState([]);
  const [papers, setPapers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'teacher') {
      navigate('/dashboard');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const allStudents = await getAllStudents();

      const attendancePromises = allStudents.map(s => getAttendance(s._id));
      const scorePromises = allStudents.map(s => getScores(s._id));

      const attendanceArrays = await Promise.all(attendancePromises);
      const scoreArrays = await Promise.all(scorePromises);

      const [pp, rs] = await Promise.all([
        getQuestionPapers(),
        getResources(),
      ]);

      setAttendance(attendanceArrays.flat());
      setScores(scoreArrays.flat());
      setPapers(pp);
      setResources(rs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDeleteAttendance = async (id) => {
    await deleteAttendance(id);
    fetchAllData();
  };

  const handleDeleteScore = async (id) => {
    await deleteScore(id);
    fetchAllData();
  };

  const handleDeletePaper = async (id) => {
    await deleteQuestionPaper(id);
    fetchAllData();
  };

  const handleDeleteResource = async (id) => {
    await deleteResource(id);
    fetchAllData();
  };

  const tabs = [
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "scores", label: "Scores", icon: TrendingUp },
    { id: "papers", label: "Papers", icon: FileText },
    { id: "resources", label: "Resources", icon: BookOpen },
  ];

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
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Pencil className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Data</h1>
            <p className="text-slate-600">View and delete existing records</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="space-y-4">
            {attendance.length === 0 ? (
              <div className="text-center text-slate-500 py-12">No attendance records found!</div>
            ) : (
              attendance.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                    <p className="text-sm text-slate-500">{item.attendedClasses}/{item.totalClasses} classes — {item.percentage}%</p>
                    <p className="text-xs text-slate-400">Student ID: {item.studentId}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAttendance(item._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === "scores" && (
          <div className="space-y-4">
            {scores.length === 0 ? (
              <div className="text-center text-slate-500 py-12">No scores found!</div>
            ) : (
              scores.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                    <p className="text-sm text-slate-500">Marks: {item.marks}/{item.totalMarks} — Grade: {item.grade} — Semester: {item.semester}</p>
                    <p className="text-xs text-slate-400">Student ID: {item.studentId}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteScore(item._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Papers Tab */}
        {activeTab === "papers" && (
          <div className="space-y-4">
            {papers.length === 0 ? (
              <div className="text-center text-slate-500 py-12">No question papers found!</div>
            ) : (
              papers.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                    <p className="text-sm text-slate-500">Year: {item.year} — Semester: {item.semester} — {item.department}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePaper(item._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            {resources.length === 0 ? (
              <div className="text-center text-slate-500 py-12">No resources found!</div>
            ) : (
              resources.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.subject} — {item.department} — Semester: {item.semester}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteResource(item._id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}