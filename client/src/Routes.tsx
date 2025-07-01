import { Routes, Route } from 'react-router-dom'
import { ClassroomProvider } from './context/ClassroomContext'
import SignUpPage from './pages/SignUp'
import LogInPage from './pages/LogIn'
import ClassroomsPage from './pages/Classrooms'
import FilesDisplay from './components/FilesDisplay'
import ClassPage from './pages/ClassPage'


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
    >
      <Route 
        path=':classroomId'
        element = {
          <ClassroomProvider>
            <ClassPage />
          </ClassroomProvider>
        }
      >
        <Route path='files' element={<FilesDisplay />}/>
      </Route>
    </Route>
  </Routes>
)

export default AppRoutes