
export const getTransactionsHistory = async () => {
    const userToken = localStorage.getItem("user_token")
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/transactions`, {
        headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        },
    }).then(res => res.json());
    return data
}

// export const createTransaction = async () => {
//     const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({ userData })
//     }).then(res => res.json());
//     return data
// }
