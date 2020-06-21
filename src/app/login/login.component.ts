import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AppService } from '../../providers/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPassword = false;
  loggedIn = false;

  constructor(
    private router: Router,
    private appService: AppService
  ) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.loggedIn = true;
    this.appService.onLoginUser(form.value).subscribe(isLoggedIn => {
      this.loggedIn = false;
      if (isLoggedIn) {
        this.router.navigateByUrl('/home');
      }
    }, error => {
      this.loggedIn = false;
      console.log(error);
    });
  }

  togglePasswordView() {
    this.showPassword = !this.showPassword;
  }

}
