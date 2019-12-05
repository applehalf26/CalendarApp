import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import {AlertController, ModalController} from '@ionic/angular';
import {formatDate} from '@angular/common';
import {Router} from '@angular/router';
import {Global} from '../globals/global';
import {EventPage} from '../event/event.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

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

  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;

  constructor(private router: Router, private alertCtrl: AlertController,
              private  modalCtrl: ModalController, @Inject(LOCALE_ID)private locale: string) {
    this.categoryList = Global.categoryList;
    console.log(this.categoryList);
  }

  ngOnInit() {
    if (Global.id === '') {
      this.router.navigate(['/login']);
    }
    this.resetEvent();
    this.resetCategory();
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
    this.event.title = 'sample';
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

  addEvent() {
    console.log(this.event);
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
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
    this.resetCategory();
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
  }

  async onEventSelected(event) {
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    if (this.calendar.mode === 'month') {
      this.openEventModal(event);
    } else {
      const alert = await this.alertCtrl.create({
        header: event.title,
        subHeader: event.category,
        message: 'From: ' + start + '<br><br>To: ' + end,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  getCategory(ev) {
    console.log(ev.target.value);
    this.category = this.categoryList[ev.target.value];
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
    console.log(this.category);
  }

  setRadio(item) {
    this.event.radio.forEach(value => {
      value.contents = false;
    })
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

    return await modal.present();
  }

  logOut() {
    Global.id = '';
    Global.password = '';
    this.router.navigate(['login']);
  }
}


