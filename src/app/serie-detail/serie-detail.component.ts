import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppActions, IState, ISite } from '../store';

@Component({
  selector: 'app-serie-detail',
  templateUrl: './serie-detail.component.html',
  styleUrls: ['./serie-detail.component.scss']
})
export class SerieDetailComponent implements OnInit, OnDestroy {
  sites: ISite[] = [];
  shifts: string[] = [];
  form: FormGroup;
  subs: Subscription[] = [];
  ok() {
    this.store.dispatch(new AppActions.AddSerieAction(this.form.value));
    this.dlg.close();
  }
  selectSite(e) {
    const site = this.sites.find(s => s.name.localeCompare(e.value) === 0);
    this.shifts = site ? site.shifts : [];
  }
  ngOnInit() {
    this.form = this.fb.group({
      site: ['', Validators.required],
      shift: ['', Validators.required],
      start: [new Date, Validators.required],
      daysOn: ['', Validators.required],
      daysOff: ['', Validators.required],
      repeat: [1, Validators.required]
    });
  }
  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  constructor(
    private fb: FormBuilder,
    private dlg: MatDialogRef<SerieDetailComponent>,
    private store: Store<IState>
  ) {
    this.subs.push(store.select(s => s.app.sites).subscribe(s => this.sites = s));
  }
}
