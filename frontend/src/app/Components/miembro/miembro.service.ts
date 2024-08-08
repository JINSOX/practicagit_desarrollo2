import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Miembro } from './miembro.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MiembroService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:5124/api/miembros'; // URL del API
  isTblLoading = true;
  dataChange: BehaviorSubject<Miembro[]> = new BehaviorSubject<Miembro[]>([]);
  dialogData!: Miembro;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Miembro[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllMiembros(): void {
    this.subs.sink = this.httpClient.get<Miembro[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  addMiembro(miembro: Miembro): Observable<void> {
    this.dialogData = miembro;
    return this.httpClient.post<void>(this.API_URL, miembro, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding miembro:', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
        return throwError(() => new Error('Failed to add miembro'));
      })
    );
  }

  updateMiembro(miembro: Miembro): Observable<void> {
    this.dialogData = miembro;
    return this.httpClient.put<void>(`${this.API_URL}/${miembro.idMiembro}`, miembro, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating miembro:', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
        return throwError(() => new Error('Failed to update miembro'));
      })
    );
  }

  deleteMiembro(miembro: Miembro): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${miembro.idMiembro}`);
  }
}
