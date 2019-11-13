import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {
  HeaderDetails,
  Header,
  ItemMeta,
  Item,
  Period,
  SectionItem, Section,
  Text, Events
} from './ngx-time-scheduler.model';
import * as moment_ from 'moment';

const moment = moment_;

@Component({
  selector: 'ngx-ts[items][periods][sections]',
  templateUrl: './ngx-time-scheduler.component.html',
  styleUrls: ['./ngx-time-scheduler.component.css']
})
export class NgxTimeSchedulerComponent implements OnInit {
  @ViewChild('sectionTd', {static: false}) set SectionTd(elementRef: ElementRef) {
    this.SectionLeftMeasure = elementRef.nativeElement.clientWidth + 'px';
    this.changeDetector.detectChanges();
  }

  @Input() currentTimeFormat = 'DD-MMM-YYYY HH:mm';
  @Input() showCurrentTime = true;
  @Input() showGoto = true;
  @Input() showToday = true;
  @Input() allowDragging = false;
  // @Input() allowResizing = false;
  @Input() showBusinessDayOnly = false;
  @Input() headerFormat = 'Do MMM YYYY';
  @Input() minRowHeight = 40;
  @Input() maxHeight: string = null;
  @Input() text = new Text();
  @Input() items: Item[];
  @Input() sections: Section[];
  @Input() periods: Period[];
  @Input() events: Events = new Events();
  @Input() start = moment().startOf('day');

  end = moment().endOf('day');
  showGotoModal = false;
  currentTimeIndicatorPosition: string;
  currentTimeVisibility = 'visible';
  currentTimeTitle: string;
  ShowCurrentTimeHandle = null;
  SectionLeftMeasure = '0';
  currentPeriod: Period;
  currentPeriodMinuteDiff = 0;
  header: Header[];
  sectionItems: SectionItem[];

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setSectionsInSectionItems();
    this.changePeriod(this.periods[0]);
  }

  trackByFn(index, item) {
    return index;
  }

  setSectionsInSectionItems() {
    this.sectionItems = new Array<SectionItem>();
    this.sections.forEach(section => {
      const perSectionItem = new SectionItem();
      perSectionItem.section = section;
      perSectionItem.minRowHeight = this.minRowHeight;
      this.sectionItems.push(perSectionItem);
    });
  }

  setItemsInSectionItems() {
    this.sectionItems.forEach(ele => {
      let itemCounts = 0;
      ele.itemMetas = new Array<ItemMeta>();
      ele.minRowHeight = this.minRowHeight;

      this.items.filter(i => {
        let itemMeta = new ItemMeta();

        if (i.sectionID === ele.section.id) {
          itemMeta.item = i;
          if (itemMeta.item.start <= this.end && itemMeta.item.end >= this.start) {

            itemMeta = this.itemMetaCal(itemMeta, itemCounts);
            itemCounts++;
            ele.minRowHeight = itemCounts * this.minRowHeight;
            ele.itemMetas.push(itemMeta);
          }
        }
      });
    });
  }

  itemMetaCal(itemMeta: ItemMeta, itemCounts: number) {
    const foundStart = moment.max(itemMeta.item.start, this.start);
    const foundEnd = moment.min(itemMeta.item.end, this.end);

    let widthMinuteDiff = Math.abs(foundStart.diff(foundEnd, 'minutes'));
    let leftMinuteDiff = foundStart.diff(this.start, 'minutes');
    if (this.showBusinessDayOnly) {
      widthMinuteDiff -= (this.getNumberOfWeekendDays(moment(foundStart), moment(foundEnd)) * this.currentPeriod.timeFramePeriod);
      leftMinuteDiff -= (this.getNumberOfWeekendDays(moment(this.start), moment(foundStart)) * this.currentPeriod.timeFramePeriod);
    }

    itemMeta.cssTop = itemCounts * this.minRowHeight;
    itemMeta.cssLeft = (leftMinuteDiff / this.currentPeriodMinuteDiff) * 100;
    itemMeta.cssWidth = (widthMinuteDiff / this.currentPeriodMinuteDiff) * 100;

    if (itemMeta.item.start >= this.start) {
      itemMeta.isStart = true;
    }
    if (itemMeta.item.end <= this.end) {
      itemMeta.isEnd = true;
    }

    return itemMeta;
  }

  changePeriod(period: Period) {
    this.currentPeriod = period;
    const _start = this.start;
    this.end = moment(_start).add(this.currentPeriod.timeFrameOverall, 'minutes').endOf('day');
    this.currentPeriodMinuteDiff = Math.abs(this.start.diff(this.end, 'minutes'));

    if (this.showBusinessDayOnly) {
      this.currentPeriodMinuteDiff -=
        (this.getNumberOfWeekendDays(moment(this.start), moment(this.end)) * this.currentPeriod.timeFramePeriod);
    }

    this.header = new Array<Header>();
    this.currentPeriod.timeFrameHeaders.forEach(ele => {
      this.header.push(this.getDatesBetweenTwoDates(ele));
    });

    this.setItemsInSectionItems();
    this.showCurrentTimeIndicator();
  }

  showCurrentTimeIndicator = () => {
    if (this.ShowCurrentTimeHandle) {
      clearTimeout(this.ShowCurrentTimeHandle);
    }

    const currentTime = moment();
    if (currentTime >= this.start && currentTime <= this.end) {
      this.currentTimeVisibility = 'visible';
      this.currentTimeIndicatorPosition = (
        (Math.abs(this.start.diff(currentTime, 'minutes')) / this.currentPeriodMinuteDiff) * 100
      ) + '%';
      this.currentTimeTitle = currentTime.format(this.currentTimeFormat );
    } else {
      this.currentTimeVisibility = 'hidden';
    }

    this.ShowCurrentTimeHandle = setTimeout(this.ShowCurrentTimeHandle, 30000);
  }

  gotoToday() {
    this.start = moment().startOf('day');
    this.changePeriod(this.currentPeriod);
  }

  nextPeriod() {
    this.start.add(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  previousPeriod() {
    this.start.subtract(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  gotoDate(event: any) {
    this.showGotoModal = false;
    this.start = moment(event).startOf('day');
    this.changePeriod(this.currentPeriod);
  }

  getDatesBetweenTwoDates(format): Header {
    const now = moment(this.start);
    const dates = new Header();
    let prev: string;
    let colspan = 0;

    while (now.isBefore(this.end) || now.isSame(this.end)) {
      if (!this.showBusinessDayOnly || (now.day() !== 0 && now.day() !== 6)) {
        const headerDetails = new HeaderDetails();
        headerDetails.name = now.format(format);
        if (prev && prev !== headerDetails.name) {
          colspan = 1;
        } else {
          colspan++;
          dates.headerDetails.pop();
        }
        prev = headerDetails.name;
        headerDetails.colspan = colspan;
        dates.headerDetails.push(headerDetails);
      }
      now.add(this.currentPeriod.timeFramePeriod, 'minutes');
    }
    return dates;
  }

  getNumberOfWeekendDays(startDate, endDate) {
    let count = 0;
    while (startDate.isBefore(endDate) || startDate.isSame(endDate)) {
      if ((startDate.day() === 0 || startDate.day() === 6)) {
        count++;
      }
      startDate.add(this.currentPeriod.timeFramePeriod, 'minutes');
    }
    return count;
  }

  drop(event: CdkDragDrop<Section>) {
    event.item.data.sectionID = event.container.data.id;
    this.setSectionsInSectionItems();
    this.changePeriod(this.currentPeriod);
    this.events.ItemDropped(event.item.data);
  }

}
