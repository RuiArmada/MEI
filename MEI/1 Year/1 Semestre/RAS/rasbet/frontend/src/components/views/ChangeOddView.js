import React, { useState } from 'react';
import '../../css/views/FormView.scss'
import { Input } from '../items/Input';


export const ChangeOddView = () => {
    const [ gameID, setGameId ] = useState('')
    const [ odd, setOdd ] = useState('')
    const [error, setError] = useState('');
    
    return (
        <div className='change-odd-container'> 
            <form>
                <h1>Alterar odd de um evento desportivo</h1>
                <div class="row">
                    <label for="GameID">Game ID:</label>
                    <Input
                        value={gameID}
                        type="text"
                        placeholder="Game ID"
                        onChange={(e) => [ setGameId(e.target.value), setError('') ]}
                    />
                </div>

                <div class="row">
                    <label for="odd">Odd do jogo:</label>
                    <Input
                        value={odd}
                        type="text"
                        placeholder="Odd"
                        onChange={(e) => [ setOdd(e.target.value), setError('') ]}
                    />
                </div>

                { error.trim() !== '' && <label className='error-label'>{error}</label>}
                <button>Alterar</button>
            </form>
        </div>
    )
}