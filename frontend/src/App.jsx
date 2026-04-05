import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner'

import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Scores from './pages/Scores'
import QuestionPapers from './pages/QuestionPapers'
import Resources from './pages/Resources'
import EditData from './pages/EditData'
import Layout from './Layout'
import ManageData from './pages/ManageData'
import Landing from './pages/Landing'
import StudentLogin from './pages/StudentLogin'
import StudentRegister from './pages/StudentRegister'
import TeacherLogin from './pages/TeacherLogin'
import TeacherRegister from './pages/TeacherRegister'
import SearchStudent from './pages/SearchStudent'

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          {/* Landing & Auth Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/teacher-register" element={<TeacherRegister />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
          <Route path="/scores" element={<Layout><Scores /></Layout>} />
          <Route path="/questionpapers" element={<Layout><QuestionPapers /></Layout>} />
          <Route path="/resources" element={<Layout><Resources /></Layout>} />
          <Route path="/editdata" element={<Layout><EditData /></Layout>} />
          <Route path="/managedata" element={<Layout><ManageData /></Layout>} />
          <Route path="/searchstudent" element={<Layout><SearchStudent /></Layout>} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App