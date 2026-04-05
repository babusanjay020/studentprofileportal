
const mongoose = require('mongoose')

const questionPaperSchema = new mongoose.Schema({
  subject: String,
  year: Number,
  semester: Number,
  department: String,
  fileUrl: String,
  description: String,
}, { timestamps: true })

module.exports = mongoose.model('QuestionPaper', questionPaperSchema)