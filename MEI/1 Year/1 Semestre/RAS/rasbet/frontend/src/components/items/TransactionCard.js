import "../../css/items/TransactionCard.scss";

export const TransactionCard = ({ transaction }) => {
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
    };

    return (
        <div className="transaction-card">
            <p>{parseTimestamp(transaction.createdAt)}h</p>
            <div className="transaction-value-info">
                {transaction.type === "ADD" ? (
                    <p>+ {transaction.value}€</p>
                ) : (
                    <p>- {transaction.value}€</p>
                )}
            </div>
        </div>
    );
};
