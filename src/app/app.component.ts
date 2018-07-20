import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import * as Moment from 'moment';

import { IState, AppActions, NavActions, IExtend, resolutions, RESOLUTION } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sideNav: Observable<boolean>;
  extend: Observable<IExtend>;
  resolutions = resolutions;
  changeResolution(e) {
    this.store.dispatch(new NavActions.SetResolutionAction(e.value));
  }
  toggleSideNav() {
    this.store.dispatch(new NavActions.ToggleSideNavAction());
  }
  ngOnInit() {
    this.store.dispatch(new NavActions.SetResolutionAction(RESOLUTION.DAY));
  }
  constructor(
    private store: Store<IState>
  ) {
    this.sideNav = store.select<boolean>(s => s.nav.sideNav);
    this.extend = store.select<IExtend>(s => s.nav.extend);
  }
}
