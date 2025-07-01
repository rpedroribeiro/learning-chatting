import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import passwordUtils from '../utils/passwordUtils'
import authApi from '../api/authApi'
import useAuth from '../hooks/useAuth'
import '../styles/signup.css'

const SignUpForm = () => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [typeAccount, setTypeAccount] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [passwordLength, setPasswordLength] = useState<boolean>(false)
  const [checkForUppercase, setCheckForUppercase] = useState<boolean>(false)
  const [checkForSpecial, setCheckForSpecial] = useState<boolean>(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false)
  const [passwordVerified, setPasswordVerified] = useState<boolean>(false)
  const { setUserId, setAccountType } = useAuth()
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
    if (passwordVerified) {
      setErrorMessage('')
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        accountType: typeAccount
      }
      const [status, message, userId, accountType] = await authApi.createAccount(userData)
      status ? (() => {
        setUserId(userId)
        setAccountType(accountType)
        navigate(`/${userId}/classrooms`)
      })() : setErrorMessage(message)
    } else {
      setErrorMessage('Password Does Not Meet Requirements')
    }
  }

  /**
   * This useEffect runs every time the password state updates. It
   * gives visiblity to the password requirements once the user types
   * out any password, and changes the state of each password requirement
   * using functions for passwordUtils.
   */
  useEffect(() => {
    (password.length > 0 && showPasswordRequirements === false) && setShowPasswordRequirements(true)
    setPasswordLength(passwordUtils.checkPasswordLength(password))
    setCheckForUppercase(passwordUtils.checkForUpperCase(password))
    setCheckForSpecial(passwordUtils.checkForSpecialCharacter(password))
  }, [password])

  /**
   * This useEffect checks to update the passwordVerified state every time
   * one of the three requirement states updates. If all the requirement
   * states are true, so is passwordVerified.
   */
  useEffect(() => {
    if (passwordLength && checkForUppercase && checkForSpecial) { 
      setPasswordVerified(true) 
    } else {
      setPasswordVerified(false)
    }
  }, [passwordLength, checkForUppercase, checkForSpecial])

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
        {showPasswordRequirements && (
          <div className='sign-up-form-input-container fade-in'>
            <p>Password Requirements:</p>
            <div style={{display: 'flex', gap: '50px'}}>
              <p style={ passwordLength ? {color: 'rgb(61, 179, 78)'} : {color: 'rgb(217, 61, 61)'}}>
                {passwordLength ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faXmark}/>} 8 Characters Long
              </p>
              <p style={ checkForSpecial ? {color: 'rgb(61, 179, 78)'} : {color: 'rgb(217, 61, 61)'}}>
                {checkForSpecial ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faXmark}/>} One Special Character
              </p>
              <p style={ checkForUppercase ? {color: 'rgb(61, 179, 78)'} : {color: 'rgb(217, 61, 61)'}}>
                {checkForUppercase ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faXmark}/>} One Uppercarse Character
              </p>
            </div>
          </div>
        )}
        <div className='sign-up-form-input-container'>
          <label>Account Type</label>
          <select 
            className='form-account-type-select'
            name='accountType'
            value={typeAccount}
            onChange={(event) => {setTypeAccount(event.target.value)}}
          >
            <option disabled value="">Select Account Type...</option>
            <option value="Student">Student</option>
            <option value="Professor">Professor</option>
          </select>
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