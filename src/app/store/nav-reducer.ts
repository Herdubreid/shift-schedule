import { INavState, initialNavState } from './nav-state';
import { NavTypes, NavActions } from './nav-actions';

export function navReducer(state = initialNavState, action: NavActions.AllActions): INavState {
    switch (action.type) {
        case NavTypes.UPDATE_EXTEND:
            return {
                ...state,
                dirty: true,
                extend: action.extend,
                schedule: action.schedule
            };
        case NavTypes.UPDATE_SCHEDULE:
            return {
                ...state,
                dirty: true,
                schedule: action.schedule
            };
        case NavTypes.TOGGLE_UPDATE:
            return {
                ...state,
                dirty: !state.dirty
            };
        case NavTypes.TOGGLE_SIDENAV:
            return {
                ...state,
                sideNav: !state.sideNav
            };
        case NavTypes.TOGGLE_RUN:
            return {
                ...state,
                running: !state.running
            };
        default:
            return state;
    }
}
