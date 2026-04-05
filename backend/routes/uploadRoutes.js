const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

router.post('/', upload.single('file'), (req, res) => {
  try {
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`
    res.json({ fileUrl })
  } catch (err) {
    res.status(500).json({ message: '❌ Error uploading file' })
  }
})

module.exports = router