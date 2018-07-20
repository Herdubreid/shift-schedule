import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ShiftDetailComponent } from '../shift-detail/shift-detail.component';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { SerieDetailComponent } from '../serie-detail/serie-detail.component';
import { NavActions, IState } from '../store';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  running: Observable<boolean>;
  toggleRun() {
    this.store.dispatch(new NavActions.ToggleRunAction());
  }
  home() {
    this.router.navigate(['home']);
    this.store.dispatch(new NavActions.ToggleSideNavAction());
    this.store.dispatch(new NavActions.ToggleUpdatedAction());
  }
  edit() {
    this.router.navigate(['edit']);
    this.store.dispatch(new NavActions.ToggleSideNavAction());
  }
  editShift() {
    this.dlg.open(ShiftDetailComponent, {
      disableClose: true
    });
  }
  editSite() {
    this.dlg.open(SiteDetailComponent, {
      disableClose: true,
      data: {
        name: '',
        shifts: []
      }
    });
  }
  addSerie() {
    this.dlg.open(SerieDetailComponent, {
      disableClose: true
    });
  }
  ngOnInit() {
  }
  constructor(
    private router: Router,
    private store: Store<IState>,
    private dlg: MatDialog
  ) {
    this.running = store.select(s => s.nav.running);
  }
}
