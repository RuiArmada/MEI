

class ReducerActions {
    setBetsList = (state, action) => {
        return { ...state, betsList: action.value }
    }

    setAuthUser = (state, action) => {
        return { ...state, authUser: action.value }
    }
}

const reducers = new Map(Object.entries(new ReducerActions()))

export default reducers