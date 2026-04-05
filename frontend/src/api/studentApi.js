
const BASE_URL = 'http://localhost:5000/api/students'

export const registerStudent = async (data) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export const loginStudent = async (data) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export const getProfile = async (id) => {
  const response = await fetch(`${BASE_URL}/profile/${id}`)
  return response.json()
}

export const updateProfile = async (id, data) => {
  const response = await fetch(`${BASE_URL}/profile/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

// Attendance APIs
export const addAttendance = async (data) => {
  const response = await fetch('http://localhost:5000/api/attendance/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export const getAttendance = async (studentId) => {
  const response = await fetch(`http://localhost:5000/api/attendance/${studentId}`)
  return response.json()
}

export const deleteAttendance = async (id) => {
  const response = await fetch(`http://localhost:5000/api/attendance/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}
// Score APIs
export const addScore = async (data) => {
  const response = await fetch('http://localhost:5000/api/scores/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export const getScores = async (studentId) => {
  const response = await fetch(`http://localhost:5000/api/scores/${studentId}`)
  return response.json()
}

export const deleteScore = async (id) => {
  const response = await fetch(`http://localhost:5000/api/scores/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}
// Question Paper APIs
export const addQuestionPaper = async (data) => {
  const response = await fetch('http://localhost:5000/api/questionpapers/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export const getQuestionPapers = async () => {
  const response = await fetch('http://localhost:5000/api/questionpapers')
  return response.json()
}

export const deleteQuestionPaper = async (id) => {
  const response = await fetch(`http://localhost:5000/api/questionpapers/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}
// Resource APIs
export const addResource = async (data) => {
  const response = await fetch('http://localhost:5000/api/resources/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}

export const getResources = async () => {
  const response = await fetch('http://localhost:5000/api/resources')
  return response.json()
}

export const deleteResource = async (id) => {
  const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}
export const searchStudent = async (rollNumber) => {
  const response = await fetch(`http://localhost:5000/api/students/search/${rollNumber}`)
  return response.json()
}
// Get All Students
export const getAllStudents = async () => {
  const response = await fetch('http://localhost:5000/api/students/all')
  return response.json()
}
// File Upload API
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    body: formData
  })
  return response.json()
}

