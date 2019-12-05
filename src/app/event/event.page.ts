import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

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

  constructor(private modalCtrl: ModalController, private navParams: NavParams) {
  }

  ngOnInit() {
    this.editEnable = false;
    this.resetEvent();
    this.copyEvent();
    /* category color http 통신 */
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
  }

  copyEvent() {
    console.table(this.navParams);
    let temp = this.navParams.data.event;
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

  deleteEvent() {
    /*http*/
    this.resetEvent();
  }

  editEvent() {

  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
