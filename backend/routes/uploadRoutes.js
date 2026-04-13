const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Use memory storage instead
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '❌ No file uploaded' })
    }

    // Convert buffer to base64
    const fileStr = req.file.buffer.toString('base64')
    const fileType = req.file.mimetype

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${fileType};base64,${fileStr}`,
      {
        folder: 'studentportal',
        resource_type: 'auto'
      }
    )

    res.json({ fileUrl: uploadResponse.secure_url })
  } catch (err) {
    console.log('Upload error:', err)
    res.status(500).json({ message: '❌ Error uploading file', error: err.message })
  }
})

module.exports = router