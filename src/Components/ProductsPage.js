import React, { Component,useState, useEffect, useContext } from 'react'
import Item from './Item'
import '../ComponentStyles/productlist.css'
import firebase from '../firebase'
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import {HiSearch} from "react-icons/hi"

const override = css`
  position: absolute;
  top: 50%;
  left : 45%;
`;

function ProductPage () {
    
    const [products, setProducts] = useState([])
    const [inCartItemsQty, setInCartItemsQty] = useState({})
    const [showedItems, setShowedItems] = useState([])

    useEffect(() => {
        if(firebase.auth().currentUser != null){
        const u = firebase.auth().currentUser.uid
        const Cartref = firebase.firestore().collection("Carts").where("uid", "==", u)
        setInCartItemsQty({})
        Cartref.get().then(result => {
            result.docs.map(doc =>{
                for (var key in doc.data().productsList){
                    setInCartItemsQty(prev => {
                        const data = prev
                        data[key] = doc.data().productsList[key].quantity
                        return (data)
                    })
                }
            })
        })
    }},[])

    useEffect(() => {
        const dbref = firebase.firestore().collection("Products")
        dbref.get().then(data => {
            data.docs.map(doc =>{
                setProducts(prevProduct => [...prevProduct, doc.data()])
             })
        })

    }, [])

    useEffect(() => {
         setShowedItems(products.map((i,index) => 
        <Item key={index} item={i} quantity={inCartItemsQty[i.id]}/>))
    },[products])

    const handleChange = (e) => {
        setShowedItems(products.filter(i => {
            return i.title.includes(e.target.value)
        }).map((i,index) =>
            <Item key={index} item={i} quantity={inCartItemsQty[i.id]}/>
        )
    )
    }
    
    
        return(
            <div style = {{textAlign : "center", marginTop : "20px"}}>
                <div>
                    <HiSearch style ={{ fontSize: "24px"}}/>
                    <input type = "text" placeholder="Search..." onChange={handleChange}
                    style = {{
                        marginLeft: "10px",
                        fontSize: "24px",
                        width :"500px",
                        border: "0",
                        outline: "0",
                        background: "transparent",
                        borderBottom: "1px solid black"
                    }}
                />
             </div>
                <section className="products">
                    {showedItems}
                </section>
            </div>
        )
    }


export default ProductPage

