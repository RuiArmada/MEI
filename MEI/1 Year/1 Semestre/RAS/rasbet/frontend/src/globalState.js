import reducers from "./stateReducers";
import { GlobalState } from "./models/GlobalState";

export const initialState = new GlobalState();

export const globalStateReducer = (state, action) => {
    const actionFunction = reducers.get(action.type);
    if (actionFunction !== undefined) return actionFunction(state, action);
    else return state;
}