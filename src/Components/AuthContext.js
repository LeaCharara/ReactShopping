import React, { Component, useState, createContext } from 'react';
import firebase from '../firebase'

export const AuthContext = createContext();

export const AuthProvider = (props) =>{
    const [isAuthenticated,SetAuth] = useState(firebase.auth().currentUser !== null);
    return (
        <AuthContext.Provider value={[isAuthenticated, SetAuth]}>
            {props.children}
        </AuthContext.Provider>
    )
}