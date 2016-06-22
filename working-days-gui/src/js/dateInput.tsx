/// <reference path="../../typings/globals/redux-form/index.d.ts" />
import * as React from "react";
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker'
import * as moment from 'moment';
import * as momentLocalizer from 'react-widgets/lib/localizers/moment'
import { reduxForm, FieldProp } from 'redux-form'


momentLocalizer(moment);



export default class DateInput extends React.Component<FieldProp, any> {

    render() {
        const format="D MMMM YYYY";
        const readFormats = [format, "D M YYYY", "D MMM YYYY", "D/M/YYYY", "D-M-YYYY"]
        return <DateTimePicker
            {...this.props}
            time={false}
            value={this.props.value ? new Date(this.props.value): null }
            onChange={(date, string) => this.props.onChange(string)}
            parse={(string) => {
                const mo = moment(string, readFormats)
                return mo.isValid() ? mo.toDate() : null;
                }
            }
            format={format} />
    }
}