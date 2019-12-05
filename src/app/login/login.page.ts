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

  id = '';
  password = '';

  login = true;

  constructor(private router: Router, public http: HttpClient) { }

  ngOnInit() {
  }

  checkIdPwd() {
    if (this.postAsync(Global.prmURL + '/user/login')) {
      Global.id = this.id;
      Global.password = this.password;
      this.clearIdPwd();
      this.router.navigate(['/home']);
    }
  }
  signUp() {
    if (this.isEmpty()) { return; }
    /* id 존재하는 지 체크 후 없으면 */
    Global.id = this.id;
    Global.password = this.password;
    this.clearIdPwd();
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

  // 비동기 HTTP Get Method
  // 서버가 보낸 JSON obj를 리턴 (await getAsync() 형태로 비동기 처리를 해야 함)
  async getAsync(prmURL: string, ...prmParams: string[]) {
    // Header
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = {headers, withCredentials: false};

    // Concat Parameters
    let paramString = '';
    prmParams.forEach( p => { paramString += ('/' + p); });

    // Request Get
    return await new Promise(resolve => {
      this.http.get<object>(
          prmURL + '/' + paramString,
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
    });
  }

  // 비동기 HTTP Post Method
  // [리턴값] :
  // post의 결과로 서버가 보낸 JSON obj를 리턴 (await postAsync() 형태로 비동기 처리를 해야 함)
  async postAsync(prmURL: string) {
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
    return await new Promise(resolve => {
      this.http.post<object>(
          prmURL,
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
    });
  }
}
