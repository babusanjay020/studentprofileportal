import React from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
          <p className="text-indigo-100">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          {/* Student Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Student</h2>
                <p className="text-sm text-slate-500">Access your academic portal</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/student-login')}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/student-register')}
                className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 font-medium"
              >
                Register
              </button>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Teacher</h2>
                <p className="text-sm text-slate-500">Manage student data</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/teacher-login')}
                className="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/teacher-register')}
                className="flex-1 border border-violet-600 text-violet-600 py-2 rounded-lg hover:bg-violet-50 font-medium"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}