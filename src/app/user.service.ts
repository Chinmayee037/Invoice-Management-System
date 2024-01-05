import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
Url = 'http://localhost:3000/invoice' ;
UserUrl = 'http://localhost:3000/userCredential'
public isLogin:boolean=false;
  constructor(private http : HttpClient) { }
  getUsers(): Observable<any> {
    return this.http.get(this.Url);
  }
  createUser(user: any): Observable<any>{
    return this.http.post(this.Url, user);
  }
  deleteUser(userId: string): Observable<any> {
    const deleteUrl = `${this.Url}/${userId}`;
    return this.http.delete(deleteUrl);
  }
  updateUser(userId: string, updatedUser: any) : Observable<any> {
    const updateUrl = `${this.Url}/${userId}`;
    return this.http.put(updateUrl, updatedUser);
  }
  
  // ====================
  getUserCred(): Observable<any>{
    return this.http.get(this.UserUrl);
  }
  
}
