
export const login = async creds => {
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(creds)
    }).then(res => res.json());
    return data
}

export const register = async userData => {
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userData })
    }).then(res => res.json());
    return data
}

export const validateToken = async () => {
    const userToken = localStorage.getItem("user_token")
    const userData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/validateToken`, {
        headers: { Authorization: `Bearer ${userToken}` },
    }).then(res => {
        if(res.status === 401 || res.status === 403)
            return new Error(res.status)
        return res.json()
    })
    .catch(res => res)

    return userData
}
