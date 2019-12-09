import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Global} from '../globals/global';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

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

  color = 'primary';
  editEnable = false;

  preEvent = {
    title: '',
    startTime: '',
    endTime: '',
    allDay: false
  };

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.editEnable = false;
    this.resetEvent();
    this.copyEvent();
    /* category color http 통신 */
  }

  getCategory(name) {
    let color = 'light';
    Global.categoryList.forEach(value => {
      if (value.title === name){
        color = value.color;
      }
    });
    return color;
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
    this.preEvent = {
      title: '',
      startTime: '',
      endTime: '',
      allDay: false
    };
  }

  copyEvent() {
    console.table(this.navParams);
    let temp = this.navParams.data.event;
    this.preEvent.title = temp.title;
    this.preEvent.startTime = temp.startTime.toISOString();
    this.preEvent.endTime = temp.endTime.toISOString();
    this.preEvent.allDay = temp.allDay;
    this.event.title = temp.title;
    this.event.category = temp.category;
    this.event.startTime = temp.startTime.toISOString();
    this.event.endTime = temp.endTime.toISOString();
    this.event.allDay = temp.allDay;
    temp.checkbox.forEach(value => {
      this.event.checkbox.push({ name: value.name, contents: value.contents });
    });
    temp.radio.forEach(value => {
      this.event.radio.push({ name: value.name, contents: value.contents });
    });
    temp.input.forEach(value => {
      this.event.input.push({ name: value.name, contents: value.contents });
    });
    temp.textarea.forEach(value => {
      this.event.textarea.push({ name: value.name, contents: value.contents });
    });
    this.color = this.getCategory(this.event.category);
    console.table(this.event);
    console.table(temp);
  }

  setRadio(item) {
    this.event.radio.forEach(value => {
      value.contents = false;
    });
    item.contents = true;
    console.log(this.event);
  }

  async deleteEvent() {
    /*http*/
    const idx = Global.eventList.findIndex(x => x.title === this.preEvent.title
        && x.startTime === this.preEvent.startTime && x.endTime === this.preEvent.endTime);
    console.log(idx);
    console.log(this.preEvent);
    const dEvent = {
      id: Global.id,
      title: this.preEvent.title,
      startTime: this.preEvent.startTime,
      endTime: this.preEvent.endTime
    };

    const postResult = await Global.postAsync(this.http, '/event/delete', dEvent);
    if (postResult.success === true) {
      Global.eventList.splice(idx, 1);

      Global.delIndex = idx;

      this.resetEvent();
      console.table(Global.eventList);

      this.closeModal(idx);

    } else {
      alert(postResult.message);
    }

  }

    async editEvent() {
      const idx = Global.eventList.findIndex(x => x.title === this.preEvent.title
          && x.startTime === this.preEvent.startTime && x.endTime === this.preEvent.endTime);
      console.log(idx);
      console.log(this.preEvent);
      if (this.event.allDay) {
        let start = new Date(this.event.startTime);
        let end = new Date(this.event.endTime);

        this.event.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())).toISOString();
        if (!(this.event.endTime === this.preEvent.endTime && this.preEvent.allDay)) {
          this.event.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1)).toISOString();
        }
      }

      const EEvent = {
        id: Global.id,
        title: this.preEvent.title,
        startTime: this.preEvent.startTime,
        endTime: this.preEvent.endTime,
        new: this.event
      };

      const postResult = await Global.postAsync(this.http, '/event/modify', EEvent);

      console.table(EEvent);

      if (postResult.success === true) {
        Global.eventList[idx] = this.event;
        console.log(this.event);
        this.navParams.data.event.title = this.event.title;
        this.navParams.data.event.category = this.event.category;
        this.navParams.data.event.checkbox = this.event.checkbox;
        this.navParams.data.event.radio = this.event.radio;
        this.navParams.data.event.input = this.event.input;
        this.navParams.data.event.textarea = this.event.textarea;
        this.navParams.data.event.startTime = new Date(this.event.startTime);
        this.navParams.data.event.endTime = new Date(this.event.endTime);
        this.navParams.data.event.allDay = this.event.allDay;

        this.resetEvent();
        console.log(Global.eventList[idx]);
        console.table(Global.eventList);
        this.resetEvent();
        this.copyEvent();
        this.editEnable = false;
      } else {
        alert(postResult.message);
      }

    }

    async closeModal(data) {
      await this.modalCtrl.dismiss(data);

      await this.router.navigate(['/calendar']);
    }

  }
