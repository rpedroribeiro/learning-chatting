import { Routes, Route } from 'react-router-dom'
import { ClassroomProvider } from './context/ClassroomContext'
import SignUpPage from './pages/SignUp'
import LogInPage from './pages/LogIn'
import ClassroomsPage from './pages/Classrooms'
import FilesDisplay from './components/files/FilesDisplay'
import AssignmentsDisplay from './components/assignments/AssignmentsDisplay'
import ClassPage from './pages/ClassPage'
import StudentSubmission from './components/submissions/StudentSubmission'
import SubmissionList from './components/submissions/SubmissionList'
import NotificationsWidgetMenu from './components/notifications/NotificationsWidgetMenu'
import ChattingContainer from './components/chatting/ChattingContainer'

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
      <Route path='assignments/:assignmentId/submissions' element={<SubmissionList />}/>
      <Route path='assignments/:assignmentId' element={<StudentSubmission />} />
      <Route path='notifications' element={<NotificationsWidgetMenu />} />
      <Route path='chatting' element={<ChattingContainer />} />
    </Route>
  </Routes>
)

export default AppRoutes