import React, { Component, useState } from 'react'
import {useHistory, Link} from 'react-router-dom'
import '../ComponentStyles/SignupStyle.css'
import firebase from '../firebase'
import {useAlert} from "react-alert"


const SignUp = () => {

    const history = useHistory()
    const alert = useAlert()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [EmailIsNotValid,setEmailIsNotValid] = useState()
    const [PasswordIsNotValid,setPasswordIsNotValid] = useState()

    const handleChange = (e) => {
        const id = e.target.id
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(id === "email"){
            if ( re.test(e.target.value) ) {
                setEmailIsNotValid(false)
                setEmail(e.target.value)
            }
            else {
                setEmailIsNotValid(true)
            }
        }
        if(id === "password"){
            setPassword(e.target.value)
        }
        if(id === "verify_password"){
            if(e.target.value === password){
                setPasswordIsNotValid(false)
            }
            else{
                setPasswordIsNotValid(true)
            }
        }
        
    }

    const handleClick = (e) => {
        e.preventDefault()
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert.success("Account Successfully created", {timeout: 3000})
                history.push('/login')
            })
            .catch((error) => {
                var errorMessage = error.message;
                alert.error(errorMessage, {timeout: 5000})
            });
    }

    return (
        <form className="form">
            <h3>Sign Up</h3>

            <div className="form-group">
                <label>Email address</label>
                <input id="email" type="email" className="form-control" placeholder="Enter email" onChange={handleChange}/>
            </div>
             {EmailIsNotValid ? <p style={{color: 'red', fontSize:"12px"}}>Please enter a valid email address</p> : null}

            <div className="form-group">
                <label>Password</label>
                <input id="password" type="password" className="form-control" placeholder="Enter password" onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Verify password</label>
                <input id="verify_password" type="password" className="form-control" placeholder="Re-enter password" onChange={handleChange} />
            </div>
            {PasswordIsNotValid ? <p style={{color: 'red', fontSize:"12px"}}>Verify Password does not match</p> : null}

            <button type="submit" className="btn btn-primary btn-block" onClick={handleClick}>Sign Up</button>
            <p className="forgot-password text-right">
                Already registered ? <Link to = "/login"> Sign In </Link>
            </p>
            </form>
    )
}

export default SignUp