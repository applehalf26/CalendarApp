import { Component, OnInit } from '@angular/core';
import {Global} from '../globals/global';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  id = 'user1';
  password = '7777';

  login = true;

  constructor(private router: Router, public http: HttpClient) { }

  ngOnInit() {
  }

  async getTest() {

    console.log(await Global.getAsync(this.http,
        '/user/find/user1')
    );
    for (let i = 0; i < 2; i++) {
      console.log('sync - ', i);
    }
  }

  // 로그인 시도
  async checkIdPwd() {
    const serverResponse = await this.postAsync('/user/login');

    console.table(serverResponse);

    if (serverResponse.hasOwnProperty('success') && serverResponse.success === true) {

      console.log('Login Succeed');

      Global.id = this.id;
      Global.password = this.password;
      this.clearIdPwd();

      const serverResponseCategories = await Global.getAsync(this.http, '/category/find/' + Global.id);

      if (serverResponseCategories.success === true) {
        Global.InitalizeCategories(serverResponseCategories.data);
        console.table(Global.categoryList);
      } else {
        console.log('category failed');
      }

      const serverResponseEvents = await Global.getAsync(this.http, '/event/find/' + Global.id);

      if (serverResponseEvents.success === true) {
        Global.InitalizeEvents(serverResponseEvents.data);
        console.table(Global.eventList);
      } else {
        console.log('event failed');
      }


      this.router.navigate(['/home']);

    } else {

      alert(serverResponse.message);
      console.log('Login Failed');

    }
  }

  async signUp() {
    if (this.isEmpty()) { return; }
    /* id 존재하는 지 체크 후 없으면 */

    Global.id = this.id;
    Global.password = this.password;
    const serverResponse = await this.postAsync('/user/add');

    if (serverResponse.success === true) {

      console.log('Sign-up & Login Succeed');

      Global.id = this.id;
      Global.password = this.password;
      this.clearIdPwd();

      /*서버에서 해당 ID의 카테고리, 일정 목록을 받아와 전역 변수에 초기화*/
      const serverResponseCategories = await Global.getAsync(this.http, '/user/add');


      this.router.navigate(['/home']);
    } else {
      alert(serverResponse.message);
      console.log('Login Failed');
    }
  }

  clearIdPwd() {
    this.id = '';
    this.password = '';
  }
  isEmpty() {
    if (this.id === '' || this.password === '') {
      return true;
    } else { return false; }
  }

  // 비동기 HTTP Post Method
  // [리턴값] :
  // post의 결과로 서버가 보낸 JSON obj를 리턴 (await postAsync() 형태로 비동기 처리를 해야 함)
  async postAsync(prmParams: string) {
    // Header
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = {headers, withCredentials: false};

    const requestData = {
      id: this.id,
      password: this.password
    };

    // Request Post
    return JSON.parse(JSON.stringify(await new Promise(resolve => {
      this.http.post<object>(
          Global.prmURL + prmParams,
          requestData,
          options
      )
          .subscribe(
              (res) => {
                resolve(res);
              },
              error => {
                resolve(error);
              }
          );
    })));
  }
}
