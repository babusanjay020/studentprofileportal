
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { registerStudent } from '../api/studentApi'

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    phone: "",
  });

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const data = await registerStudent({
        name: formData.name,
        email: formData.email,
        rollNumber: formData.rollNumber,
        password: formData.password,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
      });
      if (data.student) {
        toast.success("Registered successfully!");
        navigate('/');
      } else {
        toast.error(data.message || "Registration failed!");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
          <p className="text-indigo-100">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-4">
            <UserPlus className="w-5 h-5" />
            <h2 className="text-xl font-bold">Register</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            />
            <input
              type="text"
              placeholder="Roll Number * (e.g. 2021CS001)"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            />
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            >
              <option value="">Select Department *</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Electronics Engineering">Electronics Engineering</option>
            </select>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            >
              <option value="">Select Year *</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
            />
            <input
              type="password"
              placeholder="Password *"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2 rounded-lg font-medium"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/')}
                className="text-indigo-600 font-medium hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}