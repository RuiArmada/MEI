import React, { useState } from 'react';
import '../../css/views/FormView.scss'
import { Input } from '../items/Input';

export const RemoveGameView = () => {
    const [ sport, setSport ] = useState('')
    const [ gameID, setGameID ] = useState('')
    const [error, setError] = useState("");
    
    return (
        <div className='remove-game-container'>             
            <form>
                <h1>Remover evento desportivo</h1>

                <div class="row">
                    <label for="gameID">Game ID:</label>
                    <Input
                        value={gameID}
                        type="text"
                        placeholder="Game ID"
                        onChange={(e) => [setGameID(e.target.value), setError("")]}
                        />
                </div>

                { error.trim() !== '' && <label className='error-label'>{error}</label>}
                <button>Remover</button>
            </form>
        </div>
    )
}