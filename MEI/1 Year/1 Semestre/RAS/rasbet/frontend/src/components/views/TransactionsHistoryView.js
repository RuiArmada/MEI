import { useEffect, useState } from "react";
import "../../css/blocks/TransactionsHistoryModal.scss";
import { getTransactionsHistory } from "../../utils/transactionsApi";
import { TransactionCard } from "../items/TransactionCard.js";

export const TransactionsHistoryView = () => {
    const [ transactionsList, setTransactionsList ] = useState([])

    const fetchTransactionsHistory = async () => {
        const { transactions } = await getTransactionsHistory()

        setTransactionsList(transactions)
    }

    useEffect(() => {
        fetchTransactionsHistory()
    }, [])

    // }
    // const transactionsList = [
    //     {
    //         transactionType: "deposit",
    //         value: "20",
    //         date: "2022-12-02T19:30:00.000Z",
    //     },
    //     {
    //         transactionType: "withdraw",
    //         value: "10",
    //         date: "2022-12-19T12:30:00.000Z",
    //     },
    //     {
    //         transactionType: "deposit",
    //         value: "100",
    //         date: "2022-10-09T14:15:00.000Z",
    //     },
    // ]

    return (
        <div className="transactions-history-container">
            <h2>Histórico de Transações</h2>
            <div className="transactions-modal">
                {transactionsList && transactionsList.length > 0 ? (
                    transactionsList.map((transaction, i) => (
                        <TransactionCard key={i} transaction={transaction} />
                    ))
                ) : (
                    <dic className="no-transactions-label">
                        <hr className="solid"></hr>
                        <p>Sem Transações</p>
                    </dic>
                )}
            </div>
        </div>
    )
}
