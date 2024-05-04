import React from 'react'
import './successPromotionPage.scss'
import LottieSuccess from '../../ui/LottieSuccess';
import { Link } from 'react-router-dom';

const SuccessPromotionPage = () => {

  return (
    <div className='successContainer'>
      <LottieSuccess/>
        <h1>Ad has been promoted !!</h1>
        <Link to='/profile' className='button'>Home</Link>
    </div>
  )
}

export default SuccessPromotionPage