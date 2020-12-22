import React, {useState} from 'react';
import {useHistory} from 'react-router-dom'
import {useAlert} from "react-alert"
import firebase from '../firebase'

const ForgotPassword = () => {

    const alert = useAlert()
    const [email,setEmail] = useState('')
    const history = useHistory()

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleClick = (e) => {
        e.preventDefault()
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(email).then(function() {
            alert.success('Email has been sent successfully', {timeout: 3000})
            history.push('/login')
        }).catch(function(error) {
            alert.error(error.message, {timeout: 5000})
        });
    }

    return (
        <form className="form">
            <h3>Reset Password</h3>

            <div className="form-group">
                <label>Please enter your email address</label>
                <input id="email" type="email" className="form-control" placeholder="Enter email" onChange={handleChange}/>
            </div>

            <button type="submit" className="btn btn-primary btn-block" onClick={handleClick}>submit</button>
        </form>
    )
}

export default ForgotPassword