import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAttendance, addAttendance, deleteAttendance, getAllStudents } from "../api/studentApi";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    totalClasses: "",
    attendedClasses: "",
  });

  const studentId = localStorage.getItem("studentId");
  const role = localStorage.getItem("role");
  const teacherDepartment = localStorage.getItem("department");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (role === 'teacher') {
        // Teacher sees all students' attendance
        const allStudents = await getAllStudents();
        const deptStudents = allStudents
  .filter(s => s.department === teacherDepartment)
  .sort((a, b) => {
    const getType = (roll) => {
      const code = roll.substring(4, 6);
      if (code === '31') return 1;
      if (code === '35') return 2;
      return 3;
    };
    const typeA = getType(a.rollNumber);
    const typeB = getType(b.rollNumber);
    if (typeA !== typeB) return typeA - typeB;
    return a.rollNumber.localeCompare(b.rollNumber);
  });
        setStudents(deptStudents);
        const attendanceArrays = await Promise.all(
          deptStudents.map(s => getAttendance(s._id))
        );
        setAttendance(attendanceArrays.flat());
      } else {
        // Student sees only their own attendance
        const data = await getAttendance(studentId);
        setAttendance(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s._id === studentId)
    return student ? `${student.name} (${student.rollNumber})` : ''
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const percentage = ((formData.attendedClasses / formData.totalClasses) * 100).toFixed(1);
      await addAttendance({
        studentId,
        subject: formData.subject,
        totalClasses: Number(formData.totalClasses),
        attendedClasses: Number(formData.attendedClasses),
        percentage: Number(percentage),
      });
      setFormData({ subject: "", totalClasses: "", attendedClasses: "" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
            {role === 'teacher' && (
              <p className="text-sm text-slate-500">
                Showing all students in {teacherDepartment}
              </p>
            )}
          </div>
          {role === 'teacher' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {showForm ? "Cancel" : "+ Add Subject"}
            </button>
          )}
        </div>

        {/* Add Form - Teacher Only */}
        {role === 'teacher' && showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Add Attendance</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                type="text"
                placeholder="Subject Name"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Total Classes"
                value={formData.totalClasses}
                onChange={(e) => setFormData({ ...formData, totalClasses: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Attended Classes"
                value={formData.attendedClasses}
                onChange={(e) => setFormData({ ...formData, attendedClasses: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Attendance
              </button>
            </form>
          </div>
        )}

        {/* Attendance List */}
        {attendance.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            No attendance records found!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendance.map((item) => (
              <div key={item._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                    {role === 'teacher' && (
                      <p className="text-xs text-indigo-600 font-medium mt-1">
                        👤 {getStudentName(item.studentId)}
                      </p>
                    )}
                  </div>
                  {role === 'teacher' && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Attended</span>
                    <span>{item.attendedClasses}/{item.totalClasses}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className={`text-sm font-medium ${item.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.percentage}% {item.percentage >= 75 ? '✅' : '⚠️ Low'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}