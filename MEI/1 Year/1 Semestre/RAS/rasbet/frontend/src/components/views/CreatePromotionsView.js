import React from 'react';
import cardsIcon from "../../imgs/cards.png";
import cardIcon from "../../imgs/card.png";
import bonusIcon from "../../imgs/bonusIcon.png";
import '../../css/views/CreatePromotionsView.scss'

function CreatePromotionsView ({}) {
    
    return(
        <div className='create-promotion-container'>
            <ul>
                <button>
                    <img src={bonusIcon} />
                    <p>Oferta bonus</p>
                </button>
                <button>
                    <img src={cardsIcon} />
                    <p>Promoções em apostas múltiplas</p>
                </button>
                <button>
                    <img src={cardsIcon} />
                    <p>Promoções em apostas combinadas</p>
                </button>
                <button>
                    <img src={cardIcon} />
                    <p>Promoções em apostas simples</p>
                </button>
            </ul>
        </div>
    )
}
 
export default CreatePromotionsView;