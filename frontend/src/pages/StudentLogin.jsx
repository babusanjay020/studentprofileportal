import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { loginStudent } from '../api/studentApi'

export default function StudentLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginStudent({
        email: formData.rollNumber,
        password: formData.password
      });
      if (data.student && data.student.role === 'student') {
        localStorage.setItem('studentId', data.student._id);
        localStorage.setItem('role', data.student.role);
        navigate('/dashboard');
      } else if (data.student && data.student.role === 'teacher') {
        toast.error("Please use Teacher login!");
      } else {
        toast.error(data.message || "Student not found!");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Login</h1>
          <p className="text-blue-100">Login to access your portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Roll Number *</label>
              <input
                type="text"
                placeholder="e.g., 2021CS001"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password *</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="new-password"
                className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center border-t pt-4 space-y-2">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/student-register')}
                className="text-blue-600 font-medium hover:underline"
              >
                Register here
              </button>
            </p>
            <p className="text-sm text-slate-500">
              <button
                onClick={() => navigate('/')}
                className="text-slate-400 hover:underline"
              >
                ← Back to Home
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}