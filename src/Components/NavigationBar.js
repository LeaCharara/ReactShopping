import React, { Component,useContext } from 'react'
// import "../ComponentStyles/NavBar.css"
import {Link, useHistory} from 'react-router-dom'
import firebase from '../firebase'
import {AuthContext} from "./AuthContext";
import {Navbar, Nav, Button} from 'react-bootstrap';



function NavigationBar(){
    let history = useHistory()
    const [isAuthenticated, setAuth] = useContext(AuthContext)

    function handleClick(e){
        console.log(e.target.id)
        if(e.target.id === "logoutbtn"){
            firebase.auth().signOut().then(function() {
                setAuth(false)
                localStorage.setItem("Token", "")
                history.push('/Products')
            }).catch(function(error) {
                        console.log(error)
            })
        }
        else {
            history.push('/login')
        }
    }

    return(
        <div>
             <Navbar bg="light" variant="light">
                <Navbar.Brand >Tasts</Navbar.Brand>
                <Nav className="ml-auto" >
                <Nav.Link><Link to="/Products" style={{textDecoration: "none"}}>Products</Link></Nav.Link>
                <Nav.Link><Link to="/Cart" style={{textDecoration: "none"}}>Cart</Link></Nav.Link>
                {isAuthenticated ? <Nav.Link><Link style={{textDecoration: "none"}}  id="logoutbtn" onClick={handleClick}>Log Out</Link></Nav.Link> : <Nav.Link><Link style={{textDecoration: "none"}} onClick={handleClick}>Log In</Link></Nav.Link>}
                </Nav>
            </Navbar>
        </div>
    )
}

export default NavigationBar