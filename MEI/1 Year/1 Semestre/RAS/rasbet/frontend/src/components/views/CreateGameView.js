import React, { useState } from 'react';
import '../../css/views/FormView.scss'
import { Input } from '../items/Input';

export const CreateGameView = () => {
    const [ gameID, setGameId ] = useState('')
    const [ homeTeam, setHomeTeam ] = useState('')
    const [ awayTeam, setAwayTeam ] = useState('')
    const [ comenceTime, setComenceTime ] = useState('')
    const [ odd, setOdd ] = useState('')
    const [ error, setError ] = useState('');
    
    return (
        <div className='create-game-container'> 
            <form>
                <h1>Adicionar evento desportivo</h1>
                <div class="row">
                    <label for="GameID">Game ID:</label>
                    <Input
                        value={gameID}
                        type="text"
                        placeholder="Game ID"
                        onChange={(e) => [setGameId(e.target.value), setError("")]}
                    />
                </div>

                <div class="row">
                    <label for="homeTeam">Home Team:</label>
                    <Input
                        value={homeTeam}
                        type="text"
                        placeholder="Equipa que joga em Casa"
                        onChange={(e) => [setHomeTeam(e.target.value), setError("")]}
                    />
                </div>

                <div class="row">
                    <label for="awayTeam">Away Team:</label>
                    <Input
                        value={awayTeam}
                        type="text"
                        placeholder="Equipa que joga fora de casa"
                        onChange={(e) => [setAwayTeam(e.target.value), setError("")]}
                    />
                </div>

                <div class="row">
                    <label for="comenceTime">Início do jogo:</label>
                    <Input
                        value={comenceTime}
                        type="text"
                        placeholder="Início do jogo"
                        onChange={(e) => [setComenceTime(e.target.value), setError("")]}
                    />
                </div>

                <div class="row">
                    <label for="odd">Odd do jogo:</label>
                    <Input
                        value={odd}
                        type="text"
                        placeholder="Odd"
                        onChange={(e) => [setOdd(e.target.value), setError("")]}
                    />
                </div>

                { error.trim() !== '' && <label className='error-label'>{error}</label>}
                <button>Adicionar</button>
            </form>
        </div>
    )
}