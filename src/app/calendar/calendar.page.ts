import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import {Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {Global} from '../globals/global';
import {formatDate} from '@angular/common';
import {EventPage} from '../event/event.page';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  event = {
    title: '',
    category: '',
    checkbox: [],
    radio: [],
    input: [],
    textarea: [],
    startTime: '',
    endTime: '',
    allDay: false
  };

  minDate = new Date().toISOString();

  eventSource = [];

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  viewTitle = '';

  /* Category */
  category = {
    title: '',
    checkbox: [],
    radio: [],
    input: [],
    textarea: [],
    color: 'light',
  };

  categoryList = [];

  setStartTime = true;

  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;

  openEvent: any;

  constructor(private router: Router, private alertCtrl: AlertController, private http: HttpClient,
              private  modalCtrl: ModalController, @Inject(LOCALE_ID)private locale: string) {
  }

  ngOnInit() {
    this.resetEvent();
    this.resetCategory();

    // 페이지 로드
  }

  ionViewWillEnter() {
    console.log('aa');
    if (Global.id === '') {
      this.router.navigate(['/login']);
    } else {
      this.eventSource = [];
      // 이벤트 추가
      Global.eventList.forEach( ent => {
        this.addEventOne(ent);
      });
      console.table(this.eventSource);
      this.categoryList = Global.categoryList;
      console.log(this.categoryList);
    }
  }

  resetEvent() {
    this.event = {
      title: '',
      category: '',
      checkbox: [],
      radio: [],
      input: [],
      textarea: [],
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
    this.event.title = 'title';
    this.setStartTime = true;
  }

  resetEventCat() {
    this.event.category = '';
    this.event.checkbox = [];
    this.event.radio = [];
    this.event.input = [];
    this.event.textarea = [];
  }

  resetCategory() {
    this.category = {
      title: '',
      checkbox: [],
      radio: [],
      input: [],
      textarea: [],
      color: 'light',
    };
  }

  async addEvent() {
    const event = {
      id: Global.id,
      title: this.event.title,
      category: this.event.category,
      checkbox: this.event.checkbox,
      radio: this.event.radio,
      input: this.event.input,
      textarea: this.event.textarea,
      startTime: new Date(this.event.startTime).toISOString(),
      endTime: new Date(this.event.endTime).toISOString(),
      allDay: this.event.allDay,
      color: this.category.color
    };

    if (event.allDay) {
      let start = new Date(event.startTime);
      let end = new Date(event.endTime);

      event.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())).toISOString();
      event.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1)).toISOString();
    }

    console.table(event);

    const postResult = await Global.postAsync(this.http, '/event/add', event);

    if (postResult.success === true) {

      console.log('Save Succeed');
      Global.eventList.push(event);
      let eventCopy = {
        title: this.event.title,
        category: this.event.category,
        checkbox: this.event.checkbox,
        radio: this.event.radio,
        input: this.event.input,
        textarea: this.event.textarea,
        startTime: new Date(this.event.startTime),
        endTime: new Date(this.event.endTime),
        allDay: this.event.allDay,
      };

      if (eventCopy.allDay) {
        let start = eventCopy.startTime;
        let end = eventCopy.endTime;

        eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
        eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
      }
      console.log(eventCopy);
      this.eventSource.push(eventCopy);
      this.myCal.loadEvents();
      this.resetEvent();
      this.resetCategory();
      console.table(Global.eventList);
      console.table(this.eventSource);
    } else {
      alert(postResult.message);
    }
  }

  addEventOne(prmEvent) {

    let eventCopy = {
      title: prmEvent.title,
      category: prmEvent.category,
      checkbox: prmEvent.checkbox,
      radio: prmEvent.radio,
      input: prmEvent.input,
      textarea: prmEvent.textarea,
      startTime: new Date(prmEvent.startTime),
      endTime: new Date(prmEvent.endTime),
      allDay: prmEvent.allDay,
    };

    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  today() {
    this.calendar.currentDate = new Date();
    console.log(this.event);
    // console.log(new Date('2019-12-08T11:49:11.635Z'));
  }

  async onEventSelected(event) {
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    if (!this.openEvent)
      this.openEventModal(event);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  /*onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }*/
  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);

    if (this.calendar.mode === 'month') {
      this.event.startTime = selected.toISOString();
      this.event.endTime = (selected.toISOString());
    } else {
      if (this.setStartTime) {
        this.event.startTime = selected.toISOString();
      } else {
        this.event.endTime = (selected.toISOString());
      }
    }


    this.setStartTime = !this.setStartTime;
  }

  getCategory(ev) {
    console.log(ev.target.value);
    this.category = this.categoryList[ev.target.value];
    console.log(this.category);
    this.event.category = this.category.title;
    this.category.checkbox.forEach(value => {
      this.event.checkbox.push({ name: value, contents: false });
    });
    this.category.radio.forEach(value => {
      this.event.radio.push({ name: value, contents: false });
    });
    this.category.input.forEach(value => {
      this.event.input.push({ name: value, contents: '' });
    });
    this.category.textarea.forEach(value => {
      this.event.textarea.push({ name: value, contents: '' });
    });
    console.log(this.event);
  }

  setRadio(item) {
    this.event.radio.forEach(value => {
      value.contents = false;
    });
    item.contents = true;
    console.log(this.event);
  }

  async openEventModal(event) {
    const modal = await this.modalCtrl.create({
      component: EventPage,
      componentProps: {
        event
      }
    });
    modal.onDidDismiss().then( (value) => {
      if (Global.eventList.length !== this.eventSource.length) {
        console.log(value.data);
        // this.eventSource.splice(value.data.index, 1);

          if (Global.delIndex !== -1) {
              this.eventSource.splice(Global.delIndex, 1);
              Global.delIndex = -1;
          }


        console.table(this.eventSource);
      }
      this.myCal.loadEvents();
    });
    return await modal.present();
  }

  logOut() {
    Global.id = '';
    Global.password = '';
    this.router.navigate(['login']);
  }
}
