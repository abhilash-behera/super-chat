import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.maxLength(20)],
      password: ['', Validators.required]
    });

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.maxLength(20)],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  login() {
    if (this.loginForm.valid) {
      console.log('Logging in with: ', this.loginForm.value);
    }
  }

  signup() {

  }

  get username(): AbstractControl {
    return this.signupForm.get('username');
  }

  get password(): AbstractControl {
    return this.signupForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.signupForm.get('confirmPassword');
  }

}
