import React from 'react'
import '../../css/items/SignInInput.scss'

export const Input = ({type, placeholder, value, onChange}) => {
  return ( 
        <input
            className='signin-input'
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
        />
    );
};