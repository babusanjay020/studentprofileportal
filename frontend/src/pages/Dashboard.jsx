
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, FileText, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getProfile } from "../api/studentApi";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/verifyprofile');
      return;
    }
    getProfile(studentId).then(data => {
      setStudent(data);
    }).catch(() => {
      navigate('/verifyprofile');
    });
  }, [navigate]);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const quickLinks = [
    { title: "Attendance", desc: "View subject-wise attendance", icon: Calendar, page: "attendance", color: "from-blue-500 to-blue-600" },
    { title: "Scores", desc: "Check semester results", icon: TrendingUp, page: "scores", color: "from-emerald-500 to-emerald-600" },
    { title: "Question Papers", desc: "Previous year papers", icon: FileText, page: "questionpapers", color: "from-violet-500 to-violet-600" },
    { title: "Resources", desc: "Study materials", icon: BookOpen, page: "resources", color: "from-amber-500 to-amber-600" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Name", value: student.name },
            { label: "Email", value: student.email },
            { label: "Department", value: student.department },
            { label: "Year", value: student.year },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="font-semibold text-slate-800 mt-1">{item.value || 'N/A'}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((item) => (
            <Link key={item.page} to={`/${item.page}`}>
              <div className="group border border-slate-100 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}