import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  FileText,
  BookOpen,
  Database,
  Pencil,
  Menu,
  X,
  LogOut,
  GraduationCap,
  User,
  Search
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard",roles:["student","teacher"] },
  { name: "Attendance", icon: Calendar, path: "/attendance",roles:["student"] },
  { name: "Scores", icon: TrendingUp, path: "/scores" ,roles:["student"]},
  { name: "Question Papers", icon: FileText, path: "/questionpapers",roles:["student","teacher"] },
  { name: "Resources", icon: BookOpen, path: "/resources",roles:["student","teacher"] },
  { name: "Search Student", icon: Search, path: "/searchstudent", roles: ["teacher"] },
  { name: "Manage Data", icon: Database, path: "/managedata",roles:["teacher"] },
  { name: "Edit Data", icon: Pencil, path: "/editdata",roles:["teacher"] },
  { name: "Profile", icon: User, path: "/profile", roles: ["student", "teacher"] },
];

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (studentId) {
      fetch(`https://studentprofileportal.onrender.com/api/students/profile/${studentId}`)
        .then(res => res.json())
        .then(data => setStudentName(data.name || "User"))
        .catch(() => setStudentName("User"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800 hidden sm:block">Student Portal</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const adminOnly = ["/managedata", "/editdata"];
                if (adminOnly.includes(item.path) && role !== 'teacher') {
                  return null;
                }
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {/* Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(studentName)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700">
                  {studentName}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const adminOnly = ["/managedata", "/editdata"];
                if (adminOnly.includes(item.path) && role !== 'teacher') {
                  return null;
                }
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}