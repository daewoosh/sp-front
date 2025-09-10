import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lead } from '../models';
import { API_PATH } from '@sp/config';

@Injectable({ providedIn: 'root' })
export class LeadsApiService {
  constructor(private http: HttpClient, @Inject(API_PATH) private apiPath: string) {
  }

  saveLead(lead: Lead): Observable<void> {
    return this.http.post<void>(`${this.apiPath}/leads`, lead);
  }
}
