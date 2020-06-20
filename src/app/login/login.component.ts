import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showPassword = false;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLogin() {
    this.router.navigateByUrl('/home');
  }

  togglePasswordView() {
    this.showPassword = !this.showPassword;
  }

}
