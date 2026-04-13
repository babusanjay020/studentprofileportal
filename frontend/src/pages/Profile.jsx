import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, BookOpen, Save } from "lucide-react";
import { toast } from "sonner";
import { getProfile, updateProfile } from "../api/studentApi";

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
  });

  const studentId = localStorage.getItem("studentId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentId) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile(studentId);
      setStudent(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        department: data.department || "",
        year: data.year || "",
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await updateProfile(studentId, formData);
      if (data.student) {
        toast.success("Profile updated successfully!");
        setStudent(data.student);
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (err) {
      toast.error("Error updating profile!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-2xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            <p className="text-sm text-slate-500">View and edit your profile</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
  {student?.name?.[0]?.toUpperCase()}
</div>
              <div>
                <h2 className="text-xl font-bold text-white">{student?.name}</h2>
                <p className="text-indigo-200">{student?.rollNumber}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white capitalize">
                  {student?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex-1 outline-none text-sm"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 outline-none text-sm"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 outline-none text-sm"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="flex-1 outline-none text-sm bg-transparent"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics Engineering">Electronics Engineering</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Year</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="flex-1 outline-none text-sm bg-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}