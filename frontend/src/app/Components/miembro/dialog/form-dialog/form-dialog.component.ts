import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MiembroService } from '../../miembro.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Miembro } from '../../miembro.model';
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
  miembro: Miembro;
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
  miembroForm: UntypedFormGroup;
  miembro: Miembro;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public miembroService: MiembroService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = `Editar Miembro: ${data.miembro.nombres} ${data.miembro.apellidos}`;
      this.miembro = data.miembro;
    } else {
      this.dialogTitle = 'Nuevo Miembro';
      this.miembro = new Miembro({});
    }
    this.miembroForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      idMiembro: [this.miembro.idMiembro],
      dni: [this.miembro.dni, Validators.required],
      nombres: [this.miembro.nombres, Validators.required],
      apellidos: [this.miembro.apellidos, Validators.required],
      fechaNacimiento: [this.miembro.fechaNacimiento], // Opcional, sin required
      direccion: [this.miembro.direccion], // Opcional, sin required
      email: [this.miembro.email, Validators.required],
      telefono: [this.miembro.telefono], // Opcional, sin required
      universidad: [this.miembro.universidad], // Opcional, sin required
      titulo: [this.miembro.titulo], // Opcional, sin required
      fechaGraduacion: [this.miembro.fechaGraduacion], // Opcional, sin required
      fotoUrl: [this.miembro.fotoUrl], // Opcional, sin required
      estado: [this.miembro.estado], // Opcional, sin required
      fechaRegistro: [this.miembro.fechaRegistro] // Opcional, sin required
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
    this.miembroService.addMiembro(this.miembroForm.getRawValue()).subscribe(() => {
      this.dialogRef.close(1); // Cierra el diálogo y devuelve un valor para indicar éxito
    });
  }

  confirmEdit(): void {
    this.miembroService.updateMiembro(this.miembroForm.getRawValue()).subscribe(() => {
      this.dialogRef.close(1); // Cierra el diálogo y devuelve un valor para indicar éxito
    });
  }
}
