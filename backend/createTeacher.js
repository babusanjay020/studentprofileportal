const mongoose = require('mongoose')
require('dotenv').config()
const Student = require('./models/Student')
const bcrypt = require('bcryptjs')

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Delete all existing teachers
    await Student.deleteMany({ role: 'teacher' })
    console.log('✅ Old teachers deleted!')
    
    // Create new teacher with hashed password
    const hashedPassword = await bcrypt.hash('teacher123', 10)
    const teacher = new Student({
      name: 'Teacher',
      email: 'teacher@test.com',
      rollNumber: 'TEACHER001',
      password: hashedPassword,
      department: 'Computer Science',
      year: 'N/A',
      role: 'teacher'
    })
    await teacher.save()
    console.log('✅ New teacher created!')
  } catch(err) {
    console.log('❌ Error:', err)
  }
  process.exit()
})