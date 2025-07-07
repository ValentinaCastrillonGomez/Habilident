import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { NativeDateAdapter } from "@angular/material/core";
import moment from "moment";

export const APP_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
        timeInput: 'HH:mm',
    },
    display: {
        dateInput: 'dd/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'fullDate',
        monthYearA11yLabel: 'MMM YYYY',
        timeInput: 'HH:mm',
        timeOptionLabel: 'HH:mm'
    }
};

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {

    override format(date: Date, displayFormat: string): string {
        return formatDate(date, displayFormat, this.locale);
    }

    override parse(value: any, parseFormat: string): Date | null {
        const date = moment(value, parseFormat);
        return date.isValid() ? date.toDate() : null;
    }
}