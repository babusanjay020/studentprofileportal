const express = require('express')
const router = express.Router()
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')

// Register Student
router.post('/register', async (req, res) => {
  try {
    const existingStudent = await Student.findOne({ rollNumber: req.body.rollNumber })
    if (existingStudent) {
      return res.status(400).json({ message: '❌ Roll number already registered!' })
    }
    const existingEmail = await Student.findOne({ email: req.body.email })
    if (existingEmail) {
      return res.status(400).json({ message: '❌ Email already registered!' })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const student = new Student({
      ...req.body,
      password: hashedPassword,
    })
    await student.save()
    res.json({ message: '✅ Registered successfully!', student })
  } catch (err) {
    res.status(500).json({ message: '❌ Error registering', error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await Student.findOne({ rollNumber: email })
    if (!user) return res.status(404).json({ message: '❌ User not found!' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: '❌ Wrong password!' })
    res.json({
      message: '✅ Login successful!',
      student: user,
      role: user.role
    })
  } catch (err) {
    res.status(500).json({ message: '❌ Error logging in', error: err.message })
  }
})

// Search Student by Roll Number
router.get('/search/:rollNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber })
    if (!student) return res.status(404).json({ message: '❌ Student not found!' })
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: '❌ Error searching student', error: err })
  }
})

// Get All Students
router.get('/all', async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' })
    res.json(students)
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching students', error: err })
  }
})

// Get Student Profile
router.get('/profile/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching profile', error: err })
  }
})

// Update Student Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: '✅ Profile updated!', student })
  } catch (err) {
    res.status(500).json({ message: '❌ Error updating profile', error: err })
  }
})

module.exports = router