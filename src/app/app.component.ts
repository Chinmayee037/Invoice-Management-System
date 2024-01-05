import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Invoice-Management';
  isNotLoginPage: boolean = false; 

  constructor(public service: UserService) {}
}
