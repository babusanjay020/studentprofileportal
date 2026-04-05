import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Calendar, TrendingUp, FileText, BookOpen, Search } from "lucide-react";
import { addAttendance, addScore, addQuestionPaper, addResource, getAllStudents } from "../api/studentApi";

export default function ManageData() {
  const role = localStorage.getItem("role");
  const teacherDepartment = localStorage.getItem("department");

  const [activeTab, setActiveTab] = useState("attendance");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [individualAttendance, setIndividualAttendance] = useState({});
  const [individualScores, setIndividualScores] = useState({});
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState({
    subject: "", totalClasses: ""
  });
  const [scoreData, setScoreData] = useState({
    subject: "", totalMarks: "", semester: ""
  });
  const [paperData, setPaperData] = useState({
    subject: "", year: "", semester: "", department: "", fileUrl: "", description: ""
  });
  const [resourceData, setResourceData] = useState({
    title: "", subject: "", department: "", semester: "", type: "", fileUrl: "", description: ""
  });

  useEffect(() => {
    if (role !== 'teacher') {
      navigate('/dashboard');
    } else {
      fetchAllStudents();
    }
  }, []);

  const fetchAllStudents = async () => {
    try {
      const data = await getAllStudents();
      setAllStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSearch = () => {
    if (!selectedYear) {
      showMessage("❌ Please select year!");
      return;
    }
    const filtered = allStudents
  .filter(s => s.department === teacherDepartment && s.year === selectedYear)
  .sort((a, b) => {
    const getType = (roll) => {
      const code = roll.substring(4, 6);
      if (code === '31') return 1; // Regular first
      if (code === '35') return 2; // Lateral entry after
      return 3; // Others last
    };
    const typeA = getType(a.rollNumber);
    const typeB = getType(b.rollNumber);
    if (typeA !== typeB) return typeA - typeB;
    return a.rollNumber.localeCompare(b.rollNumber);
  });
    if (filtered.length === 0) {
      showMessage("❌ No students found for this department and year!");
    } else {
      showMessage(`✅ Found ${filtered.length} student(s)!`);
    }
    setFilteredStudents(filtered);
    setIndividualAttendance({});
    setIndividualScores({});
  };

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (filteredStudents.length === 0) {
      showMessage("❌ Please search students first!");
      return;
    }
    setLoading(true);
    try {
      await Promise.all(filteredStudents.map(student => {
        const attended = individualAttendance[student._id] || 0;
        const percent = ((attended / attendanceData.totalClasses) * 100).toFixed(1);
        return addAttendance({
          studentId: student._id,
          subject: attendanceData.subject,
          totalClasses: Number(attendanceData.totalClasses),
          attendedClasses: Number(attended),
          percentage: Number(percent),
        });
      }));
      setAttendanceData({ subject: "", totalClasses: "" });
      setIndividualAttendance({});
      showMessage(`✅ Attendance added for ${filteredStudents.length} students!`);
    } catch (err) {
      showMessage("❌ Error adding attendance!");
    }
    setLoading(false);
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    if (filteredStudents.length === 0) {
      showMessage("❌ Please search students first!");
      return;
    }
    setLoading(true);
    try {
      await Promise.all(filteredStudents.map(student => {
        const marks = individualScores[student._id]?.marks || 0;
        const grade = individualScores[student._id]?.grade || 'F';
        return addScore({
          studentId: student._id,
          subject: scoreData.subject,
          marks: Number(marks),
          totalMarks: Number(scoreData.totalMarks),
          grade: grade,
          semester: Number(scoreData.semester),
        });
      }));
      setScoreData({ subject: "", totalMarks: "", semester: "" });
      setIndividualScores({});
      showMessage(`✅ Scores added for ${filteredStudents.length} students!`);
    } catch (err) {
      showMessage("❌ Error adding scores!");
    }
    setLoading(false);
  };

  const handleAddPaper = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addQuestionPaper({
        subject: paperData.subject,
        year: Number(paperData.year),
        semester: Number(paperData.semester),
        department: paperData.department,
        fileUrl: paperData.fileUrl,
        description: paperData.description,
      });
      setPaperData({ subject: "", year: "", semester: "", department: "", fileUrl: "", description: "" });
      showMessage("✅ Question paper added successfully!");
    } catch (err) {
      showMessage("❌ Error adding paper!");
    }
    setLoading(false);
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addResource({
        title: resourceData.title,
        subject: resourceData.subject,
        department: resourceData.department,
        semester: Number(resourceData.semester),
        type: resourceData.type,
        fileUrl: resourceData.fileUrl,
        description: resourceData.description,
      });
      setResourceData({ title: "", subject: "", department: "", semester: "", type: "", fileUrl: "", description: "" });
      showMessage("✅ Resource added successfully!");
    } catch (err) {
      showMessage("❌ Error adding resource!");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "scores", label: "Scores", icon: TrendingUp },
    { id: "papers", label: "Papers", icon: FileText },
    { id: "resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Data</h1>
            <p className="text-slate-600">Add records for students by department and year</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Search Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">🔍 Search Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="w-full border rounded-lg px-3 py-2 bg-slate-100 text-slate-700">
              🏫 Department: <strong>{teacherDepartment}</strong>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Students
            </button>
          </div>

          {/* Students List */}
          {filteredStudents.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Found {filteredStudents.length} student(s):
              </p>
              <div className="space-y-2">
                {filteredStudents.map(student => (
                  <div key={student._id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{student.name}</p>
                      <p className="text-sm text-slate-500">{student.rollNumber} — Year {student.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Attendance Form */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-2">Add Attendance</h2>
            {filteredStudents.length === 0 ? (
              <p className="text-slate-500 text-sm">Please search students first!</p>
            ) : (
              <form onSubmit={handleAddAttendance} className="space-y-4">
                <input type="text" placeholder="Subject Name" value={attendanceData.subject}
                  onChange={(e) => setAttendanceData({ ...attendanceData, subject: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2" required />
                <input type="number" placeholder="Total Classes" value={attendanceData.totalClasses}
                  onChange={(e) => setAttendanceData({ ...attendanceData, totalClasses: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2" required />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Enter attended classes for each student:</p>
                  {filteredStudents.map(student => (
                    <div key={student._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {student.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.rollNumber}</p>
                      </div>
                      <input
                        type="number"
                        placeholder="Attended"
                        min="0"
                        value={individualAttendance[student._id] || ""}
                        onChange={(e) => setIndividualAttendance({
                          ...individualAttendance,
                          [student._id]: e.target.value
                        })}
                        className="w-24 border rounded-lg px-2 py-1 text-sm"
                        required
                      />
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  {loading ? "Adding..." : `Add Attendance for ${filteredStudents.length} Students`}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Score Form */}
        {activeTab === "scores" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-2">Add Scores</h2>
            {filteredStudents.length === 0 ? (
              <p className="text-slate-500 text-sm">Please search students first!</p>
            ) : (
              <form onSubmit={handleAddScore} className="space-y-4">
                <input type="text" placeholder="Subject Name" value={scoreData.subject}
                  onChange={(e) => setScoreData({ ...scoreData, subject: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2" required />
                <input type="number" placeholder="Total Marks" value={scoreData.totalMarks}
                  onChange={(e) => setScoreData({ ...scoreData, totalMarks: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2" required />
                <input type="number" placeholder="Semester" value={scoreData.semester}
                  onChange={(e) => setScoreData({ ...scoreData, semester: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2" required />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Enter marks and grade for each student:</p>
                  {filteredStudents.map(student => (
                    <div key={student._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {student.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.rollNumber}</p>
                      </div>
                      <input
                        type="number"
                        placeholder="Marks"
                        min="0"
                        value={individualScores[student._id]?.marks || ""}
                        onChange={(e) => setIndividualScores({
                          ...individualScores,
                          [student._id]: { ...individualScores[student._id], marks: e.target.value }
                        })}
                        className="w-20 border rounded-lg px-2 py-1 text-sm"
                        required
                      />
                      <select
                        value={individualScores[student._id]?.grade || ""}
                        onChange={(e) => setIndividualScores({
                          ...individualScores,
                          [student._id]: { ...individualScores[student._id], grade: e.target.value }
                        })}
                        className="w-24 border rounded-lg px-2 py-1 text-sm"
                        required
                      >
                        <option value="">Grade</option>
                        <option value="O">O</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  {loading ? "Adding..." : `Add Scores for ${filteredStudents.length} Students`}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Question Paper Form */}
        {activeTab === "papers" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Add Question Paper</h2>
            <form onSubmit={handleAddPaper} className="space-y-4">
              <input type="text" placeholder="Subject Name" value={paperData.subject}
                onChange={(e) => setPaperData({ ...paperData, subject: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
              <input type="number" placeholder="Year (e.g. 2023)" value={paperData.year}
                onChange={(e) => setPaperData({ ...paperData, year: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
              <input type="number" placeholder="Semester" value={paperData.semester}
                onChange={(e) => setPaperData({ ...paperData, semester: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
              <select value={paperData.department}
                onChange={(e) => setPaperData({ ...paperData, department: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required>
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
              </select>
              <input type="text" placeholder="File URL" value={paperData.fileUrl}
                onChange={(e) => setPaperData({ ...paperData, fileUrl: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
              <textarea placeholder="Description (optional)" value={paperData.description}
                onChange={(e) => setPaperData({ ...paperData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" rows={3} />
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                {loading ? "Adding..." : "Add Question Paper"}
              </button>
            </form>
          </div>
        )}

        {/* Resource Form */}
        {activeTab === "resources" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Add Resource</h2>
            <form onSubmit={handleAddResource} className="space-y-4">
              <input type="text" placeholder="Title" value={resourceData.title}
                onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
              <input type="text" placeholder="Subject" value={resourceData.subject}
                onChange={(e) => setResourceData({ ...resourceData, subject: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
              <select value={resourceData.department}
                onChange={(e) => setResourceData({ ...resourceData, department: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required>
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
              </select>
              <input type="number" placeholder="Semester" value={resourceData.semester}
                onChange={(e) => setResourceData({ ...resourceData, semester: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required />
              <select value={resourceData.type}
                onChange={(e) => setResourceData({ ...resourceData, type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" required>
                <option value="">Select Type</option>
                <option value="Notes">Notes</option>
                <option value="Video">Video</option>
                <option value="Book">Book</option>
                <option value="Assignment">Assignment</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" placeholder="File URL" value={resourceData.fileUrl}
                onChange={(e) => setResourceData({ ...resourceData, fileUrl: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />
              <textarea placeholder="Description (optional)" value={resourceData.description}
                onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" rows={3} />
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                {loading ? "Adding..." : "Add Resource"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}