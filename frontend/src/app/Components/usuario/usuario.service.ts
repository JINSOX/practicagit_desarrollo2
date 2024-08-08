import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Usuario } from './usuario.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:5124/api/usuarios'; // URL del API
  isTblLoading = true;
  dataChange: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  dialogData!: Usuario;

  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Usuario[] {
    return this.dataChange.value;
  }

  getDialogData(): Usuario {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllUsuarios(): void {
    this.subs.sink = this.httpClient.get<Usuario[]>(this.API_URL).subscribe({
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

  addUsuario(usuario: Usuario): Observable<void> {
    this.dialogData = usuario;
    return this.httpClient.post<void>(this.API_URL, usuario, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding usuario:', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
        return throwError(() => new Error('Failed to add usuario'));
      })
    );
  }

  updateUsuario(usuario: Usuario): Observable<void> {
    this.dialogData = usuario;
    return this.httpClient.put<void>(`${this.API_URL}/${usuario.idUsuario}`, usuario, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating usuario:', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
        return throwError(() => new Error('Failed to update usuario'));
      })
    );
  }

  deleteUsuario(usuario: Usuario): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${usuario.idUsuario}`);
  }
}
