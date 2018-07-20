import * as Moment from 'moment';

import { IPeriod, ISchedule } from './';
/**
 * Navigation
 */
const today = new Date();
today.setHours(today.getHours(), 0, 0, 0);
export enum RESOLUTION {
    DAY = 0,
    WEEK = 1,
    FORTNIGHT = 2,
    MONTH = 3,
    QUARTER = 4,
    HALF_YEAR = 5,
    YEAR = 6
}
export interface IType {
    type: number;
    name: string;
}
export interface IExtend {
    resolution: IType;
    period: IPeriod;
}
export interface INavState {
    sideNav: boolean;
    running: boolean;
    dirty: boolean;
    extend: IExtend;
    schedule: ISchedule[];
}
export const resolutions: IType[] = [
    { type: RESOLUTION.DAY, name: 'Day' },
    { type: RESOLUTION.WEEK, name: 'Week' },
    { type: RESOLUTION.FORTNIGHT, name: 'Fortnight' },
    { type: RESOLUTION.MONTH, name: 'Month' },
    { type: RESOLUTION.QUARTER, name: 'Quarter' },
    { type: RESOLUTION.HALF_YEAR, name: 'Half Year' },
    { type: RESOLUTION.YEAR, name: 'Year' }
];
export const period = {
    from: today,
    to: Moment(today).add(25, 'h').toDate()
};
export const initialNavState: INavState = {
    sideNav: false,
    running: false,
    dirty: false,
    extend: {
        period,
        resolution: resolutions[0],
    },
    schedule: []
}
