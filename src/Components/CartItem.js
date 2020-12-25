import React from 'react';
import '../ComponentStyles/CartItem.css'
import {Link} from 'react-router-dom'
import firebase from '../firebase'


const CartItem = (props) => {
    return (
      <tr>
        <td className="col-sm-8 col-md-6">
        <div className="media">
            <a className="thumbnail pull-left" href="#"> <img className="media-object" src={process.env.PUBLIC_URL +`/images/${props.item.filename}`} style={{width: "72px", height: "72px"}}/> </a>
            <div className="media-body">
                <h4 className="media-heading"><Link to={`/Details/${props.item.id}`}>{props.item.title}</Link></h4>
            </div>
        </div></td>
        <td className="col-sm-1 col-md-1" style={{textAlign: "center"}}>
        <input type="number" className="form-control" defaultValue={props.quantity} onChange={(e) => {
          props.onQtyChange(props.item.id,props.itemIndex,e)
        }}/>
        </td>
        <td className="col-sm-1 col-md-1 text-center"><strong>${props.item.price}</strong></td>
        <td className="col-sm-1 col-md-1 text-center"><strong>${Math.round(props.item.price * props.quantity*100)/100}</strong></td>
        <td className="col-sm-1 col-md-1">
        <button type="button" className="btn btn-danger" 
        onClick={() =>{
          props.onDelete(props.item.id,props.itemIndex)
        }
      }>
            <span className="glyphicon glyphicon-remove"></span> Remove
        </button></td>
      </tr>
    )
}

export default CartItem