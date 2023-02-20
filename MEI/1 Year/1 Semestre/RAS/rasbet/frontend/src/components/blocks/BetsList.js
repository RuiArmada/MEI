import { useState, useEffect, useCallback } from "react";
import { BetCard } from "../items/BetCard.js";
import { BetTypeButtons } from "../items/BetTypeButtons";
import "../../css/blocks/BetsList.scss";
import { BetType } from "../../models/BetType.js";
// import { useStateValue } from '../../state';

export const BetsList = ({
    game,
    gamesList,
    setGamesList,
    betsList,
    setBetsList,
    setDisplayPaymentModal,
}) => {
    // const { state, dispatch } = useStateValue();
    const [betTotal, setBetTotal] = useState(0.0);
    const [selectedBet, setSelectedBet] = useState(null);
    const [betType, setBetType] = useState(BetType.Simple);

    const calcBetTotal = useCallback(
        (bets) => {
            if (bets.length === 0) return 0;

            let newBetTotal =
                betType === BetType.Simple
                    ? bets.reduce((acc, b) => (acc += b.total * b.odd), 0) // Single bet
                    : bets.reduce((acc, b) => (acc *= b.total * b.odd), 1); // Multiple bet
            console.log(bets, newBetTotal);
            return newBetTotal.toFixed(2);
        },
        [betType]
    );

    const removeBet = (betId) => {
      const updatedBetsList = [...betsList].filter(bet => bet.id !== betId)
  
      const updatedGames = gamesList[game]
      const [ gameId ] = betId.split('_')
      updatedGames[gameId].odds[betId].selected = !updatedGames[gameId].odds[betId].selected
  
    //   dispatch({ type: 'setBetsList', value: updatedBetsList })
      setBetsList(updatedBetsList)
      setGamesList(updatedGames)
    }

    const onSelectedBetValueChange = (e) => {
        let updatedBetValue = e.currentTarget.value;
        let selectedBetIndex = 0;

        const updatedBetsList = [...betsList].map((bet, i) => {
            // Change bet value
            if (bet.id === selectedBet.id) {
                if (updatedBetValue !== "")
                    bet.total = parseFloat(updatedBetValue);
                selectedBetIndex = i;
            }
            return bet;
        });

        //   dispatch({ type: 'setBetsList', value: updatedBetsList })
        setBetsList(updatedBetsList);
        setSelectedBet(updatedBetsList[selectedBetIndex]);
    };

    const openPaymentModal = () => {
        if (betTotal > 0) setDisplayPaymentModal(true);
    };

    // Whenever the bets list is modified or the
    // bet type changes, update the bet total
    useEffect(() => {
        setBetTotal(calcBetTotal(betsList));
    }, [betsList, betType, calcBetTotal]);

    return (
        <div className="betlist-container">
            <h2>Boletim</h2>

            <BetTypeButtons betType={betType} changeBetType={setBetType} />

            <div className="bets-list">
                {
                    betsList.map((bet) => (
                        <BetCard
                            key={bet.id}
                            bet={bet}
                            onRemoveBetClick={removeBet}
                            onCardClick={setSelectedBet} />))
                }
            </div>

            <div className="bottom-container">
                {selectedBet && (
                    <div className="flex-horizontal">
                        <div className="bet-odd-label">
                            Cota: {selectedBet.odd}
                        </div>
                        <table className="price-container">
                            <tbody>
                                <tr>
                                    <td>
                                        <label>Montante</label>
                                    </td>
                                    <td>
                                        <input
                                            pattern="[0-9]*"
                                            type="number"
                                            value={selectedBet.total}
                                            onChange={onSelectedBetValueChange}
                                        />
                                        €
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex-horizontal">
                    <div className="totalWins">
                        <label>Total de ganhos</label>
                        <label className="orange-text">{betTotal}€</label>
                    </div>
                    <button disabled={betTotal <= 0} onClick={openPaymentModal}>
                        Apostar
                    </button>
                </div>
            </div>
        </div>
    );
};
