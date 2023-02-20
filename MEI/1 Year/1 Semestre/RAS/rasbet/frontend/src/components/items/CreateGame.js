import React from 'react'
import '../../css/items/CreateGame.scss'

export const CreateGame = ({value, onChange, type, placeholder}) => {
  return ( 
        <input
            className='create-game-input'
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
        />
    );
}