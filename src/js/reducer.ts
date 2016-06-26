import { combineReducers } from 'redux';
import { Action } from './actions.ts'
import { reducer as formReducer} from 'redux-form';



const results = (state = {result: ''}, action) => {
    switch(action.type){
        case 'UPDATE_RESULT':
            return Object.assign({}, state, action.payload);
    }
    return state;
}

const rootReducer = combineReducers({
    results: results,
    form: formReducer
});

export default rootReducer;