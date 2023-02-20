import { useState, useEffect, useCallback } from 'react'
import { getFootballGames, getBasketballGames } from '../../utils/gamesApi'
import '../../css/views/GamesListView.scss'
import { PaymentModal } from '../blocks/PaymentModal.js'
import { BetsList } from '../blocks/BetsList.js'
import { GamesList } from '../blocks/GamesList.js'
import { useUserAuth } from '../../hooks/useAuth'
import { useNavigate } from "react-router-dom";

function GamesListView({game}) {
  const { signout } = useUserAuth()
  const nav = useNavigate()
  const [ betsList, setBetsList ] = useState([])
  const [ gamesList, setGamesList ] = useState({})
  const [ displayPaymentModal, setDisplayPaymentModal ] = useState(false)

  const fetchGamesList = useCallback(async () => {
    let newGamesList = []
    switch(game) {
      case 'football':
        newGamesList = await getFootballGames()
        break
      case 'basketball':
        newGamesList = await getBasketballGames()
        break
      default:
    }
    if(newGamesList.name == 'Error') {
      switch(parseInt(newGamesList.message)) {
        case 401:
        case 403:
          signout()
          nav('/signin')
        default:
          console.log("An error occured")
      }
      return 
    }

    const currGamesList = { ...gamesList }
    currGamesList[game] = newGamesList
    console.log(currGamesList)
    setGamesList(currGamesList)

  }, [game])

  const clearBets = () => {
    setBetsList([])
  }

  useEffect(() => {
    fetchGamesList()
    clearBets()
  }, [game, fetchGamesList])

  const updateGamesList = newGamesList => {
    const currGame = game
    const currGamesList = { ...gamesList }
    currGamesList[currGame] = newGamesList
    setGamesList(currGamesList)
  }

  return (
    <main className="gameslistview-container">
      <GamesList
        game={game}
        gamesList={gamesList[game]}
        setGamesList={updateGamesList}
        betsList={betsList}
        setBetsList={setBetsList}
      />
      
      { displayPaymentModal &&
          <PaymentModal
            bets={betsList}
            closeModal={() => setDisplayPaymentModal(false)}
          />
      }

      <BetsList
        game={game}
        gamesList={gamesList[game]}
        setGamesList={updateGamesList}
        betsList={betsList}
        setBetsList={setBetsList}
        setDisplayPaymentModal={setDisplayPaymentModal}
      />
    </main>
  );
}

export default GamesListView;
