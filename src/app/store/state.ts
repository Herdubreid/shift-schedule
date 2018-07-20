import { INavState, initialNavState } from './nav-state';
/**
 * Application State
 */
export interface IPeriod {
    from: Date;
    to: Date;
}
export interface ISerie {
    site: string;
    shift: string;
    start: Date;
    daysOn: number;
    daysOff: number;
    repeat: number;
}
export interface IShift {
    name: string;
    start: number;
    duration: number;
}
export interface ISite {
    name: string;
    shifts: string[];
}
export interface ISchedule {
    site: string;
    shift: IShift;
    seq: number;
    period: IPeriod;
    offset: IPeriod;
}
export interface IAppState {
    sites: ISite[];
    shifts: IShift[];
    schedule: ISchedule[];
}
export interface IState {
    nav: INavState;
    app: IAppState;
}
export const initialAppState: IAppState = {
    sites: [],
    shifts: [],
    schedule: []
};
export const initialState: IState = {
    nav: initialNavState,
    app: initialAppState
};
