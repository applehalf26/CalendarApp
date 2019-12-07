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

  categoryList = [];

  selectedCat = -1;
  editCat = -1;


  constructor(private router: Router, public http: HttpClient) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
      if (Global.id === '') {
          this.router.navigate(['/login']);
      }
      this.categoryList = Global.categoryList;
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

  async addCategory() {
      console.log(this.currentCategory);

      let category = {
          id: Global.id,
          title: this.currentCategory.title,
          checkbox: this.currentCategory.checkbox,
          radio: this.currentCategory.radio,
          input: this.currentCategory.input,
          textarea: this.currentCategory.textarea,
          color: this.currentCategory.color,
      };

      const postResult = await Global.postAsync(this.http, '/category/add', category);
      if (postResult.success === true) {
          console.log('Save Succeed');
          this.categoryList.push(this.currentCategory);
          this.emptyCategory();
          this.resetColor();
          this.resetChip();
          this.selectedCat = -1;
          console.log(this.currentCategory);
      } else {
          alert(postResult.message);
      }
      console.log(Global.categoryList);
  }

  /* EDIT */
  editMode(i) {
      this.resetChip();
      this.resetColor();
      this.emptyCategory();
      this.loadCategory(i);
      console.log(this.currentCategory);
      console.log(this.categoryList[i]);
      console.log(Global.categoryList[i]);
  }

  async editCategory(i) {
      console.log(Global.categoryList);

      let category = {
          id: Global.id,
          title: this.categoryList[i].title,
          new: this.currentCategory
      };

      const postResult = await Global.postAsync(this.http, '/category/modify', category);
      if (postResult.success === true) {
          console.log('Edit Succeed');
          this.categoryList[i] = this.currentCategory;
          console.log(Global.categoryList);
          this.editCat = -1;
          this.emptyCategory();
          console.log(this.currentCategory);
      } else {
          alert(postResult.message);
      }
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
      this.currentCategory.title = this.categoryList[i].title;
      this.currentCategory.color = this.categoryList[i].color;
      this.categoryList[i].checkbox.forEach(value => {
          this.currentCategory.checkbox.push(value);
      });
      this.categoryList[i].radio.forEach(value => {
          this.currentCategory.radio.push(value);
      });
      this.categoryList[i].input.forEach(value => {
          this.currentCategory.input.push(value);
      });
      this.categoryList[i].textarea.forEach(value => {
          this.currentCategory.textarea.push(value);
      });
      this.colorCheck.forEach(value => {
          if (value.name === this.currentCategory.color) {
              value.check = true;
          }
      });
  }

  async deleteCategory(i) {
      console.log(this.categoryList);
      let category = {
          id: Global.id,
          title: this.categoryList[i].title
      };

      const postResult = await Global.postAsync(this.http, '/category/delete', category);
      if (postResult.success === true) {
          console.log('Delete Succeed');

          this.categoryList.splice(i, 1);
          console.log(Global.categoryList);
          this.selectedCat = -1;
          this.editCat = -1;
          console.log(this.currentCategory);
      } else {
          alert(postResult.message);
      }
  }
}
