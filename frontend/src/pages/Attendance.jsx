import React, { useState, useEffect } from "react";
import { getAttendance, addAttendance, deleteAttendance, getAllStudents } from "../api/studentApi";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [activeYear, setActiveYear] = useState("1");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    totalClasses: "",
    attendedClasses: "",
  });

  const studentId = localStorage.getItem("studentId");
  const role = localStorage.getItem("role");
  const teacherDepartment = localStorage.getItem("department");

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
        const attendanceArrays = await Promise.all(
          deptStudents.map(s => getAttendance(s._id))
        );
        setAttendance(attendanceArrays.flat());
      } else {
        const data = await getAttendance(studentId);
        setAttendance(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStudentAttendance = (studentId) => {
    return attendance.filter(a => a.studentId === studentId);
  };

  const getOverallAttendance = (studentId) => {
    const studentAtt = getStudentAttendance(studentId);
    if (studentAtt.length === 0) return 0;
    const total = studentAtt.reduce((sum, a) => sum + a.percentage, 0);
    return (total / studentAtt.length).toFixed(1);
  };

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

  // Teacher View
  if (role === 'teacher') {
    const yearStudents = students.filter(s => s.year === activeYear);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
              <p className="text-sm text-slate-500">{teacherDepartment}</p>
            </div>
            {selectedStudent && (
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 text-sm"
              >
                ← Back to List
              </button>
            )}
          </div>

          {/* Student Detail View */}
          {selectedStudent ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">{selectedStudent.name}</h2>
                    <p className="text-sm text-slate-500">{selectedStudent.rollNumber}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-indigo-600">{getOverallAttendance(selectedStudent._id)}%</p>
                    <p className="text-xs text-slate-500">Overall</p>
                  </div>
                </div>
              </div>

              {/* Subject wise attendance */}
              <div className="space-y-3">
                {getStudentAttendance(selectedStudent._id).length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No attendance records!</div>
                ) : (
                  getStudentAttendance(selectedStudent._id).map(item => (
                    <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-800">{item.subject}</h3>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Attended: {item.attendedClasses}/{item.totalClasses}</span>
                        <span className={item.percentage >= 75 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Year Tabs */}
              <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
                {["1", "2", "3", "4"].map(year => (
                  <button
                    key={year}
                    onClick={() => setActiveYear(year)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeYear === year
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Year {year}
                  </button>
                ))}
              </div>

              {/* Students List */}
              {yearStudents.length === 0 ? (
                <div className="text-center text-slate-500 py-12">
                  No students found in Year {activeYear}!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearStudents.map(student => {
                    const overall = getOverallAttendance(student._id);
                    return (
                      <div
                        key={student._id}
                        onClick={() => setSelectedStudent(student)}
                        className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                            {student.name[0]}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.rollNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${Number(overall) >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                              {overall}%
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${Number(overall) >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${overall}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-right">
                          {getStudentAttendance(student._id).length} subjects → Click to view
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Student View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
        </div>

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
                  <h3 className="font-semibold text-slate-800">{item.subject}</h3>
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