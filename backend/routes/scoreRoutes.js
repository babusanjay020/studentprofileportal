
const express = require('express')
const router = express.Router()
const Score = require('../models/Score')

// Add Score
router.post('/add', async (req, res) => {
  try {
    const score = new Score(req.body)
    await score.save()
    res.json({ message: '✅ Score added!', score })
  } catch (err) {
    res.status(500).json({ message: '❌ Error adding score', error: err })
  }
})

// Get Scores by StudentId
router.get('/:studentId', async (req, res) => {
  try {
    const scores = await Score.find({ studentId: req.params.studentId })
    res.json(scores)
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching scores', error: err })
  }
})

// Delete Score
router.delete('/:id', async (req, res) => {
  try {
    await Score.findByIdAndDelete(req.params.id)
    res.json({ message: '✅ Score deleted!' })
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting score', error: err })
  }
})

module.exports = router