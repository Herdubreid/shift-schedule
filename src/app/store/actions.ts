import { Action } from '@ngrx/store';

import { IExtend, ISerie, IShift, ISite, ISchedule, RESOLUTION } from './';

/**
 * Application Actions
 */
export enum ActionTypes {
    ADD_SHIFT = 'ADD_SHIFT',
    EDIT_SHIFT = 'EDIT_SHIFT',
    REMOVE_SHIFT = 'REMOVE_SHIFT',
    ADD_SITE = 'ADD_SITE',
    EDIT_SITE = 'EDIT_SITE',
    ADD_SERIE = 'ADD_SERIE',
    ADD_SCHEDULE = 'ADD_SCHEDULE'
}
export namespace AppActions {
    export class AddShiftAction implements Action {
        readonly type = ActionTypes.ADD_SHIFT;
        constructor(public shift: IShift) { }
    }
    export class EditShiftAction implements Action {
        readonly type = ActionTypes.EDIT_SHIFT;
        constructor(public shift: IShift) { }
    }
    export class RemoveShiftAction implements Action {
        readonly type = ActionTypes.REMOVE_SHIFT;
        constructor(public name: string, public seq: number) { }
    }
    export class AddSiteAction implements Action {
        readonly type = ActionTypes.ADD_SITE;
        constructor(public site: ISite) { }
    }
    export class EditSiteAction implements Action {
        readonly type = ActionTypes.EDIT_SITE;
        constructor(public site: ISite) { }
    }
    export class AddSerieAction implements Action {
        readonly type = ActionTypes.ADD_SERIE;
        constructor(public serie: ISerie) { }
    }
    export class AddScheduleAction implements Action {
        readonly type = ActionTypes.ADD_SCHEDULE;
        constructor(public schedule: ISchedule[]) { }
    }
    export type AllActions =
        AddShiftAction |
        EditShiftAction |
        RemoveShiftAction |
        AddSiteAction |
        EditSiteAction |
        AddSerieAction |
        AddScheduleAction;
}
