import { GluegunToolbox } from 'gluegun/build/types/domain/toolbox';
import { DateTime, Interval } from 'luxon';

export interface IToolbox extends GluegunToolbox {
    print: {
        warnmark: string;
    } & GluegunToolbox['print'];
}

export enum TrackingProviders {
    absence = 'absence',
}

export class NaiveInterval {
    public start: DateTime;
    public end?: DateTime;
    get duration(): string {
        return `${Interval.fromDateTimes(this.start, this.end).toDuration().toFormat('hh:mm')} [hh:mm]`;
    }
    constructor(start: string | DateTime, end?: string | DateTime) {
        this.start = typeof start === 'string' ? DateTime.fromISO(start) : start;
        if (!end) this.end = undefined;
        if (DateTime.isDateTime(end)) this.end = end;
        if (typeof end === 'string') this.end = DateTime.fromISO(end);
    }
}
