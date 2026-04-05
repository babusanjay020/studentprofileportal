import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { loginStudent } from '../api/studentApi'

export default function VerifyProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    roll_number: "",
    date_of_birth: "",
  });

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      navigate('/dashboard');
    } else {
      setUser({ email: 'guest' });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginStudent({
        email: formData.roll_number,
        password: formData.date_of_birth
      });
      if (data.student) {
        localStorage.setItem('studentId', data.student._id);
        localStorage.setItem('role', data.student.role);
        navigate('/dashboard');
      } else {
        toast.error(data.message || "User not found!");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center p-4">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
          <p className="text-indigo-100">Login to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-4">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-xl font-bold">Login</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            Enter your Roll Number and Password to access the portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Roll Number *
              </label>
              <input
                type="text"
                placeholder="e.g., 2021CS001"
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Password *
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                autoComplete="new_password"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2 rounded-lg font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-4 text-center border-t pt-4">
            <p className="text-sm text-slate-500">
              New student?{" "}
              <button
                onClick={() => navigate('/register')}
                className="text-indigo-600 font-medium hover:underline"
              >
                Register here
              </button>
            </p>
          </div>

          {/* Teacher Login Info */}
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 font-medium mb-1">Teacher Login:</p>
            <p className="text-xs text-slate-500">Roll Number: TEACHER001</p>
            <p className="text-xs text-slate-500">Password: teacher123</p>
          </div>
        </div>
      </div>
    </div>
  );
}