import { useEffect, useState } from "react";
import { cancelBet, getBetsHistory } from "../../utils/betsApis.js";
import { BetCard } from "../items/BetCard.js";
import '../../css/views/BetsHistoryView.scss'

export const BetsHistoryView = () => {
    const [ bets, setBets ] = useState([])

    const cancelBetRequest = async (betId) => {
        const response = await cancelBet(betId)
        if(response.status)
            setBets(response.betsHistory)
    }

    const fetchBetsHistory = async () => {
        const betsHistory = await getBetsHistory()
        setBets(betsHistory)
    }

    useEffect(() => { fetchBetsHistory() }, [])

    return (
        <main className="bets-history-container">
            <h2>Histórico de Apostas</h2>
            <div className="betshist-list-container">
                {(bets && bets.length > 0)
                ? bets.map(bet => 
                    <BetCard
                        key={bet.id}
                        bet={bet}
                        cancel={true}
                        onRemoveBetClick={cancelBetRequest} />
                )
                : (
                    <div className="no-bets-label">
                        <hr className="solid"></hr>
                        <p>Sem Apostas</p>
                    </div>
                )}
            </div>
        </main>
    )
}
