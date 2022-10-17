import { createStore,combineReducers,applyMiddleware } from "redux";
import userReducer from "../reducers/users";
import thunk from 'redux-thunk'
import mailReducer from "../reducers/mail";
import {composeWithDevTools} from 'redux-devtools-extension';

const store=createStore(
    combineReducers({
        user:userReducer,
        mail:mailReducer
    }),
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;