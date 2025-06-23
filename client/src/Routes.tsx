import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SignUp />} />
  </Routes>
)

export default AppRoutes