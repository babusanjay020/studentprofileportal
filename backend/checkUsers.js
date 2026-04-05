const mongoose = require('mongoose')
require('dotenv').config()
const Student = require('./models/Student')

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await Student.find()
  console.log('All users:', JSON.stringify(users, null, 2))
  process.exit()
})