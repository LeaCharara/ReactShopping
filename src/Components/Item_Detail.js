import React, {useState, useEffect, useContext} from 'react';
import "../ComponentStyles/ItemDetail.css"
import firebase from '../firebase'
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import {AuthContext} from './AuthContext'
import {useHistory} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';


const override = css`
  position: absolute;
  top: 50%;
  left : 45%;
`;

function ItemDetail(){
    const [item, setItem] = useState()
    const [isLoading, setLoading] = useState(true)
    const [isAuthenticated] = useContext(AuthContext)
    const history = useHistory()
    const url = window.location.pathname
    const item_id = url.split('/')[2]

    useEffect(() => {
        const dbref = firebase.firestore().collection("Products").doc(item_id)
        dbref.get().then(result => {
            setItem(result.data())
            setLoading(false)
        })
        
    },[])

    function onAddItemClick(){
      
  
      //If user not auth then ask to login  
      if(!isAuthenticated){
          confirmAlert({
                title: 'Status',
                message: "Please Login before adding to cart !",
                buttons: [
                    {
                    label: 'Yes',
                    onClick: () => {
                      history.push("/login")}
                    },
                    {
                    label: 'Later'
                    }
                ]
                });
      }
      else{
        const cartRef = firebase.firestore().collection('Carts')
        //Ask db if user has already a cart
        cartRef.where("uid", "==", firebase.auth().currentUser.uid).get().then((snapshot) =>{
            //If user has
            if(!snapshot.empty){
                //Ask if product already exists in cart
                cartRef.where("uid", "==", firebase.auth().currentUser.uid)
                .get().then((data) =>{
                    //If in cart increment the quantity
                  if(data.docs[0].data().productsList[item_id] !== undefined){
                    cartRef.doc(data.docs[0].id).set({
                        productsList : {
                          [item_id] : {
                            quantity : firebase.firestore.FieldValue.increment(1)
                          }
                        }
                    },{merge: true})
                  }
                  //If it does not exists in cart add the product to the cart
                  else{
                    cartRef.doc(data.docs[0].id).set({
                        productsList : {
                          [item_id] : {
                            quantity : 1
                          }
                        }
                    },{merge: true})
                  }
                })
            }
            //If user does not have a cart create a new one and add to it the wanted product
            else{
              cartRef.add({
                uid : firebase.auth().currentUser.uid,
                productsList: {
                    [item_id]: {
                      quantity: 1
                    }
                  }
              
              })
            }
        })

      }
    }
    
    
    return (
        <div >
            {isLoading ? <div className="sweet-loading">
            <BeatLoader
            css={override}
            size={50}
            color={"green"}
            loading={isLoading}
            />
        </div> : 
            <div className="Container">
                <div className="left_column">
                    <img src={process.env.PUBLIC_URL +`/images/${item.filename}`}></img>
                </div>
                <div className ="right_column">
                    <div className="product-description">
                        <span>{item.type}</span>
                        <h1>{item.title}</h1>
                        <p>{item.description}</p>
                    </div>
                    <div className="product-price">
                        <span>{item.price}$</span>
                        <button className="cart-btn" onClick={onAddItemClick}>Add to cart</button>
                    </div>
                </div>
            </div>
            }
            
        </div>
    );
}

export default ItemDetail