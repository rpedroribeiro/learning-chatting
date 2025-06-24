import { Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUp'
import LogInPage from './pages/LogIn'

const AppRoutes = () => (
  <Routes>
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/" element={<LogInPage />} />
  </Routes>
)

export default AppRoutes