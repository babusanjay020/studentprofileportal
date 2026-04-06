import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, FileText, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getProfile, getAttendance, getScores } from "../api/studentApi";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentData, attData, scoreData] = await Promise.all([
        getProfile(studentId),
        getAttendance(studentId),
        getScores(studentId),
      ]);
      setStudent(studentData);
      setAttendance(attData);
      setScores(scoreData);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate overall attendance
  const avgAttendance = attendance.length > 0
    ? (attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length).toFixed(1)
    : 0;

  // Calculate SGPA for each semester
  const gradePoints = { 'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0 };
  const semesterScores = scores.filter(s => s.examType === 'Semester');
  const semesters = [...new Set(semesterScores.map(s => s.semester))].sort();

  const getSGPA = (sem) => {
    const semScores = semesterScores.filter(s => s.semester === sem);
    if (semScores.length === 0) return 'N/A';
    const total = semScores.reduce((sum, s) => sum + (gradePoints[s.grade] || 0), 0);
    return (total / semScores.length).toFixed(2);
  };

  // Mid exam scores
  const midExam1Scores = scores.filter(s => s.examType === 'Mid Exam 1');
  const midExam2Scores = scores.filter(s => s.examType === 'Mid Exam 2');

  const getMidAvg = (midScores) => {
    if (midScores.length === 0) return 'N/A';
    const total = midScores.reduce((sum, s) => sum + (s.marks / s.totalMarks * 100), 0);
    return (total / midScores.length).toFixed(1);
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const quickLinks = [
    { title: "Attendance", desc: "View subject-wise attendance", icon: Calendar, path: "/attendance", color: "from-blue-500 to-blue-600" },
    { title: "Scores", desc: "Check semester results", icon: TrendingUp, path: "/scores", color: "from-emerald-500 to-emerald-600" },
    { title: "Question Papers", desc: "Previous year papers", icon: FileText, path: "/questionpapers", color: "from-violet-500 to-violet-600" },
    { title: "Resources", desc: "Study materials", icon: BookOpen, path: "/resources", color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-8 text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
            <p className="text-indigo-200">Roll No: {student.rollNumber} | {student.department}</p>
          </div>
          <div className="absolute bottom-4 right-8 opacity-20">
            <GraduationCap className="w-32 h-32" />
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Name", value: student.name },
            { label: "Email", value: student.email },
            { label: "Department", value: student.department },
            { label: "Year", value: `Year ${student.year}` },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="font-semibold text-slate-800 mt-1 text-sm truncate">{item.value || 'N/A'}</p>
            </div>
          ))}
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Attendance Summary</h2>
          </div>
          {attendance.length === 0 ? (
            <p className="text-slate-500 text-sm">No attendance records yet!</p>
          ) : (
            <>
              {/* Overall */}
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-700">Overall Attendance</span>
                  <span className={`text-lg font-bold ${Number(avgAttendance) >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {avgAttendance}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${Number(avgAttendance) >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${avgAttendance}%` }}
                  />
                </div>
              </div>

              {/* Subject wise */}
              <div className="space-y-3">
                {attendance.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <p className="text-sm text-slate-600 w-36 truncate">{item.subject}</p>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium w-12 text-right ${item.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Scores Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Scores Summary</h2>
          </div>
          {scores.length === 0 ? (
            <p className="text-slate-500 text-sm">No scores yet!</p>
          ) : (
            <div className="space-y-6">

              {/* Mid Exam 1 */}
              {midExam1Scores.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-700">Mid Exam 1</h3>
                    <span className="text-sm font-medium text-indigo-600">Avg: {getMidAvg(midExam1Scores)}%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {midExam1Scores.map(item => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{item.subject}</p>
                          <p className="text-xs text-slate-500">Sem {item.semester}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{item.marks}/{item.totalMarks}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.grade === 'S' ? 'bg-purple-100 text-purple-700' :
                            item.grade === 'A' ? 'bg-green-100 text-green-700' :
                            item.grade === 'F' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{item.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mid Exam 2 */}
              {midExam2Scores.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-700">Mid Exam 2</h3>
                    <span className="text-sm font-medium text-indigo-600">Avg: {getMidAvg(midExam2Scores)}%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {midExam2Scores.map(item => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{item.subject}</p>
                          <p className="text-xs text-slate-500">Sem {item.semester}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{item.marks}/{item.totalMarks}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.grade === 'S' ? 'bg-purple-100 text-purple-700' :
                            item.grade === 'A' ? 'bg-green-100 text-green-700' :
                            item.grade === 'F' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{item.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Semester Results with SGPA */}
              {semesters.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Semester Results</h3>
                  {semesters.map(sem => (
                    <div key={sem} className="mb-4">
                      <div className="flex justify-between items-center mb-2 p-3 bg-indigo-50 rounded-lg">
                        <span className="font-medium text-indigo-800">Semester {sem}</span>
                        <span className="text-lg font-bold text-indigo-600">SGPA: {getSGPA(sem)}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {semesterScores.filter(s => s.semester === sem).map(item => (
                          <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-800 text-sm">{item.subject}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-800">{item.marks}/{item.totalMarks}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.grade === 'S' ? 'bg-purple-100 text-purple-700' :
                                item.grade === 'A' ? 'bg-green-100 text-green-700' :
                                item.grade === 'F' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>{item.grade}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((item) => (
            <Link key={item.path} to={item.path}>
              <div className="group border border-slate-100 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}