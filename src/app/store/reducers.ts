import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { IState, IAppState, initialAppState, } from './state';
import { AppActions, ActionTypes } from './actions';
import { navReducer } from './nav-reducer';
/**
 * Application Reducer
 */

export function appReducer(state = initialAppState, action: AppActions.AllActions): IAppState {
    switch (action.type) {
        case ActionTypes.ADD_SHIFT:
            return {
                ...state,
                shifts: [...state.shifts, action.shift]
            };
        case ActionTypes.EDIT_SHIFT:
            const shiftIndex = state.shifts.findIndex(s => s.name.localeCompare(action.shift.name) === 0);
            return {
                ...state,
                shifts: [...state.shifts.slice(0, shiftIndex), action.shift, ...state.shifts.slice(shiftIndex + 1)]
            };
        case ActionTypes.REMOVE_SHIFT:
            return {
                ...state,
                shifts: state.shifts.filter(s => s.name !== action.name)
            };
        case ActionTypes.ADD_SITE:
            return {
                ...state,
                sites: [...state.sites, action.site]
            };
        case ActionTypes.EDIT_SITE:
            const siteIndex = state.sites.findIndex(s => s.name.localeCompare(action.site.name) === 0);
            return {
                ...state,
                sites: [...state.sites.slice(0, siteIndex), action.site, ...state.sites.slice(siteIndex + 1)]
            };
        case ActionTypes.ADD_SCHEDULE:
            return {
                ...state,
                schedule: [...state.schedule, ...action.schedule]
            };
        default:
            return state;
    }
}

export const reducer: ActionReducerMap<IState> = {
    nav: navReducer,
    app: appReducer
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: ['app'], rehydrate: true, storageKeySerializer: () => 'cShiftSchedule' })(reducer)
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
