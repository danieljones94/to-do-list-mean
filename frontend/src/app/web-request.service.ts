import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  readonly ROOT_URL;
  constructor(private httpClient: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000/';
  }

  get(uri: string) {
    return this.httpClient.get(`${this.ROOT_URL}${uri}`);
  }

  post(uri: string, data: Object) {
    return this.httpClient.post(`${this.ROOT_URL}${uri}`, data);
  }

  patch(uri: string, data: Object) {
    return this.httpClient.patch(`${this.ROOT_URL}${uri}`, data);
  }

  delete(uri: string) {
    return this.httpClient.delete(`${this.ROOT_URL}${uri}`);
  }

  login(email: string, password: string) {
    return this.httpClient.post(
      `${this.ROOT_URL}users/login`,
      { email, password },
      { observe: 'response' }
    );
  }

  signup(email: string, password: string) {
    return this.httpClient.post(
      `${this.ROOT_URL}users`,
      { email, password },
      { observe: 'response' }
    );
  }
}
