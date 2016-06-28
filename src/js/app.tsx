import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux';
import { Store, createStore } from 'redux';
import '../style/style.scss';
import DateInput from './dateInput.tsx';
import { reduxForm, ReduxFormProps, FormData } from 'redux-form';
import { updateResult } from './actions.ts'
import configureStore from './configureStore.ts';
import * as moment from 'moment';

import * as fetch from 'isomorphic-fetch';

const store = configureStore({});

const API_URL = DEV  ? 'http://localhost:5000' : 'http://api.catalex.nz'


function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


const serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const fetchResult = (data) => fetch(`${API_URL}?${serialize(data)}`)
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })


const initialValues = {
    start_date: moment(new Date()).format("D MMMM YYYY"),
    amount: 1,
    units: 'working_days',
    scheme: 'interpretation',
    direction: 'positive',
    inclusion: '0.0'

}

const REGIONS = {
    'wellington_anniversary': 'Wellington',
    'auckland_anniversary': 'Auckland',
    'nelson_anniversary': 'Nelson',
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

const USE_REGIONS = {
    'property': true,
    'land_transfer': true,
    'agreement_sale_purchase_real_estate': true
}

const STRINGS = {
    'xmas_ending_2nd': 'Christmas Break',
    'xmas_ending_5th': 'Christmas Break',
    'xmas_ending_15th': 'Christmas Break',
    'xmas_starting_20th_ending_10th': 'Christmas Break',
    'easter': 'Easter',
    'weekend': 'Weekend',
    'labour': 'Labour',
    'queens_bday': 'Queen\'s Birthday',
    'anzac': 'Anzac',
    'waitangi': 'Waitangi',
    'xmas': 'Christmas',
    'xmas_eve': 'Christmas Eve',
    'boxing': 'Boxing',
    'new_year': 'New Years',
    'second_jan': '2nd January'
};

const SCHEMES = {
    "agreement_sale_purchase_real_estate": "Agreement for Sale and Purchase of Real Estate",
    "court_of_appeal": "Court of Appeal Rules",
    "credit_contracts": "Credit Contracts and Consumer Finance Act 2003",
    "district_court": "District Court Rules 2014",
    "goods_services": "Goods and Services Tax Act 1985",
    "high_court": "High Court Rules",
    "income": "Income Tax Act 2007",
    "interpretation": "Interpretation Act 1999",
    "companies": "Companies Act 1993",
    "land_transfer": "Land Transfer Act 1952",
    "personal_property": "Personal Property Securities Act 1999 (except ss 165, 167A, 168 and 178)",
    "personal_property_special": "Personal Property Securities Act 1999 (only for ss 165, 167A, 168 and 178)",
    "property": "Property Law Act 2007",
    "resource_management": "Resource Management Act 1991"
}

const SCHEME_LINKS = {
    "agreement_sale_purchase_real_estate": "http://www.adls.org.nz/media/7487526/4002-Sale-Purchase-of-Real-Estate-Ninth-Edition-2012-3-Highlighted.pdf",
    "court_of_appeal": "https://browser.catalex.nz/open_definition/13122-DLM95763;14882-DLM319771/",
    "credit_contracts": "https://browser.catalex.nz/open_definition/23990-DLM212731/",
    "district_court": "https://browser.catalex.nz/open_definition/24099-618b9f09-d1c1-47f8-8fdc-3797d010226c/",
    "goods_services": "https://browser.catalex.nz/open_definition/25220-DLM81796/",
    "high_court": "https://browser.catalex.nz/open_definition/24099-17db60aa-8089-4d41-8293-bccbddd0e5df/",
    "income": "https://browser.catalex.nz/open_definition/24871-DLM1522966/",
    "interpretation": "https://browser.catalex.nz/open_definition/5549-DLM31857/",
    "companies": "https://browser.catalex.nz/open_definition/25183-DLM319994/",
    "land_transfer": "https://browser.catalex.nz/open_definition/24506-DLM270010/",
    "personal_property": "https://browser.catalex.nz/open_definition/23918-DLM46184/",
    "personal_property_special": "https://browser.catalex.nz/open_definition/23918-DLM46184/",
    "property": "https://browser.catalex.nz/open_definition/23919-DLM969109/",
    "resource_management": "https://browser.catalex.nz/open_definition/24426-DLM231791/"
}

const TIME_LINK = 'https://browser.catalex.nz/open_article/instrument/DLM31881';

Object.keys(REGIONS).map(r => {
    STRINGS[r] = REGIONS[r] + ' Anniversary';

});

const fields = ['scheme', 'start_date', 'amount', 'units', 'direction', 'region', 'inclusion']

interface EmptyProps { }

interface IWorkingDaysForm extends ReduxFormProps {
    submit(data: FormData);
    initialValues: FormData;
}

interface IWorkingDays {
    submit(data: FormData);
}

type Stat = {
    count: number,
    flag: string
};

type Results = {
    result: string;
    days_count?: number;
    scheme?: string,
    stats?: Array<Stat>
};

interface IWorkingDaysProps {
    updateResult(results: Results);
    results: Results;
}

class WorkingDaysForm extends React.Component<IWorkingDaysForm, {}> {

    regionSelect(change) {
        const {fields: { region}} = this.props;
        const regionKeys = Object.keys(REGIONS);
        regionKeys.sort();
        return <div className="form-group">
            <label>Region</label>
            <select {...region} className="form-control"  onChange={change('region')}>
                <option value="">None</option>
                { regionKeys.map((r, i) => {
                    return <option key={i} value={r}>{ REGIONS[r] }</option>
                }) }
            </select>
          </div>
    }

    render() {
        const { fields: { scheme, start_date, amount, units, direction, inclusion }, submit } = this.props;

        const change = (name) => {
            return (value) => {
                if(value.target){
                    value = value.target.value;
                }
                this.props.fields[name].onChange(value);
                submit(Object.assign({}, this.props.values, {[name]: value}));
            }
        }
        const schemeKeys = Object.keys(SCHEMES);
        schemeKeys.sort();

        return <form>
                <div className="form-group">
                    <label>Start Date</label>
                    <DateInput {...start_date} onChange={change('start_date')}/>
                </div>
                <div>
                    <div className="col-custom col-2-5">
                  <div className="form-group">
                    <label>Units</label>
                    <select {...units} className="form-control" onChange={change('units')}>
                        <option value="working_days">Working Days</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="fortnights">Fortnights</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                  </div>
                  </div>
                  <div className="col-custom col-1-5">
                    <div className="form-group">
                        <label>Amount</label>
                        <input className="form-control" type="number" {...amount} onChange={change('amount')} />
                    </div>
                    </div>
                    <div className="col-custom col-2-5">
                  <div className="form-group">
                    <label>Direction</label>
                    <select {...direction} className="form-control"  onChange={change('direction')}>
                        <option value="positive">Forwards</option>
                        <option value="negative">Backwards</option>
                    </select>
                  </div>
                  </div>
              </div>
              <div className="form-group">
                <label>Definition</label>
                <select {...scheme} className="form-control"  onChange={change('scheme')}>
                    { schemeKeys.map((s, i) => {
                        return <option key={i} value={s}>{SCHEMES[s]}</option>
                    }) }
                </select>
              </div>
                { USE_REGIONS[scheme.value] && this.regionSelect(change) }
              <div className="form-group">
              <label>Time Period Description <a href={TIME_LINK} target="_blank">?</a></label>
               <select {...inclusion} className="form-control"  onChange={change('inclusion')}>
                    <option value="0.0">Beginning At, On, or With</option>
                    <option value="0.1">Beginning From, After</option>
                    <option value="1.2">Between</option>
                    <option value="0.3">Ending Before</option>
                    <option value="0.4">Ending By, On, With, Continuing To or Until</option>
                    <option value="0.5">Within</option>
               </select>
               </div>

        </form>
    }
}

const WorkingDaysFormConnected = reduxForm({
  form: 'simple',
  fields
})(WorkingDaysForm)





class WorkingDays extends React.Component<IWorkingDaysProps, any> implements IWorkingDays {

    constructor(props){
        super(props);
        this.submit = debounce(this.submit, 300, false);
    }

    componentDidMount() {
        this.submit(initialValues)
    }

    submit(data) {
        fetchResult(Object.assign({}, data, {start_date: moment(data.start_date, ["D MMMM YYYY"]).format('YYYY-M-D'), inclusion: data.inclusion.split('.')[0]}))
            .then(response => {
                const date = moment(response.result, "YYYY-M-D").format("D MMMM YYYY")
                this.props.updateResult({result: date,  days_count: response.days_count, stats: response.stats, scheme: data.scheme})
            })
            .catch(error => {
                this.props.updateResult({result: 'Invalid', stats: null})
            })
    }

    stats() {
        const stats = this.props.results.stats || [];
        const count = this.props.results.days_count;
        stats.sort((a, b) => {
            if(a.count === b.count){
                return  a.flag.localeCompare(b.flag)
            }
            return (a.count > b.count) ? -1 : 1
        })
        const list = stats.map((entry, i) => {
            const plural = entry.count > 1 ? 'Days' : 'Day';
            return <li key={i} className="list-group-item">
                { `${entry.count} ${STRINGS[entry.flag]} ${plural}` }
            </li>
        })
        return <div className="form-group">
                    <label>Summary</label>
                <ul className="list-group">
                    <li  className="list-group-item">
                        <a href={SCHEME_LINKS[this.props.results.scheme]} target="_blank">Definition Explanation</a>
                    </li>
                    { count !== undefined && <li className="list-group-item">{ Math.abs(count) } Total Days</li> }
                    { list }
                    </ul>
            </div>
    }

    render() {
        return <div className="container">
            <div className="row">
                <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
                    <WorkingDaysFormConnected submit={this.submit.bind(this)} initialValues={initialValues}/>
                    <div className="form-group">
                        <label>Result</label>
                        <div className="form-control"><strong>{ this.props.results.result}</strong></div>
                    </div>
                    { this.stats() }
                </div>
            </div>
        </div>
    }
}


const WorkingDaysConnected = connect((state: any):any => ({results: state.results}), {
    updateResult: updateResult
})(WorkingDays)

class App extends React.Component<EmptyProps, {}> {
    render() {
        return <div className="main">
            <WorkingDaysConnected />
        </div>
    }
}


ReactDOM.render(
    <Provider store={store}>
    <App />
  </Provider>,
    document.getElementById("main")
);
