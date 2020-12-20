import {Component, OnInit} from '@angular/core';
import {Item, Period, Section, Events} from '../../projects/ngx-time-scheduler-resize/src/lib/ngx-time-scheduler-resize.model';
import {NgxTimeSchedulerResizeService} from '../../projects/ngx-time-scheduler-resize/src/lib/ngx-time-scheduler-resize.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  eventOutput = '';

  events: Events = new Events();
  periods: Period[];
  sections: Section[];
  items: Item[];
  itemCount = 3;
  sectionCount = 10;

  constructor(private service: NgxTimeSchedulerResizeService) {
    this.events.SectionClickEvent = (section) => {
      this.eventOutput += '\n' + JSON.stringify(section);
    };
    this.events.SectionContextMenuEvent = (section, {x, y}: MouseEvent) => {
      this.eventOutput += '\n' + JSON.stringify(section) + ',' + JSON.stringify({x, y});
    };
    this.events.ItemClicked = (item, event) => {
     // console.log("ITems clicked event ");
      this.eventOutput += '\n' + JSON.stringify(item) +  " ," + event.clientX;
    };
    this.events.ItemContextMenu = (item, {x, y}: MouseEvent) => {
      // console.log("Coming here 1"+ JSON.stringify(item) + " ," + JSON.stringify({x, y}));
      this.eventOutput += '\n' + JSON.stringify(item) + ',' + JSON.stringify({x, y});
    };
    this.events.ItemDropped = (item) => {
      this.eventOutput += '\n' + JSON.stringify(item);
    };
    this.events.PeriodChange = (start, end) => {
      this.eventOutput += '\n' + JSON.stringify(start) + ',' + JSON.stringify(end);
    };

    this.events.ItemResizedEnd = (item,start,end)=>{
      //console.log("Item resize end");
      this.eventOutput += '\n'  + JSON.stringify(end) + " Item," + JSON.stringify(item);
    }

    this.events.newItemContextMenu=(section,eventclick)=>{
      this.eventOutput += '\n' + JSON.stringify(section) + " Event-" + JSON.stringify(eventclick + " "+ eventclick.clientX + ","+eventclick.clientY);
    }
    this.periods = [
      {
        name: '2 week',
        timeFrameHeaders: ['MMM YYYY', 'DD(ddd)'],
        timeFrameHeadersTooltip: ['MMM YYYY', 'DD(ddd)'],
        classes: '',
        timeFrameOverall: 1440 * 14,
        timeFramePeriod: 1440,
      },
      {
        name: '3 days',
        timeFramePeriod: (60 * 3),
        timeFrameOverall: (60 * 24 * 3),
        timeFrameHeaders: [
          'Do MMM',
          'HH'
        ],
        classes: 'period-3day',
      }, {
        name: '1 week',
        timeFrameHeaders: ['MMM YYYY', 'DD(ddd)'],
        classes: '',
        timeFrameOverall: 1440 * 7,
        timeFramePeriod: 1440,
      }];

    this.sections = [{
      name: 'A',
      id: 1
    }, {
      name: 'B',
      id: 2
    }, {
      name: 'C',
      id: 3
    }, {
      name: 'D',
      id: 4
    }, {
      name: 'E',
      id: 5
    }, {
      name: 'F',
      id: 6
    }, {
      name: 'G',
      id: 7
    }];

    this.items = [{
      id: 1,
      sectionID: 1,
      name: 'Item 1',
      start: moment().startOf('day'),
      end: moment().add(5, 'days').endOf('day'),
      cstyles:   {'background-color':'green'},
      classes: '',
      cstdata: '',
    }, {
      id: 2,
      sectionID: 3,
      name: 'Item 2',
      start: moment().startOf('day'),
      end: moment().add(4, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    }, {
      id: 3,
      sectionID: 1,
      name: 'Item 3',
      start: moment().add(1, 'days').startOf('day'),
      end: moment().add(3, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    }, {
      id: 4,
      sectionID: 3,
      name: 'Item 4',
      start: moment().add(1, 'days').startOf('day'),
      end: moment().add(3, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    }, {
      id: 5,
      sectionID: 1,
      name: 'Item 5',
      start: moment().add(7, 'days').startOf('day'),
      end: moment().add(8, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    }, {
      id: 6,
      sectionID: 1,
      name: 'Item 6',
      start: moment().subtract(3, 'days').startOf('day'),
      end: moment().subtract(1, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    }, {
      id: 7,
      sectionID: 1,
      name: 'Item 7',
      start: moment().subtract(2, 'days').startOf('day'),
      end: moment().add(2, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    }, {
      id: 8,
      sectionID: 1,
      name: 'Item 8',
      start: moment().add(3, 'days').startOf('day'),
      end: moment().add(7, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    }, {
      id: 9,
      sectionID: 1,
      name: 'Item 9',
      start: moment().subtract(2, 'days').startOf('day'),
      end: moment().add(7, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: {'cstname':'thiscomponent','role':'developer'},
    }];

  }//end of constructors

  ngOnInit() {
  }

  addItem() {
    this.itemCount++;
    this.service.itemPush({
      id: this.itemCount,
      sectionID: 5,
      name: 'Item ' + this.itemCount,
      start: moment().startOf('day'),
      end: moment().add(3, 'days').endOf('day'),
      classes: '',
      cstyles:'',
      cstdata: '',
    });
  }

  popItem() {
    this.service.itemPop();
  }

  removeItem() {
    this.service.itemRemove(4);
  }

  addSection() {
    this.sectionCount++;
    this.service.sectionPush({
      id: this.sectionCount,
      name: 'Section ' + this.sectionCount
    });
  }

  popSection() {
    this.service.sectionPop();
  }

  removeSection() {
    this.service.sectionRemove(4);
  }

  refresh() {
    this.service.refresh();
  }

}
