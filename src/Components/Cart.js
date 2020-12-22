import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import firebase from '../firebase'
import CartItem from './CartItem'
import {BsFillPlayFill} from "react-icons/bs"
import {AiOutlineShoppingCart} from "react-icons/ai"

const Cart = () => {
    let history = useHistory()
    const [items,setItems] = useState([])
    const [itemsQty, setItemsQty] = useState([])
    const [total,setTotal] = useState(0)
    
    const CalculateTotal = () => {
        let t = 0
        for (var i in items){
            t += items[i].price * itemsQty[i][items[i].id].quantity
        }
        
        return Math.round(t*100)/100
    }

    const deleteItem = (itemId,index) =>{
        const newItemList = items.filter((item) => item.id !== itemId)
        const newQtyList = itemsQty.filter((item) => item != itemsQty[index])
        setItemsQty(newQtyList)
        setItems(newItemList)
        const ref = firebase.firestore().collection("Carts").where("uid","==",firebase.auth().currentUser.uid)
        ref.get().then(data => {
          firebase.firestore().collection('Carts').doc(data.docs[0].id).set({
            productsList : {
              [itemId] : firebase.firestore.FieldValue.delete()
            }
            },{merge: true})
        })
    }

    const onChangeQty = (itemId,index, e) => {
        const newQtyList = [...itemsQty]
        newQtyList[index][itemId].quantity = e.target.value
        setItemsQty(newQtyList)
        const ref = firebase.firestore().collection("Carts").where("uid","==",firebase.auth().currentUser.uid)
        ref.get().then(data => {
          firebase.firestore().collection('Carts').doc(data.docs[0].id).set({
            productsList : {
              [itemId] : {
                  quantity : parseInt(e.target.value)
                }
            }
            },{merge: true})
        })
    }

    useEffect(() => {
        if(firebase.auth().currentUser != null){
        const u = firebase.auth().currentUser.uid
        const Cartref = firebase.firestore().collection("Carts").where("uid", "==", u)
        setItemsQty([])
        setItems([])
        Cartref.get().then(result => {
            result.docs.map(doc =>{
                for (var key in doc.data().productsList){
                    setItemsQty(prev => {
                        const data = {
                            [key] : doc.data().productsList[key]
                        }
                        return ([...prev, data])
                    })
                    firebase.firestore().collection("Products").doc(key.toString()).get().then(result =>{
                        setItems(prev => [...prev, result.data()])
                    })
                }
                
                })
                
            })
        }
        
        },[])

        useEffect(() => {
            setTotal(CalculateTotal())
        },[items, itemsQty])

    const cartItems = items.map((i,index) =>
        <CartItem key = {i.id} item = {i} itemIndex={index} quantity = {itemsQty[index][i.id].quantity} onDelete = {deleteItem} onQtyChange = {onChangeQty}/>
    ) 


    const handleClick = (e) => {
        if(e.target.className.includes('shoppingbtn')){
            history.push('/Products')
        }
    }

    return(
    <div className="container">
    <div className="row">
        <div className="col-sm-12 col-md-10 col-md-offset-1">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Total</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems}
                    <tr>
                        <td>   </td>
                        <td>   </td>
                        <td>   </td>
                        <td><h5>Subtotal</h5></td>
                        <td className="text-right"><h5><strong>${total}</strong></h5></td>
                    </tr>
                    <tr>
                        <td>   </td>
                        <td>   </td>
                        <td>   </td>
                        <td><h5>Tax (15%)</h5></td>
                        <td className="text-right"><h5><strong>${Math.round(total*0.15*100)/100}</strong></h5></td>
                    </tr>
                    <tr>
                        <td>   </td>
                        <td>   </td>
                        <td>   </td>
                        <td><h3>Total</h3></td>
                        <td className="text-right"><h3><strong>${Math.round((total+total*0.15)*100)/100}</strong></h3></td>
                    </tr>
                    <tr>
                        <td>   </td>
                        <td>   </td>
                        <td>   </td>
                        <td >
                        <button type="button" className="btn btn-outline-secondary shoppingbtn" style={{width:"200px"}} onClick={handleClick}>
                            <AiOutlineShoppingCart style={{fontSize:"30px"}} /> Continue Shopping
                        </button></td>
                        <td >
                        <button type="button" className="btn btn-success" style={{width:"200px"}}>
                            Checkout <BsFillPlayFill style={{fontSize:"25px"}}/>
                        </button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
    )
}

export default Cart