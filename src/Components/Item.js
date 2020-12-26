import React, { Component, useContext, useState } from 'react'
// import '../ComponentStyles/Item.css'
import { useHistory } from "react-router-dom";
import firebase from '../firebase'
import {AuthContext} from './AuthContext'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {Card,Button, Image} from 'react-bootstrap'


function DetailButton(props) {
  let history = useHistory();

  const detailstyle = {
    verticalAlign : "bottom",
    font : "bold",
    backgroundColor: "white",
    color: "black",
    border: "2px solid #485460",
    fontSize: "12px",
    transitionDuration: "0.4s",
    padding: "5px 12px",
    textAlign: "center",
    borderRadius: "22px",
    fontFamily: "sans-serif",
    fontWeight: "bold"
  }

  function handleClick() {
    history.push(`/Details/${props.id}`);
  }

  function OnButtonEnter(e) {
          e.target.style.backgroundColor = "black"
          e.target.style.color = "white"
      }
  function OnButtonExit(e){
      e.target.style.backgroundColor = "white"
      e.target.style.color = "black"
    }

  return (
    <button className = "detail_btn" type="button" onMouseEnter = {OnButtonEnter} onMouseLeave = {OnButtonExit} onClick={handleClick} style={{
      verticalAlign : "bottom",
      font : "bold",
      backgroundColor: "white",
      color: "black",
      border: "2px solid #485460",
      fontSize: "1rem",
      transitionDuration: "0.4s",
      padding: "5px 12px",
      textAlign: "center",
      borderRadius: "0.25rem",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      marginTop : "10px"
    }}>
      Details
    </button>
  );
}

function Item(props) {
  const [isAuthenticated] = useContext(AuthContext)
  let history = useHistory();
  const [inCartQty,setinCartQty] = useState(props.quantity)

    function OnButtonEnter(e) {
     
          e.target.style.backgroundColor = "white"
          e.target.style.color = "black"
      
      
    }

    function OnButtonExit(e){
         e.target.style.backgroundColor = "#485460"
         e.target.style.color = "white"
    }

     const handleClick = (e) => {
        
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
        setinCartQty(prev => {
          if(prev === undefined){
            return 1
          }
          return prev+1
          
        })
        const cartRef = firebase.firestore().collection('Carts')
        cartRef.where("uid", "==", firebase.auth().currentUser.uid).get().then((snapshot) =>{
            if(!snapshot.empty){
                cartRef.where("uid", "==", firebase.auth().currentUser.uid)
                .get().then((data) =>{
                  if(data.docs[0].data().productsList[props.item.id] !== undefined){
                    cartRef.doc(data.docs[0].id).set({
                        productsList : {
                          [props.item.id] : {
                            quantity : firebase.firestore.FieldValue.increment(1)
                          }
                        }
                    },{merge: true})
                  }
                  else{
                    cartRef.doc(data.docs[0].id).set({
                        productsList : {
                          [props.item.id] : {
                            quantity : 1
                          }
                        }
                    },{merge: true})
                  }
                })
            }
            else{
              const data = 
              cartRef.add({
                uid : firebase.auth().currentUser.uid,
                productsList: {
                    [props.item.id]: {
                      quantity: 1
                    }
                  }
              
              })
            }
        })

      }
      
    }
    
    return (
       <Card style={{ width: '18rem', margin:"20px"}}>
        <Image className="mx-auto" src={process.env.PUBLIC_URL + `/images/${props.item.filename}`} style={{width:120, height:120, marginTop:"10px"}} rounded/>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="mx-auto">{props.item.title}</Card.Title>
          <Card.Text>
             <h3 style = {{outlineStyle: "solid"}}>{props.item.price} $</h3>
          </Card.Text>
          <Card.Text>
            {props.item.description}
          </Card.Text>
          {inCartQty !== undefined && <p>In Cart : {inCartQty}</p> }
          {inCartQty !== undefined ? 
          <Button  onMouseOver = {OnButtonEnter} onMouseLeave = {OnButtonExit} onClick = {handleClick} className="mt-auto" variant="primary" style ={{backgroundColor : "#485460", borderColor: "#485460"}}>Add More</Button>
          :
          <Button  onMouseOver = {OnButtonEnter} onMouseLeave = {OnButtonExit} onClick = {handleClick} className="mt-auto" variant="primary" style ={{backgroundColor : "#485460", borderColor: "#485460"}}>Add to cart</Button>
          }
          <DetailButton id = {props.item.id}/> 
        </Card.Body>
      </Card>
       
    )
}

export default Item