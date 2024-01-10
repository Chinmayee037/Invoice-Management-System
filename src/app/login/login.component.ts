import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  userCredentials: any[] = [];
  constructor(
    private fb: FormBuilder,
    public service: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      useremail: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
    this.getUserCred();
    this.isLogin();
  }
  isLogin() {
    if (localStorage.getItem('useremail') && localStorage.getItem('password')) {
      this.service.isLogin = true;
      this.router.navigate(['/invoice']);
    }
  }
  Login() {
    const LoginformValue = this.loginForm.value;
    console.log('Entered Email:', LoginformValue.useremail);
    console.log('Entered Password:', LoginformValue.password);

    if (
      this.userCredentials[0].Email == this.loginForm.get('useremail')?.value &&
      this.userCredentials[0].Password == this.loginForm.get('password')?.value
    ) {
      
      localStorage.setItem('useremail', this.loginForm.get('useremail')?.value);
      localStorage.setItem('password', this.loginForm.get('password')?.value);
      this.isLogin();
    } else {
      console.error('loginForm or useremail control is not available');
      // Reset form control values
      this.loginForm.get('useremail')?.setValue('');
      this.loginForm.get('password')?.setValue('');
    }
  }

  getUserCred() {
    return this.service.getUserCred().subscribe((res: any[]) => {
      console.log('response', res);
      this.userCredentials = res;
      console.log(' this.userCredentials[0]', this.userCredentials[0].Email);
    });
  }

}
