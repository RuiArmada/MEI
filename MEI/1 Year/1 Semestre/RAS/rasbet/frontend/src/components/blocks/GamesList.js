import { useState } from 'react'
import { GameCard } from '../items/GameCard'
import '../../css/blocks/GamesList.scss'
import { Bet } from '../../models/Bet'

export const GamesList = ({
    game,
    gamesList,
    setGamesList,
    betsList,
    setBetsList
}) => {
    const [ searchText, setSearchText ] = useState('')

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value)
    }

    const selectOdd = (gameId, odd) => {
        let newBets = [...betsList]
        let updatedGames = gamesList
        const tmpGame = updatedGames[gameId]
        const oddId = tmpGame.id + '_' + odd.name
        tmpGame.odds[oddId].selected = !tmpGame.odds[oddId].selected

        updatedGames[tmpGame.id] = tmpGame

        if(tmpGame.odds[oddId].selected) {
            const betId = tmpGame.id + '_' + odd.name
            const newBet = new Bet(betId, tmpGame, odd)
            newBets.push(newBet)
        } else
            newBets = newBets.filter(bet => bet.id !== oddId)
        setGamesList(updatedGames)
        // dispatch({ type: 'setBetsList', value: newBets })
        setBetsList(newBets)
    }

    return (
        <div className='gameslist-container'>
            <div className='searchbar-container'>
                <input
                    onChange={onSearchTextChange}
                    type="text"
                    placeholder='Pesquisar'
                    value={searchText}/>
            </div>
            
            { game !== 'football' && game !== 'basketball'
            ?
                <div className='gameslist'>
                    <h1 className='game-available-soon'>Jogo disponível brevemente</h1>
                </div>
            : <div className='gameslist'>
                {
                (gamesList && Object.values(gamesList).length > 0) ?
                    Object.values(gamesList).map((game, i) => 
                        <GameCard key={i} game={game} onOddClick={selectOdd} />
                    )
                : <label className='no-games-label'>Sem jogos disponíveis</label>
                }
            </div> }
        
      </div>
    )
}