import * as React from "react";
import * as ReactDOM from "react-dom";
import rootReducer from './reducer.ts';
import { Provider } from 'react-redux';
import { Store, createStore } from 'redux';
import '../style/style.scss';
import DateInput from './dateInput.tsx';
import { reduxForm, ReduxFormProps } from 'redux-form';

interface EmptyProps { }


const initialState = {};

const store = createStore(rootReducer, initialState);


const fields = ['startDate']

class WorkingDaysForm extends React.Component<ReduxFormProps, {}> {
    render() {
        const {
        fields: { startDate },
          } = this.props;
        return <DateInput {...startDate}/>
    }
}

const WorkingDaysFormConnected = reduxForm({
  form: 'simple',
  fields
})(WorkingDaysForm)

class WorkingDays extends React.Component<EmptyProps, {}> {
    render() {
        return <div className="container">
            <div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <WorkingDaysFormConnected />
                </div>
            </div>
        </div>
    }
}


class App extends React.Component<EmptyProps, {}> {

    render() {
        return <div className="main">
            <WorkingDays />
        </div>
    }
}


ReactDOM.render(
    <Provider store={store}>
    <App />
  </Provider>,
    document.getElementById("main")
);
