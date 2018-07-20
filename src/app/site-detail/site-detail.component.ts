import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppActions,IState, ISite, IShift } from '../store';

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.scss']
})
export class SiteDetailComponent implements OnInit, OnDestroy {
  filter: Observable<ISite[]>;
  sites: ISite[];
  shifts: IShift[];
  form: FormGroup;
  subs: Subscription[] = [];
  ok() {
    const site = this.sites.find(s => s.name.toLocaleLowerCase()
      .localeCompare(this.form.value.name.toLocaleLowerCase()) === 0);
    if (site) {
      this.store.dispatch(new AppActions.EditSiteAction(this.form.value));
    } else {
      this.store.dispatch(new AppActions.AddSiteAction(this.form.value));
    }
    this.dlg.close();
  }
  blur() {
    const site = this.sites.find(s => s.name.toLocaleLowerCase()
      .localeCompare(this.form.value.name.toLocaleLowerCase()) === 0);
    if (site) {
      this.form.setValue({
        name: site.name,
        shifts: site.shifts
      });
    }
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: [this.site.name, Validators.required],
      shifts: [this.site.shifts]
    });
    this.filter = this.form.get('name').valueChanges
      .pipe(
        startWith(''),
        map(v => this.sites.filter(s => s.name.toLowerCase().includes(v.toLowerCase()))
        ));
  }
  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  constructor(
    private fb: FormBuilder,
    private dlg: MatDialogRef<SiteDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private site: ISite,
    private store: Store<IState>
  ) {
    this.subs.push(store.select(s => s.app.sites).subscribe(s => this.sites = s));
    this.subs.push(store.select(s => s.app.shifts).subscribe(s => this.shifts = s));
  }
}
