const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const studentRoutes = require('./routes/studentRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const scoreRoutes = require('./routes/scoreRoutes')
const questionPaperRoutes = require('./routes/questionPaperRoutes')
const resourceRoutes = require('./routes/resourceRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

const app = express()

// Middleware first!
app.use(cors())
app.use(express.json())

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err))

// Routes
app.use('/api/students', studentRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/scores', scoreRoutes)
app.use('/api/questionpapers', questionPaperRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/', (req, res) => {
  res.send('Server is running!')
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`)
})