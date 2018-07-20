import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IState, ISchedule } from '../store'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  schedule: Observable<ISchedule[]>;
  change(each, fromDate, toDate) {
    console.log('Change:', each, fromDate, toDate);
  }
  ngOnInit() {
  }
  constructor(
    private store: Store<IState>
  ) {
    this.schedule = store.select(s => s.nav.schedule);
  }
}
