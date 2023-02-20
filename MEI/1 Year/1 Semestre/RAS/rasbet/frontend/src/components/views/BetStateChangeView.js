import React, { useState } from 'react';
// import '../../css/views/BetStateView.scss'
import '../../css/views/FormView.scss'
import { Input } from '../items/Input';

export const BetStateChangeView = () => {
    const [ gameID, setGameID] = useState('')
    const [ betState, setBetState ] = useState('')
    const [ error, setError ] = useState("")
    
    return (
        <div className='bet-state-container'> 
            <form>
                <h1>Alterar estado da aposta</h1>
                <div class="row">
                    <div class="col-25">
                        <label for="GameID">Game ID:</label>
                    </div>
                    <Input
                        value={gameID}
                        type="text"
                        placeholder="Game ID"
                        onChange={(e) => [ setGameID(e.target.value), setError("") ]}
                    />
                </div>

                <div class="row">
                    <div class="col-25">
                        <label for="betState">Estado da aposta:</label>
                    </div>
                    <Input
                        value={betState}
                        type="text"
                        placeholder="Estado da aposta"
                        onChange={(e) => [ setBetState(e.target.value), setError("") ]}
                    />
                </div>

                { error.trim() !== '' && <label className='error-label'>{error}</label>}
                <button>Alterar</button>
            </form>
        </div>
    )
}