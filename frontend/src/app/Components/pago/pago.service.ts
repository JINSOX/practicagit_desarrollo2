import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pago } from './pago.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PagoService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:5124/api/pagos'; // URL del API
  isTblLoading = true;
  dataChange: BehaviorSubject<Pago[]> = new BehaviorSubject<Pago[]>([]);
  dialogData!: Pago;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Pago[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllPagos(): void {
    this.subs.sink = this.httpClient.get<Pago[]>(this.API_URL).subscribe({
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

  addPago(pago: Pago): Observable<void> {
    this.dialogData = pago;
    return this.httpClient.post<void>(this.API_URL, pago, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding pago:', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
        return throwError(() => new Error('Failed to add pago'));
      })
    );
  }

  updatePago(pago: Pago): Observable<void> {
    this.dialogData = pago;
    return this.httpClient.put<void>(`${this.API_URL}/${pago.idPago}`, pago, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating pago:', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
        return throwError(() => new Error('Failed to update pago'));
      })
    );
  }

  deletePago(pago: Pago): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${pago.idPago}`);
  }
}
