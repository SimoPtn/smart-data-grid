import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { DataRecord } from '../models/data-record';
import { MOCK_DATA } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getData(): Observable<DataRecord[]> {
    return of(MOCK_DATA).pipe(
      tap(() => console.log('DataService getData chiamato')),
      delay(300),
      tap((data) => console.log('Data emesso:', data))
    );
  }
}
