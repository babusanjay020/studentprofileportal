import React, { useState, useEffect } from "react";
import { getQuestionPapers, addQuestionPaper, deleteQuestionPaper, uploadFile} from "../api/studentApi";

export default function QuestionPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    year: "",
    semester: "",
    department: "",
    fileUrl: "",
    description: "",
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const data = await getQuestionPapers();
      setPapers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addQuestionPaper({
        subject: formData.subject,
        year: Number(formData.year),
        semester: Number(formData.semester),
        department: formData.department,
        fileUrl: formData.fileUrl,
        description: formData.description,
      });
      setFormData({ subject: "", year: "", semester: "", department: "", fileUrl: "", description: "" });
      setShowForm(false);
      fetchPapers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestionPaper(id);
      fetchPapers();
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
          <h1 className="text-2xl font-bold text-slate-800">Question Papers</h1>
          {role === 'teacher' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              {showForm ? "Cancel" : "+ Add Paper"}
            </button>
          )}
        </div>

        {/* Add Form - Teacher Only */}
        {role === 'teacher' && showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Add Question Paper</h2>
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
                placeholder="Year (e.g. 2023)"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
              </select>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Upload File (PDF/Image)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                       const data = await uploadFile(file);
                       setFormData({ ...formData, fileUrl: data.fileUrl });
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {formData.fileUrl && (
                  <p className="text-xs text-green-600">✅ File uploaded successfully!</p>
                )}
             </div>
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Question Paper
              </button>
            </form>
          </div>
        )}

        {/* Papers List */}
        {papers.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            No question papers found!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {papers.map((item) => (
              <div key={item._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-slate-800">{item.subject}</h3>
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
                    <span>Year</span>
                    <span>{item.year}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Semester</span>
                    <span>{item.semester}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Department</span>
                    <span>{item.department}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-slate-500">{item.description}</p>
                  )}
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 text-sm font-medium"
                    >
                      📄 View Paper
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}