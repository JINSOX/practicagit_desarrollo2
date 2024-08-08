import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Pago } from './pago.model';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate, NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PagoService } from './pago.service';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    CommonModule,
  ],
})
export class PagoComponent implements OnInit {
  displayedColumns = [
    'select',
    'idmiembro',
    'comprobante',
    'monto',
    'fechapago',
    'tipoPago',
    'estado',
    'actions',
  ];
  exampleDatabase?: PagoService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Pago>(true, []);
  index?: number;
  id?: number;
  pago?: Pago;
  private subs = new SubSink();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public pagoService: PagoService,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild('filter', { static: true }) filter?: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    let tempDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        pago: new Pago({}), // Pasamos un objeto vacío para crear un nuevo pago
        action: 'add',
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // Añadir el nuevo pago usando el servicio
        this.pagoService.addPago(this.pagoService.getDialogData()).subscribe(() => {
          this.exampleDatabase?.dataChange.value.unshift(this.pagoService.getDialogData());
          this.refreshTable();
          this.showNotification(
            'snackbar-success',
            'Pago añadido exitosamente!',
            'bottom',
            'center'
          );
        });
      }
    });
  }

  editCall(row: Pago) {
    this.id = row.idPago;
    let tempDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
    
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        pago: row,
        action: 'edit',
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // Editar el pago existente usando el servicio
        this.pagoService.updatePago(this.pagoService.getDialogData()).subscribe(() => {
          const foundIndex = this.exampleDatabase?.dataChange.value.findIndex((x) => x.idPago === this.id);
          if (foundIndex != null && this.exampleDatabase) {
            this.exampleDatabase.dataChange.value[foundIndex] = this.pagoService.getDialogData();
            this.refreshTable();
            this.showNotification(
              'black',
              'Pago actualizado exitosamente!',
              'bottom',
              'center'
            );
          }
        });
      }
    });
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  deleteItem(row: Pago) {
    // Confirm deletion with SweetAlert2
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Ensure the ID is defined and valid
        if (row.idPago !== undefined && row.idPago !== null) {
          this.pagoService.deletePago(row).subscribe({
            next: () => {
              // Remove the item from the local data source
              const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
                (x) => x.idPago === row.idPago
              );
  
              if (foundIndex !== undefined && foundIndex !== -1 && this.exampleDatabase?.dataChange) {
                const data = this.exampleDatabase.dataChange.value;
                data.splice(foundIndex, 1); // Remove the item from the array
                this.exampleDatabase.dataChange.next(data); // Update the observable
                this.refreshTable();
                this.showNotification(
                  'snackbar-danger',
                  'Delete Record Successfully...!!!',
                  'bottom',
                  'center'
                );
              }
            },
            error: (error) => {
              console.error('Error deleting pago:', error);
            }
          });
        } else {
          console.error('Error: ID is undefined or null');
        }
      } else {
        console.error('Delete cancelled');
      }
    });
  }
  
  
  
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      if (index !== -1) {
        this.exampleDatabase?.dataChange.value.splice(index, 1);
        this.refreshTable();
        this.selection = new SelectionModel<Pago>(true, []);
      }
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }

  public loadData() {
    this.exampleDatabase = new PagoService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    fromEvent(this.filter?.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter?.nativeElement.value;
    });
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Pago: x.idPago,
        Miembro: x.idMiembro,
        Monto: x.monto,
        'Fecha Pago': formatDate(new Date(x.fechaPago), 'yyyy-MM-dd', 'en') || '',
        TipoPago: x.tipoPago,
        Comprobante: x.comprobanteUrl,
        Estado: x.estado,
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}

export class ExampleDataSource extends DataSource<Pago> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Pago[] = [];
  renderedData: Pago[] = [];

  constructor(
    public exampleDatabase: PagoService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<Pago[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];

    this.exampleDatabase.getAllPagos(); // Load data initially
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((pago: Pago) => {
            const searchStr = (
              pago.idPago +
              pago.idMiembro +
              pago.monto +
              pago.tipoPago +
              pago.comprobanteUrl +
              pago.estado
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }

  disconnect() {}

  sortData(data: Pago[]): Pago[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idPago':
          [propertyA, propertyB] = [a.idPago, b.idPago];
          break;
        case 'nombres':
          [propertyA, propertyB] = [a.idMiembro, b.idMiembro];
          break;
        case 'apellidos':
          [propertyA, propertyB] = [a.monto, b.monto];
          break;

        case 'direccion':
          [propertyA, propertyB] = [a.tipoPago, b.tipoPago];
          break;
        case 'telefono':
          [propertyA, propertyB] = [a.comprobanteUrl, b.comprobanteUrl];
          break;
        case 'estado':
          [propertyA, propertyB] = [a.estado, b.estado];
          break;

      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}