import { Component, OnInit } from '@angular/core';
import {Global} from '../globals/global';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  colorCheck = [
    {
      name: 'primary',
      check: false
    },
    {
      name: 'tertiary',
      check: false
    },
    {
      name: 'secondary',
      check: false
    },
    {
      name: 'success',
      check: false
    },
    {
      name: 'danger',
      check: false
    },
    {
      name: 'medium',
      check: false
    }
  ];

  chip = {
      type: '',
      name: ''
  };

  currentCategory = {
      title: '',
      checkbox: [],
      radio: [],
      input: [],
      textarea: [],
      color: 'primary',
  };

  tempList = [];

  selectedCat = -1;
  editCat = -1;


  constructor(private router: Router, public http: HttpClient) {
      if (Global.id === '') {
          this.router.navigate(['/login']);
      }
      this.tempList = Global.categoryList;
  }

  ngOnInit() {
      if (Global.id === '') {
          this.router.navigate(['/login']);
      }
  }

  getDetail(i) {
      if (this.editCat !== i) {
          if (this.selectedCat === i) {
              this.selectedCat = -1;
          } else {
              this.editCat = -1;
              this.selectedCat = i;
          }
      }
  }

  resetChip() {
    this.chip = {
      type: '',
      name: ''
    };
  }

  resetColor() {
    this.colorCheck.forEach(value => {
      value.check = false;
    });
  }

  typeColor(type) {
      switch (type) {
          case 'checkbox':
              return 'secondary';
          case 'radio':
              return 'tertiary';
          case 'input':
              return 'success';
          default:
              return 'dark';
      }
  }

  add() {
    console.log(this.chip);
    switch (this.chip.type) {
        case 'checkbox':
            this.currentCategory.checkbox.push(this.chip.name);
            break;
        case 'radio':
            this.currentCategory.radio.push(this.chip.name);
            break;
        case 'input':
            this.currentCategory.input.push(this.chip.name);
            break;
        case 'textarea':
            this.currentCategory.textarea.push(this.chip.name);
            break;
    }
    this.resetChip();
  }

  delete(type, i) {
      console.log(type);
      type.splice(i, 1);
      console.log(this.currentCategory);
  }

  setColor(color) {
    if (color.check) {
        this.resetColor();
        color.check = true;
        this.currentCategory.color = color.name;
    }
  }

  addMode() {
      this.resetChip();
      this.resetColor();
      this.emptyCategory();
      if (this.selectedCat === -2) {
          this.editCat = -1;
          this.selectedCat = -1;
      } else {
          this.selectedCat = -2;
          this.editCat = -1;
      }
  }

  addCategory() {
    console.log(this.currentCategory);
    this.tempList.push(this.currentCategory);
    this.emptyCategory();
    this.resetColor();
    this.resetChip();
    this.selectedCat = -1;
    console.log(this.currentCategory);
    console.log(Global.categoryList);
  }

  /* EDIT */
  editMode(i) {
      this.resetChip();
      this.resetColor();
      this.emptyCategory();
      this.loadCategory(i);
      console.log(this.currentCategory);
      console.log(this.tempList[i]);
      console.log(Global.categoryList[i]);
  }

  editCategory(i) {
      console.log(Global.categoryList);
      this.tempList[i] = this.currentCategory;
      console.log(Global.categoryList);
      this.editCat = -1;
      this.emptyCategory();
  }

  emptyCategory() {
      this.currentCategory = {
          title: '',
          checkbox: [],
          radio: [],
          input: [],
          textarea: [],
          color: 'primary',
      };
  }

  loadCategory(i) {
      this.currentCategory.title = this.tempList[i].title;
      this.currentCategory.color = this.tempList[i].color;
      this.tempList[i].checkbox.forEach(value => {
          this.currentCategory.checkbox.push(value);
      });
      this.tempList[i].radio.forEach(value => {
          this.currentCategory.radio.push(value);
      });
      this.tempList[i].input.forEach(value => {
          this.currentCategory.input.push(value);
      });
      this.tempList[i].textarea.forEach(value => {
          this.currentCategory.textarea.push(value);
      });
      this.colorCheck.forEach(value => {
          if (value.name === this.currentCategory.color) {
              value.check = true;
          }
      });
  }

  deleteCategory(i) {
      console.log(this.tempList);
      this.tempList.splice(i, 1);
      console.log(Global.categoryList);
      this.selectedCat = -1;
      this.editCat = -1;
  }

  /* Http connection method */
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
    async postAsync(prmURL: string, ...prmParams: string[]) {
        // Header
        const headers = new HttpHeaders();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        const options = {headers, withCredentials: false};

        const requestData = {
            id: 'tkals11',
            password: '1234567'
        };

        // Concat Parameters
        let paramString = '';
        prmParams.forEach( p => { paramString += ('/' + p); });

        // Request Post
        return await new Promise(resolve => {
            this.http.post<object>(
                prmURL + '/' + paramString,
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
