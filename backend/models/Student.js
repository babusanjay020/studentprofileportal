
const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  rollNumber: String,
  department: String,
  year: String,
  phone: String,
  address: String,
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)