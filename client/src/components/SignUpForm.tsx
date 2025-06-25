import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import passwordUtils from '../utils/passwordUtils'
import authApi from '../api/authApi'
import useAuth from '../hooks/useAuth'
import '../styles/signup.css'

const SignUpForm = () => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { setAccessToken } = useAuth()
  const navigate = useNavigate()

  /**
   * This function is ran upon the form being submitted, it then
   * verifies the password's strength and if valid, sends the data
   * through a POST request in the helper function. Saves the
   * accessToken inside of a state variable inside useAuth().
   * 
   * @param event - The event is from the form tag and we prevent
   * the page from refreshing on form submit.
   */
  const handleAccountCreation = async (event: any) => {
    event.preventDefault()
    const [passwordVerified, passwordMessage] = passwordUtils.checkPasswordStrength(password)
    if (passwordVerified) {
      setErrorMessage('')
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }
      const [status, result, userId] = await authApi.createAccount(userData)
      status ? setAccessToken(result) : setErrorMessage(result)
      navigate(`/${userId}/classrooms`)
    } else {
      setErrorMessage(passwordMessage)
    }
  }

  return (
    <div className='sign-up-section'>
      <form onSubmit={handleAccountCreation} className="sign-up-form-container">
        <h1 className='sign-up-form-title'>Create an Account</h1>
        <div className='sign-up-form-name-input-container'>
          <div className='sign-up-form-input-half-container'>
            <label>First Name</label>
            <input required value={firstName} onChange={e => setFirstName(e.target.value)}/>
          </div>
          <div className='sign-up-form-input-half-container'>
            <label>Last Name</label>
            <input required value={lastName} onChange={e => setLastName(e.target.value)}/>
          </div>
        </div>
        <div className='sign-up-form-input-container'>
          <label>Email</label>
          <input required value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className='sign-up-form-input-container'>
          <label>Password</label>
          <input type='password' required value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button className='sign-up-form-button'>Create Account</button>
        {errorMessage && <span style={{color: 'rgb(217, 61, 61)'}}>{errorMessage}</span>}
      </form>
      <hr style={{width: '100%'}}/>
      <div className='oauth-container'>
        <button>Sign Up With Facebook</button>
        <button>Sign Up With Google</button>
      </div>
      <span>Already Have an Account? <Link to='/login'>Log in</Link></span>
    </div>
  )
}

export default SignUpForm