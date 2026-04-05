
const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subject: String,
  marks: Number,
  totalMarks: Number,
  grade: String,
  semester: Number,
}, { timestamps: true })

module.exports = mongoose.model('Score', scoreSchema)