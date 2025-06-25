import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import '../styles/signup.css'
import authApi from '../api/authApi'

const LogInForm = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { setAccessToken } = useAuth()

  const handleLogIn = async (event: any) => {
    event.preventDefault()
    const userData = {
      email: email,
      password: password
    }
    const [status, result] = await authApi.signIntoAccount(userData)
    status ? setAccessToken(result) : setErrorMessage(result)
  }

  return (
    <div className='sign-up-section'>
      <form onSubmit={handleLogIn} className="sign-up-form-container">
        <h1 className='sign-up-form-title'>Log In</h1>
        <div className='sign-up-form-input-container'>
          <label>Email</label>
          <input required value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className='sign-up-form-input-container'>
          <label>Password</label>
          <input type='password' required value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button className='sign-up-form-button'>Log In</button>
        {errorMessage && <span style={{color: 'rgb(217, 61, 61)'}}>{errorMessage}</span>}
      </form>
      <hr style={{width: '100%'}}/>
      <div className='oauth-container'>
        <button>Sign Up With Facebook</button>
        <button>Sign Up With Google</button>
      </div>
      <span>Don't have an Account? <Link to='/signup'>Log in</Link></span>
    </div>
  )
}

export default LogInForm