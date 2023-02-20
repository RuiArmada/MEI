import "../../css/items/BetCard.scss";

export const BetCard = ({ bet, onCardClick, onRemoveBetClick, cancel }) => {
    const parseTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const currDate = new Date();
        const currDayString = `${currDate.getDate()}/${currDate.getMonth()}/${currDate.getFullYear()}`;
        const dayString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        const hourString = `${String(date.getHours()).padStart(
            2,
            "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}`;

        return currDayString === dayString
            ? `Hoje  ${hourString}`
            : `${dayString}  ${hourString}`;
    }

    const cardClick = (bet) => {
        if(onCardClick) onCardClick(bet)
    }

    return (
        <div className="bet-card" onClick={() => cardClick(bet)}>
            <header>
                <div className="betcard-id">
                    <label> {bet.gameName} </label>
                    <label> {parseTimestamp(bet.commenceTime)} </label>
                </div>

            <button
                className={cancel ? 'cancel-btn' : ''}
                onClick={() => onRemoveBetClick(bet.id)}>
                    { cancel ? 'Cancelar' : 'X' }
            </button>
                
            </header>

            <hr />

            <div className="bet-info">
                <label>
                    Resultado:
                    {bet.result === "Draw" ? " Empate" : ` ${bet.result} vence`}
                </label>
                <div className="bet-odd-label">Cota: {bet.odd}</div>
                <label>{bet.total}€</label>
            </div>
        </div>
    );
};
