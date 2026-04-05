
const mongoose = require('mongoose')
require('dotenv').config()
const Student = require('./models/Student')

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const student = new Student({
    name: 'Sanjay',
    email: 'sanjay@test.com',
    rollNumber: '2021CS001',
    password: '2000-01-01',
    department: 'Computer Science',
    year: '2'
  })
  await student.save()
  console.log('✅ Student created!')
  process.exit()
})