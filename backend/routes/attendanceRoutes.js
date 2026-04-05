
const express = require('express')
const router = express.Router()
const Attendance = require('../models/Attendance')

// Add Attendance
router.post('/add', async (req, res) => {
  try {
    const attendance = new Attendance(req.body)
    await attendance.save()
    res.json({ message: '✅ Attendance added!', attendance })
  } catch (err) {
    res.status(500).json({ message: '❌ Error adding attendance', error: err })
  }
})

// Get Attendance by StudentId
router.get('/:studentId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId })
    res.json(attendance)
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching attendance', error: err })
  }
})

// Update Attendance
router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: '✅ Attendance updated!', attendance })
  } catch (err) {
    res.status(500).json({ message: '❌ Error updating attendance', error: err })
  }
})

// Delete Attendance
router.delete('/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id)
    res.json({ message: '✅ Attendance deleted!' })
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting attendance', error: err })
  }
})

module.exports = router