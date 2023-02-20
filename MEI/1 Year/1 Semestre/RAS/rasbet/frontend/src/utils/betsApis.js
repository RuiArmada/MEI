import { Bet } from "../models/Bet";

export const placeBet = async (bets, payment) => {
    const userToken = localStorage.getItem("user_token")

    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
            bets,
            payment
        })
    }).then(res => res.json());
    return data
}

export const getBetsHistory = async () => {
    const userToken = localStorage.getItem("user_token")

    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bets`, {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    }).then(res => res.json());

    const bets = data.map(bet => new Bet(bet.id, bet.game, bet.odd))
    return bets
}

export const cancelBet = async (betId) => {
    const userToken = localStorage.getItem("user_token")
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bets`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({ betId })
    }).then(res => res.json())
    console.log(data)
    data.betsHistory = data.betsHistory.map(bet => new Bet(bet.id, bet.game, bet.odd))

    return data
}