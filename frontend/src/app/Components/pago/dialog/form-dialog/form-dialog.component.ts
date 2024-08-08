import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PagoService } from '../../pago.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pago } from '../../pago.model';
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
  pago: Pago;
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
  pagoForm: UntypedFormGroup;
  pago: Pago;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public pagoService: PagoService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = `Editar Pago: ${data.pago.tipoPago}`;
      this.pago = data.pago;
    } else {
      this.dialogTitle = 'Nuevo Pago';
      this.pago = new Pago({});
    }
    this.pagoForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      idPago: [this.pago.idPago],
      idMiembro: [this.pago.idMiembro, Validators.required],
      monto: [this.pago.monto, Validators.required],
      fechaPago: [this.pago.fechaPago, Validators.required], // Opcional, sin required
      tipoPago: [this.pago.tipoPago, Validators.required], // Opcional, sin required
      comprobanteUrl: [this.pago.comprobanteUrl],
      estado: [this.pago.estado], // Opcional, sin required
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
    this.pagoService.addPago(this.pagoForm.getRawValue()).subscribe(() => {
      this.dialogRef.close(1); // Cierra el diálogo y devuelve un valor para indicar éxito
    });
  }

  confirmEdit(): void {
    this.pagoService.updatePago(this.pagoForm.getRawValue()).subscribe(() => {
      this.dialogRef.close(1); // Cierra el diálogo y devuelve un valor para indicar éxito
    });
  }
}
