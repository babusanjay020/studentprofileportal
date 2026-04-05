
const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subject: String,
  totalClasses: Number,
  attendedClasses: Number,
  percentage: Number,
}, { timestamps: true })

module.exports = mongoose.model('Attendance', attendanceSchema)