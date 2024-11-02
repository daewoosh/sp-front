import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lead } from '../models';

@Injectable({ providedIn: 'root' })
export class LeadsApiService {
  constructor(private http: HttpClient) {
  }

  saveLead(lead: Lead): Observable<void> {
    return this.http.post<void>(`${API_URL}/leads`, lead);
  }
}
