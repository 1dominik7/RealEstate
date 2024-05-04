import React from 'react'
import './alert.scss'
import {
    useRevalidator,
  } from "react-router-dom";
import apiRequest from '../lib/apiRequest';

const Alert = ({id, setOpenPostDelete}) => {

    let revalidator = useRevalidator();

    const deletePost = async () => {
        try {
          await apiRequest.delete(`/posts/${id}`);
          setOpenPostDelete(false)
          revalidator.revalidate();
        } catch (error) {
          console.log(error);
        }
      };

  return (
    <div className='alertContainer'>
        <div className="wrapper">
        <span>Are you sure to delete this property ?</span>
    <div className="buttons">
        <div className='delete' onClick={deletePost}>Delete</div>
        <div className='cancel' onClick={() => setOpenPostDelete(false)}>Cancel</div>
    </div>
        </div>
    </div>
  )
}

export default Alert