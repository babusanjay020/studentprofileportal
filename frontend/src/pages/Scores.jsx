import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScores, addScore, deleteScore, getAllStudents } from "../api/studentApi";

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    marks: "",
    totalMarks: "",
    grade: "",
    semester: "",
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
        const scoreArrays = await Promise.all(
          deptStudents.map(s => getScores(s._id))
        );
        setScores(scoreArrays.flat());
      } else {
        const data = await getScores(studentId);
        setScores(data);
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
      await addScore({
        studentId,
        subject: formData.subject,
        marks: Number(formData.marks),
        totalMarks: Number(formData.totalMarks),
        grade: formData.grade,
        semester: Number(formData.semester),
      });
      setFormData({ subject: "", marks: "", totalMarks: "", grade: "", semester: "" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteScore(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      's': 'bg-purple-100 text-purple-700',
      'A': 'bg-green-100 text-green-700',
      'B': 'bg-blue-100 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-orange-100 text-orange-700',
      'E': 'bg-red-100 text-red-700',
      'F': 'bg-red-200 text-red-800',
    }
    return colors[grade] || 'bg-slate-100 text-slate-700'
  }

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
            <h1 className="text-2xl font-bold text-slate-800">Scores</h1>
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
              {showForm ? "Cancel" : "+ Add Score"}
            </button>
          )}
        </div>

        {/* Add Form - Teacher Only */}
        {role === 'teacher' && showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Add Score</h2>
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
                placeholder="Marks Obtained"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Grade</option>
                <option value="S">S (Superior)</option>
                <option value="A">A (Excellent)</option>
                <option value="B">B(Very Good)</option>
                <option value="C">C (Good)</option>
                <option value="D">D (Above Average)</option>
                <option value="E">E (Average)</option>
                <option value="F">F (Fail)</option>
              </select>
              <input
                type="number"
                placeholder="Semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Score
              </button>
            </form>
          </div>
        )}

        {/* Scores List */}
        {scores.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            No scores found!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scores.map((item) => (
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
                    <span>Marks</span>
                    <span>{item.marks}/{item.totalMarks}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Semester</span>
                    <span>{item.semester}</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(item.grade)}`}>
                    Grade: {item.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}