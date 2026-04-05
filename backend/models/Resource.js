const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  title: String,
  subject: String,
  department: String,
  semester: Number,
  fileUrl: String,
  description: String,
  type: String,
}, { timestamps: true })

module.exports = mongoose.model('Resource', resourceSchema)