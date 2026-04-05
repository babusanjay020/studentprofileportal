import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { registerStudent } from '../api/studentApi'

export default function TeacherRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    password: "",
    confirmPassword: "",
    department: "",
    phone: "",
    secretCode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check secret code
    if (formData.secretCode !== 'UCENJNTUK') {
      toast.error("Invalid secret code! Contact admin.");
      return;
    }

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
        year: 'N/A',
        phone: formData.phone,
        role: 'teacher'
      });
      if (data.student) {
        toast.success("Registered successfully!");
        navigate('/teacher-login');
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
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-violet-700 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Teacher Register</h1>
          <p className="text-violet-100">Create your teacher account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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
              placeholder="Teacher ID * (e.g. TEACHER001)"
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
              autoComplete="new-password"
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              autoComplete="new-password"
              className="w-full border rounded-lg px-3 py-2 bg-slate-50"
              required
            />
            {/* Secret Code */}
            <div className="border-t pt-4">
              <p className="text-sm text-slate-500 mb-2">🔐 Enter the secret code provided by admin:</p>
              <input
                type="password"
                placeholder="Secret Code *"
                value={formData.secretCode}
                onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                autoComplete="new-password"
                className="w-full border rounded-lg px-3 py-2 bg-slate-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 font-medium"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center border-t pt-4 space-y-2">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/teacher-login')}
                className="text-violet-600 font-medium hover:underline"
              >
                Login here
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