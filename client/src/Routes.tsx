import { Routes, Route } from 'react-router-dom'
import { ClassroomProvider } from './context/ClassroomContext'
import SignUpPage from './pages/SignUp'
import LogInPage from './pages/LogIn'
import ClassroomsPage from './pages/Classrooms'
import FilesDisplay from './components/FilesDisplay'
import AssignmentsDisplay from './components/AssignmentsDisplay'
import ClassPage from './pages/ClassPage'
import StudentSubmission from './components/StudentSubmission'
import SubmissionList from './components/SubmissionList'

const AppRoutes = () => (
  <Routes>
    <Route path="signup" element={<SignUpPage />} />
    <Route path="login" element={<LogInPage />} />
    <Route 
      path=":userId/classrooms" 
      element = {
        <ClassroomProvider>
          <ClassroomsPage />
        </ClassroomProvider>
      }
    />
    <Route 
      path=':userId/classrooms/:classId'
      element = {
        <ClassroomProvider>
          <ClassPage />
        </ClassroomProvider>
      }
    >
      <Route path='files' element={<FilesDisplay />}/>
      <Route path='assignments' element={<AssignmentsDisplay />}/>
      <Route path='assignments/submissions' element={<SubmissionList />}/>
      <Route path='assignments/:assignmentId' element={<StudentSubmission />} />
    </Route>
  </Routes>
)

export default AppRoutes