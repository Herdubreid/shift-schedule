import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { of, empty } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as Moment from 'moment';

import { NavActions, NavTypes } from './nav-actions';
import { AppActions, ActionTypes } from './actions';
import { IState, IPeriod, ISchedule } from './state';
import { IExtend, RESOLUTION, resolutions, period } from './nav-state';

@Injectable()
export class EffectsService {
    displaySchedule(period: IPeriod, schedule: ISchedule[]): ISchedule[] {
        return schedule
            .filter(d => Moment(d.period.from).isBefore(period.to) &&
                Moment(d.period.to).isAfter(period.from))
            .map<ISchedule>((d, seq) => {
                const offset = {
                    from: Moment(d.period.from).isBefore(period.from) ? period.from : d.period.from,
                    to: Moment(d.period.to).isAfter(period.to) ? period.to : d.period.to
                };
                const r = {
                    ...d,
                    seq,
                    offset
                };
                return r;
            })
            .sort((a, b) => Moment(a.period.from).isBefore(b.period.from) ? -1 : 1);
    }
    @Effect()
    toggleRun$ = this.actions$.ofType<NavActions.ToggleRunAction>(NavTypes.TOGGLE_RUN)
        .pipe(
            switchMap(_ => of(new NavActions.ToggleSideNavAction()))
        );
    @Effect()
    setResolution$ = this.actions$.ofType<NavActions.SetResolutionAction>(NavTypes.SET_RESOLUTION)
        .pipe(
            map(action => action.res),
            withLatestFrom(this.store),
            switchMap(([res, store]) => {
                const today = new Date();
                today.setHours(today.getHours(), 0, 0, 0);
                const extend: IExtend = {
                    resolution: resolutions.find(r => r.type === res),
                    period: {
                        from: today,
                        to: today
                    }
                };
                switch (res) {
                    case RESOLUTION.DAY:
                        extend.period.to = Moment(today).add(24, 'h').toDate()
                        break;
                    case RESOLUTION.WEEK:
                        extend.period.to = Moment(today).add(1, 'w').toDate();
                        break;
                    case RESOLUTION.FORTNIGHT:
                        extend.period.to = Moment(today).add(2, 'w').toDate();
                        break;
                    case RESOLUTION.MONTH:
                        extend.period.to = Moment(today).add(1, 'M').toDate();
                        break;
                    case RESOLUTION.QUARTER:
                        extend.period.to = Moment(today).add(1, 'Q').toDate();
                        break;
                    case RESOLUTION.HALF_YEAR:
                        extend.period.to = Moment(today).add(2, 'Q').toDate();
                        break;
                    case RESOLUTION.YEAR:
                        extend.period.to = Moment(today).add(1, 'y').toDate();
                        break;
                }
                return of(new NavActions.UpdateExtendAction(
                    extend,
                    this.displaySchedule(extend.period, store.app.schedule)
                ));
            })
        );
    @Effect()
    addSerie$ = this.actions$.ofType<AppActions.AddSerieAction>(ActionTypes.ADD_SERIE)
        .pipe(
            map(action => action.serie),
            withLatestFrom(this.store),
            switchMap(([serie, store]) => {
                const shift = store.app.shifts.find(s => s.name.localeCompare(serie.shift) === 0);
                const start = Moment(serie.start);
                start.startOf('day').hour(shift.start);
                const schedule = Array(serie.repeat)
                    .fill(null)
                    .map<ISchedule>((_, seq) => {
                        start.add(seq ? serie.daysOn + serie.daysOff : 0, 'd');
                        const end = Moment(start).add(serie.daysOn - 1, 'd').add(shift.duration, 'h');
                        const period = {
                            from: start.toDate(),
                            to: end.toDate()
                        };
                        return {
                            site: serie.site,
                            shift,
                            seq,
                            period,
                            offset: { ...period }
                        };
                    });
                return of(new AppActions.AddScheduleAction(schedule));
            })
        );
    @Effect()
    updateSchedule$ = this.actions$.ofType<AppActions.AddScheduleAction>(ActionTypes.ADD_SCHEDULE)
        .pipe(
            withLatestFrom(this.store),
            switchMap(([_, store]) => of(new NavActions.UpdateScheduleAction(store.app.schedule)))
        );
    constructor(
        private actions$: Actions,
        private store: Store<IState>
    ) { }
}
