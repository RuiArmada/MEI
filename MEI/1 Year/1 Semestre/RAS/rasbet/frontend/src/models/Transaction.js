export class Transaction {
    constructor(transactionType, value, date) {
        this.transactionType = transactionType // string - deposit or withdraw
        this.value = value
        this.date = date
    }
}

