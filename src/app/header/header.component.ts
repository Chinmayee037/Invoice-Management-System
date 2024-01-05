import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userCredential: any;
  constructor(public service: UserService, private router: Router){}
  ngOnInit(): void {
    this.getUserCred();
  }
   isLogOut(){
      this.service.isLogin=false;
      localStorage.clear();
      this.router.navigate(['/login']);
  }
  getUserCred(){
    return this.service.getUserCred().subscribe((res)=>{
      console.log("response",res);
      this.userCredential= res;
    });
  }
}
