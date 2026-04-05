const express = require('express')
const router = express.Router()
const Resource = require('../models/Resource')

// Add Resource
router.post('/add', async (req, res) => {
  try {
    const resource = new Resource(req.body)
    await resource.save()
    res.json({ message: '✅ Resource added!', resource })
  } catch (err) {
    res.status(500).json({ message: '❌ Error adding resource', error: err })
  }
})

// Get All Resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find()
    res.json(resources)
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching resources', error: err })
  }
})

// Delete Resource
router.delete('/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id)
    res.json({ message: '✅ Resource deleted!' })
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting resource', error: err })
  }
})

module.exports = router