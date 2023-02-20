import React from 'react'
import '../../css/items/SignInButton.scss'

export const SignInButton = ({text, onClick, type = "button"}) => {
  return (
    <button className='signin-btn' type={type} onClick={onClick}>
        {text}
    </button>
  );
};