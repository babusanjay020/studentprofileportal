const express = require('express')
const router = express.Router()
const QuestionPaper = require('../models/QuestionPaper')

// Add Question Paper
router.post('/add', async (req, res) => {
  try {
    const paper = new QuestionPaper(req.body)
    await paper.save()
    res.json({ message: '✅ Question Paper added!', paper })
  } catch (err) {
    res.status(500).json({ message: '❌ Error adding paper', error: err })
  }
})

// Get All Question Papers
router.get('/', async (req, res) => {
  try {
    const papers = await QuestionPaper.find()
    res.json(papers)
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching papers', error: err })
  }
})

// Delete Question Paper
router.delete('/:id', async (req, res) => {
  try {
    await QuestionPaper.findByIdAndDelete(req.params.id)
    res.json({ message: '✅ Question Paper deleted!' })
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting paper', error: err })
  }
})

module.exports = router