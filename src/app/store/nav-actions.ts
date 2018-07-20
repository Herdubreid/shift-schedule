import { Action } from '@ngrx/store';

import { RESOLUTION, IExtend } from './nav-state';
import { ISchedule } from './state';
/**
 * Navigation Action
 */

export enum NavTypes {
    SET_RESOLUTION = 'NAV_SET_RESOLUTION',
    UPDATE_EXTEND = 'NAV_UPDATE_EXTEND',
    UPDATE_SCHEDULE = 'NAV_UPDATE_SCHEDULE',
    TOGGLE_UPDATE = 'NAV_TOGGLE_UPDATED',
    TOGGLE_SIDENAV = 'NAV_TOGGLE_SIDENAV',
    TOGGLE_RUN = 'NAV_TOGGLE_RUN'
}

export namespace NavActions {
    export class SetResolutionAction implements Action {
        readonly type = NavTypes.SET_RESOLUTION;
        constructor(public res: RESOLUTION) { }
    }
    export class UpdateExtendAction implements Action {
        readonly type = NavTypes.UPDATE_EXTEND;
        constructor(public extend: IExtend, public schedule: ISchedule[]) { }
    }
    export class UpdateScheduleAction implements Action {
        readonly type = NavTypes.UPDATE_SCHEDULE;
        constructor(public schedule: ISchedule[]) { }
    }
    export class ToggleUpdatedAction implements Action {
        readonly type = NavTypes.TOGGLE_UPDATE;
    }
    export class ToggleSideNavAction implements Action {
        readonly type = NavTypes.TOGGLE_SIDENAV;
        constructor() { }
    }
    export class ToggleRunAction implements Action {
        readonly type = NavTypes.TOGGLE_RUN;
        constructor() { }
    }
    export type AllActions =
        SetResolutionAction |
        UpdateExtendAction |
        UpdateScheduleAction |
        ToggleUpdatedAction |
        ToggleSideNavAction |
        ToggleRunAction;
}