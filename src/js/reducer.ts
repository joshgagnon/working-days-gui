import { combineReducers } from 'redux';
import { Action } from './actions.ts'
import {reducer as formReducer} from 'redux-form';

export type Data = {
  amount: number;
  scheme: string;
  units: string;
  region?: string;
  start_date: string;
  inclusion: number;
  direction: string;
};


const requests = (state = {}, action) => {
    return state;
}

const rootReducer = combineReducers({
    requests: requests,
    form: formReducer
});

export default rootReducer;