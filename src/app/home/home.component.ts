import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { withLatestFrom, filter, switchMap } from 'rxjs/operators';
import * as d3 from 'd3';
import * as Moment from 'moment';

import { debounce } from '../decorators';
import { IState, ISite, IShift, IExtend, ISchedule, RESOLUTION, NavActions } from '../store';
import { SiteDetailComponent } from '../site-detail/site-detail.component';

interface IDisplay extends ISchedule {
  height?: number;
  width?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('gantt') ganttElement: ElementRef;
  width = 0;
  height = 0;
  subs: Subscription[] = [];
  margin = {
    top: 5,
    right: 10,
    bottom: 5,
    left: 10
  };
  extend: IExtend;
  sites: ISite[] = [];
  schedule: IDisplay[] = [];
  @HostListener('window:resize')
  @debounce(500)
  onResize() {
    console.log('Resize', this.ganttElement.nativeElement);
    if ((this.width !== this.ganttElement.nativeElement.clientWidth - this.margin.left - this.margin.right) ||
      (this.height !== this.ganttElement.nativeElement.clientHeight - this.margin.top - this.margin.bottom)) {
      this.update();
    }
  }
  editSite(name: string) {
    const site = this.sites.find(s => s.name.localeCompare(name) === 0);
    this.dlg.open(SiteDetailComponent, {
      data: site
    });
  }
  axisX(x: d3.ScaleTime<number, number>): any {
    switch (this.extend.resolution.type) {
      case RESOLUTION.DAY:
        return d3.axisBottom(x)
          .ticks(d3.timeHour)
          .tickFormat(d3.timeFormat('%H'));
      case RESOLUTION.WEEK:
      case RESOLUTION.FORTNIGHT:
        return d3.axisBottom(x)
          .ticks(d3.timeDay);
      case RESOLUTION.MONTH:
        return d3.axisBottom(x)
          .ticks(d3.timeWeek);
    }
    return d3.axisBottom(x)
      .ticks(d3.timeMonth);
  }
  getSchedule(site: string): ISchedule[] {
    return this.extend.resolution.type < RESOLUTION.MONTH
      ?
      this.schedule.filter(d => d.site.localeCompare(site) === 0).map(s => {
        const duration = Moment.duration(Moment(s.period.to).diff(Moment(s.period.from.setHours(s.shift.start))));
        const shifts: ISchedule[] = Array(
          Math.ceil(duration.as('h') / s.shift.duration)
        )
          .fill(null)
          .map((_, i) => {
            const from = Moment(s.period.from).add(i, 'd').toDate();
            const to = Moment(from).add(s.shift.duration, 'h').toDate();
            return {
              ...s,
              period: {
                from,
                to
              },
              offset: {
                from: Moment(from).isBefore(this.extend.period.from) ? this.extend.period.from : from,
                to: Moment(to).isAfter(this.extend.period.to) ? this.extend.period.to : to
              }
            };
          });
        return shifts
          .filter(s => Moment(s.period.from).isBefore(this.extend.period.to) &&
            Moment(s.period.to).isAfter(this.extend.period.from));
      }).reduce((a, c) => {
        a.push(...c);
        return a;
      }, [])
      : this.schedule.filter(d => d.site.localeCompare(site) === 0);
  }
  update() {
    // Init
    this.width = this.ganttElement.nativeElement.clientWidth - this.margin.left - this.margin.right;
    this.height = this.ganttElement.nativeElement.clientHeight - this.margin.top - this.margin.bottom;
    console.log('Scale:', this.width, this.height);
    const x = d3.scaleTime()
      .domain([this.extend.period.from, this.extend.period.to])
      .range([15, this.width - 15]);
    const ySite = d3.scaleBand()
      .domain(this.sites.map(s => s.name))
      .range([20, this.height - 1])
      .padding(.1);
    const gantt = d3.select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    gantt
      .select('.x-axis')
      .transition(d3.transition().duration(300))
      .call(this.axisX(x));

    // Site
    const sites = gantt
      .selectAll<d3.BaseType, ISite>('.site')
      .data(this.sites, d => d.name);
    sites.exit()
      .remove();

    const shiftEnter = sites.enter()
      .append('g')
      .attr('id', d => d.name)
      .attr('class', 'site');
    shiftEnter
      .append('rect')
      .attr('stroke', 'black')
      .attr('stroke-width', '1px')
      .attr('fill', 'snow')
      .attr('opacity', .02);
    shiftEnter
      .append('text')
      .attr('class', 'site-label')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(d => d.name)
      .style('opacity', 0.1)
      .on('click', d => this.editSite(d.name));

    gantt
      .selectAll<d3.BaseType, ISite>('.site')
      .attr('transform', d => `translate(15, ${ySite(d.name)})`)
      .selectAll('rect')
      .attr('height', _ => ySite.bandwidth())
      .attr('width', _ => this.width - 30);
    gantt
      .selectAll<d3.BaseType, ISite>('.site-label')
      .attr('x', _ => (this.width - 30) / 2)
      .attr('y', d => ySite.bandwidth() / 2)
      .style('font-size', (_, i, a: any[]) => {
        const fontSize = a[i].style.fontSize ? +a[i].style.fontSize.slice(0, -2) : 12;
        const ratio = Math.min((this.width - 80) / a[i].getBBox().width, ySite.bandwidth() / a[i].getBBox().height);
        return `${Math.round(ratio * fontSize)}px`;
      });

    // Shift
    gantt.selectAll<d3.BaseType, ISite>('.site')
      .filter(site => site.shifts !== null)
      .each(site => {
        const yShift = d3.scaleBand()
          .domain(site.shifts)
          .range([0, ySite.bandwidth()])
          .padding(.05);

        // Shift
        const shifts = d3.select(`#${site.name}`)
          .selectAll<d3.BaseType, IShift>('.shift')
          .data(site.shifts);
        shifts.exit()
          .remove();
        shifts.enter()
          .append('rect')
          .merge(shifts)
          .attr('class', 'shift')
          .attr('fill', 'lightgray')
          .attr('opacity', .2)
          .attr('transform', d => `translate(1, ${yShift(d)})`)
          .attr('height', _ => yShift.bandwidth())
          .attr('width', _ => this.width - 32);

        // Schedule
        const siteSel = gantt.select(`#${site.name}`);
        const schedule = siteSel
          .selectAll<d3.BaseType, IDisplay>('.schedule')
          .data(this.getSchedule(site.name), d => `${d.site}-${d.seq}-${d.offset.from}-${d.offset.to}`);
        schedule.exit()
          .remove();

        const scheduleEnter = schedule.enter()
          .append('g')
          .attr('class', 'schedule')

        scheduleEnter
          .append('rect')
          .attr('fill', 'steelblue')
          .attr('opacity', 0.5)
          .attr('rx', 4)
          .attr('ry', 4)
          .on('mouseover', d => console.log('mouseover:', d.period));
        scheduleEnter
          .append('text')
          .attr('x', 10)
          .attr('y', 20)
          .style('fill', 'white')
          .text(d => `${Moment(d.period.from)
            .format(this.extend.resolution.type < RESOLUTION.MONTH ? 'hA' : 'ddd Do')}`);
        scheduleEnter
          .append('text')
          .attr('x', 10)
          .attr('y', 40)
          .style('fill', 'white')
          .text(d => `${Moment(d.period.to)
            .format(this.extend.resolution.type < RESOLUTION.MONTH ? 'hA' : 'ddd Do')}`);

        siteSel
          .selectAll<SVGRectElement, IDisplay>('.schedule')
          .attr('transform', d => `translate(${x(d.offset.from) - 15},${yShift(d.shift.name)})`)
          .selectAll<d3.ContainerElement, IDisplay>('rect')
          .attr('height', d => d.height ? d.height : yShift.bandwidth())
          .attr('width', d => d.width ? d.width : x(d.offset.to) - x(d.offset.from))
          .transition(d3.transition().duration(200))
          .attr('height', d => {
            d.height = yShift.bandwidth();
            return d.height;
          })
          .attr('width', d => {
            d.width = x(d.offset.to) - x(d.offset.from);
            return d.width;
          });
      });
  }
  ngOnInit() {
    console.log('Resize', this.ganttElement.nativeElement.clientWidth);
    const svg = d3.select('svg')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .style('font-size', '12px');
    svg.append('g')
      .attr('class', 'x-axis');
    this.subs.push(this.store
      .select(s => s.nav.dirty)
      .pipe(
        filter(d => d),
        withLatestFrom(this.store)
      )
      .subscribe(([_, store]) => {
        this.extend = store.nav.extend;
        this.schedule = store.nav.schedule;
        this.sites = store.app.sites;
        this.store.dispatch(new NavActions.ToggleUpdatedAction());
        this.update();
      }));
  }
  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  constructor(
    private dlg: MatDialog,
    private store: Store<IState>
  ) {
  }
}
