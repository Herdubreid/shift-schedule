import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppActions, NavActions, IState, IShift } from '../store';

@Component({
  selector: 'app-shift-detail',
  templateUrl: './shift-detail.component.html',
  styleUrls: ['./shift-detail.component.scss']
})
export class ShiftDetailComponent implements OnInit, OnDestroy {
  filter: Observable<IShift[]>;
  shifts: IShift[];
  form: FormGroup;
  subs: Subscription[] = [];
  ok() {
    const shift = this.shifts.find(s => s.name.toLowerCase()
      .localeCompare(this.form.value.name.toLowerCase()) === 0);
    if (shift) {
      this.store.dispatch(new AppActions.EditShiftAction(this.form.value));
    } else {
      this.store.dispatch(new AppActions.AddShiftAction(this.form.value));
    }
    this.dlg.close();
  }
  blur() {
    const shift = this.shifts.find(s => s.name.toLowerCase()
      .localeCompare(this.form.value.name.toLowerCase()) === 0);
    if (shift) {
      this.form.setValue({
        name: shift.name,
        start: shift.start,
        duration: shift.duration
      });
    }
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      start: [null, [Validators.required, Validators.min(0), Validators.max(23)]],
      duration: [null, [Validators.required, Validators.min(1), Validators.max(24)]]
    });
    this.filter = this.form.get('name').valueChanges
      .pipe(
        startWith(''),
        map(v => this.shifts.filter(s => s.name.toLowerCase().includes(v.toLowerCase()))
        ));
  }
  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  constructor(
    private fb: FormBuilder,
    private dlg: MatDialogRef<ShiftDetailComponent>,
    private store: Store<IState>
  ) {
    this.subs.push(store.select(s => s.app.shifts).subscribe(shifts => this.shifts = shifts));
  }
}
