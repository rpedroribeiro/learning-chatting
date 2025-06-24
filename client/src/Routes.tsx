import { Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUp'
import LogInPage from './pages/LogIn'
import ClassroomsPage from './pages/Classrooms'

const AppRoutes = () => (
  <Routes>
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/login" element={<LogInPage />} />
    <Route path="/:userId/classrooms" element={<ClassroomsPage />} />
  </Routes>
)

export default AppRoutes