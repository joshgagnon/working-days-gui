import * as React from "react";
import * as ReactDOM from "react-dom";
import rootReducer from './reducer.ts';
import { Provider } from 'react-redux';
import { Store, createStore } from 'redux';
import '../style/style.scss';
import DateInput from './dateInput.tsx';
import { reduxForm, ReduxFormProps } from 'redux-form';
import { requestResult } from './actions.ts'
interface EmptyProps { }


const initialState = {};

const store = createStore(rootReducer, initialState);

const REGIONS = {
    'wellington_anniversary': 'Wellington',
    'auckland_anniversary': 'Auckland',
    'nelson_anniversary': 'Neslon',
    'taranaki_anniversary': 'Taranaki',
    'otago_anniversary': 'Otago',
    'southland_anniversary': 'Southland',
    'south_canterbury_anniversary': 'South Canterbury',
    'hawkes_bay_anniversary': 'Hawke\'s Bay',
    'marlborough_anniversary': 'Marlborough',
    'canterbury_anniversary': 'Canterbury',
    'westland_anniversary': 'Westland',
    'chatham_islands_anniversary': 'Chatham Islands'
}

const fields = ['scheme', 'start_date', 'amount', 'units', 'direction', 'region', 'inclusion', 'outDate']

class WorkingDaysForm extends React.Component<ReduxFormProps, {}> {

    regionSelect() {
        const {fields: { region}} = this.props;
        return <div className="form-group">
            <label>Region</label>
            <select {...region} className="form-control">
                { Object.keys(REGIONS).map((r, i) => {
                    return <option key={i} value={r}>{ REGIONS[r] }</option>
                }) }
            </select>
          </div>
    }

    render() {
        const { fields: { scheme, start_date, amount, units, direction, inclusion, outDate } } = this.props;
        return <form>
              <div className="form-group">
                <label>Scheme</label>
                <select {...scheme} className="form-control">
                    <option value="judicature">District, High and Court of Appeal</option>
                    <option value="interpretation">Interpretation Act 1999 and Companies Act 1993</option>
                    <option value="property">Property Law Act 2007</option>
                </select>
              </div>
                {scheme.value === 'property' && this.regionSelect() }
                <div className="form-group">
                    <label>Start Date</label>
                    <DateInput {...start_date}/>
                </div>
              <div className="form-group">
                <label>Units</label>
                <select {...units} className="form-control">
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="fortnights">Fortnights</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
              </div>
              <div className="form-group">
                <label>Direction</label>
                <select {...direction} className="form-control">
                    <option value="positive">Forwards</option>
                    <option value="negative">Backwards</option>
                </select>
              </div>

              <div className="form-group">
                <label>Inclusion</label>
               <select {...inclusion} className="form-control">
                   <option value="0">Include Start, Exclude End</option>
                   <option value="-1">Include Start, Include End</option>
                   <option value="1">Exclude Start, Exclude End</option>
                   <option value="0">Exclude Start, Include End</option>
               </select>
               </div>

        </form>
    }
}

const WorkingDaysFormConnected = reduxForm({
  form: 'simple',
  fields
})(WorkingDaysForm)


class WorkingDays extends React.Component<EmptyProps, {}> {

    submit() {

    }
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
