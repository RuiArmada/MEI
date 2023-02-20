import { createContext, Dispatch, useContext, useReducer } from 'react';
import { GlobalState } from './models/GlobalState';

const defaultState = new GlobalState();
const StateContext = createContext({ state: defaultState, dispatch: value => {} });

// export const StateContext = createContext(myContext);
export const useStateValue = () => useContext(StateContext);

export const StateProvider = ({ reducer, initialState, children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};