import { useState } from 'react'
import '../styles/signup.css'

const SignUpForm = () => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <div className='sign-up-section'>
      <form className="sign-up-form-container">
        <h1 className='sign-up-form-title'>Create an Account</h1>
        <div className='sign-up-form-name-input-container'>
          <div className='sign-up-form-input-half-container'>
            <label>First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)}/>
          </div>
          <div className='sign-up-form-input-half-container'>
            <label>Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)}/>
          </div>
        </div>
        <div className='sign-up-form-input-container'>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className='sign-up-form-input-container'>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button className='sign-up-form-button'>Create Account</button>
      </form>
      <hr style={{width: '100%'}}/>
      <div className='oauth-container'>
        <button>Sign Up With Facebook</button>
        <button>Sign Up With Google</button>
      </div>
      <span>Already Have an Account? <a>Log In</a></span>
    </div>
  )
}

export default SignUpForm