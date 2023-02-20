import { useState } from 'react'
import '../../css/items/OddCard.scss'

export const OddCard = ({odd, onClick}) => {
    return (
        <div className={'odd-card' + (odd.selected ? ' odd-card-selected' : '')} onClick={onClick}>
            <label>{ odd.name }</label>
            <label>{ odd.value }</label>
        </div>
    )
}