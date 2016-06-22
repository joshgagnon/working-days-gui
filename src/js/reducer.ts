import { combineReducers } from 'redux';
import { Action } from './actions.ts'
import {reducer as formReducer} from 'redux-form';

const requests = (state = {}, action) => {
    return state;
}

const rootReducer = combineReducers({
    requests: requests,
    form: formReducer
});

export default rootReducer;