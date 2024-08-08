import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UsuarioService } from '../../usuario.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../usuario.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface DialogData {
  id: number;
  action: string;
  usuario: Usuario;
}

@Component({
  selector: 'app-form-dialog:not(i)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    CommonModule,
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  usuarioForm: UntypedFormGroup;
  usuario: Usuario;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public usuarioService: UsuarioService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = `Editar Usuario: ${data.usuario.username}`;
      this.usuario = data.usuario;
    } else {
      this.dialogTitle = 'Nuevo Usuario';
      this.usuario = new Usuario({});
    }
    this.usuarioForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      idUsuario: [this.usuario.idUsuario],
      idMiembro: [this.usuario.idMiembro, Validators.required],
      username: [this.usuario.username, Validators.required], // Opcional, sin required
      passwordHash: [this.usuario.passwordHash, Validators.required], // Opcional, sin required
      rol: [this.usuario.rol, Validators.required], // Opcional, sin required
      fechaCreacion: [this.usuario.fechaCreacion, Validators.required], // Opcional, sin required
      ultimoAcceso: [this.usuario.ultimoAcceso, Validators.required] // Opcional, sin required
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Método que se encargará de llamar a confirmAdd o confirmEdit según la acción
  onConfirm(): void {
    if (this.action === 'edit') {
      this.confirmEdit();
    } else {
      this.confirmAdd();
    }
  }

  confirmAdd(): void {
    this.usuarioService.addUsuario(this.usuarioForm.getRawValue()).subscribe(() => {
      this.dialogRef.close(1); // Cierra el diálogo y devuelve un valor para indicar éxito
    });
  }

  confirmEdit(): void {
    this.usuarioService.updateUsuario(this.usuarioForm.getRawValue()).subscribe(() => {
      this.dialogRef.close(1); // Cierra el diálogo y devuelve un valor para indicar éxito
    });
  }
}
