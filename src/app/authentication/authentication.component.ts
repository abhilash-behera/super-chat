import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  loggingIn: Boolean;
  success: String;
  error: String;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  login() {
    if (this.loginForm.valid) {
      this.loggingIn = true;
      this.apiService.login(this.loginForm.value).subscribe(
        data => {
          if (data.success) {
            this.success = data.data.msg;
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            })
          } else {
            this.loggingIn = false;
            this.showErrorMessage(data.data.msg, 2000);
          }
        },
        error => {
          this.loggingIn = false;
          this.showErrorMessage("Connection Problem", 2000);
        }
      )
    }
  }

  signup() {

  }

  get loginUsername(): AbstractControl {
    return this.loginForm.get('username');
  }

  get loginPassword(): AbstractControl {
    return this.loginForm.get('password');
  }

  get signupUsername(): AbstractControl {
    return this.signupForm.get('username');
  }

  get signupPassword(): AbstractControl {
    return this.signupForm.get('password');
  }

  get signupConfirmPassword(): AbstractControl {
    return this.signupForm.get('confirmPassword');
  }

  showErrorMessage(message: String, duration: number) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, duration, this);
  }

}
