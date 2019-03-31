import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  login(body: any): Observable<any> {
    return this.httpClient.post('/auth/login', body);
  }

  checkUsernameAvailability(username: String): Observable<any> {
    return this.httpClient.post('/auth/checkUsernameAvailability', { username: username });
  }

  signup(body: any): Observable<any> {
    return this.httpClient.post('/auth/signup', body);
  }
}
