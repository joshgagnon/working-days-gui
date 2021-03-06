/// <reference path="../../typings/globals/redux-form/index.d.ts" />
import * as React from "react";
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker'
import * as Calendar from 'react-widgets/lib/Calendar';
import * as moment from 'moment';
import * as momentLocalizer from 'react-widgets/lib/localizers/moment'
import { reduxForm, FieldProp } from 'redux-form'

momentLocalizer(moment);

interface DayComponent  {
    dayComponent?: React.ComponentClass<any>;
    value: string
}


export class DateInput extends React.Component<FieldProp & DayComponent, any> {

    render() {
        const format="D MMMM YYYY";
        const readFormats = [format, "D M YYYY", "D MMM YYYY", "D/M/YYYY", "D-M-YYYY"]
        return <DateTimePicker
            {...this.props}
            time={false}
            value={this.props.value ? new Date(this.props.value): null }
            onChange={(date, string) => this.props.onChange(string)}
            parse={(value) => {
                const mo = moment(value, readFormats);
                return mo.isValid() ? mo.toDate() : null;
                }
            }
            footerFormat={format}
            dayComponent={this.props.dayComponent}
            format={format} />
    }
}




export class CalendarView extends React.Component<DayComponent, any> {

    render() {
        const format="D MMMM YYYY";
        const readFormats = [format, "D M YYYY", "D MMM YYYY", "D/M/YYYY", "D-M-YYYY"];
        const value = moment(this.props.value, readFormats);
        return <Calendar
            value={value.isValid() ? value.toDate() : null}
            onChange={() => ({})}
            footerFormat={format}
            dayComponent={this.props.dayComponent}
            />
    }
}
