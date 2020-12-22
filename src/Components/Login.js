import React, {useState, useContext, useEffect} from 'react';
import '../ComponentStyles/LoginStyle.css'
import firebase from 'firebase'
import { useHistory,Link } from "react-router-dom";
import {AuthContext} from "./AuthContext";
import {useAlert} from "react-alert"



function Login(){
    const alert = useAlert()
    const [isAuthenticated, setAuth] = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let history = useHistory()

    useEffect (() => {
        
            if(isAuthenticated){
                history.push("/Products")
            }
    })

    function handleChange (e){
        if(e.target.type === 'email'){
            setEmail(e.target.value)
        }
        else{
            setPassword(e.target.value)
        }
    }
    
    function handleClick(e){
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                firebase.auth().currentUser.getIdToken().then((token) => {
                    localStorage.setItem("Token", token)
                    setAuth(true)
                    alert.success("Sucessfully Logged in", {
                        timeout: 2000, onClose: () => {
                        history.push("/Products")
                    }
                })
                    
                })
                
            })
            .catch((error) => {
                if(error.code === "auth/user-not-found" || error.code === "auth/wrong-password"){
                    alert.error("Please verify your credentials!", {timeout: 2000})
                }
                else if (error.code === "auth/invalid-email"){
                    alert.error("Please enter a valid email address!", {timeout: 2000})
                }
            });
    }

    return(
        <div className="login-page">
            {isAuthenticated ?  "" :
            <form style={{padding : "20px",borderRadius:"10px",backgroundColor:"#f5f6fa"}}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={handleChange}/>
                </div>
                <p className="forgot-password text-right" style={{marginTop : "-20px", marginBottom: "20px"}}>
                     <Link to = "/resetpassword">Forgot Password ?</Link>
                </p>

                <button type="submit" className="btn btn-primary btn-block" onClick={handleClick}>Submit</button>
                <p className="forgot-password text-left">Not registered yet ? 
                <Link to = "/signup"> Click here to sign up !</Link>
                </p> 
                
            </form>
            
        }
        </div>
    )
}

export default Login