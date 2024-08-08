import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Miembro } from './miembro.model';
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
import { MiembroService } from './miembro.service';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-miembro',
  templateUrl: './miembro.component.html',
  styleUrls: ['./miembro.component.scss'],
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
export class MiembroComponent implements OnInit {
  displayedColumns = [
    'select',
    'dni',
    'img',
    'nombre',
    'address',
    'id',
    'mobile',
    'date',
    'date-reg',
    'actions',
  ];
  exampleDatabase?: MiembroService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Miembro>(true, []);
  index?: number;
  id?: number;
  miembro?: Miembro;
  private subs = new SubSink();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public miembroService: MiembroService,
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
        miembro: new Miembro({}), // Pasamos un objeto vacío para crear un nuevo miembro
        action: 'add',
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // Añadir el nuevo miembro usando el servicio
        this.miembroService.addMiembro(this.miembroService.getDialogData()).subscribe(() => {
          this.exampleDatabase?.dataChange.value.unshift(this.miembroService.getDialogData());
          this.refreshTable();
          this.showNotification(
            'snackbar-success',
            'Miembro añadido exitosamente!',
            'bottom',
            'center'
          );
        });
      }
    });
  }

  editCall(row: Miembro) {
    this.id = row.idMiembro;
    let tempDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
    
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        miembro: row,
        action: 'edit',
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // Editar el miembro existente usando el servicio
        this.miembroService.updateMiembro(this.miembroService.getDialogData()).subscribe(() => {
          const foundIndex = this.exampleDatabase?.dataChange.value.findIndex((x) => x.idMiembro === this.id);
          if (foundIndex != null && this.exampleDatabase) {
            this.exampleDatabase.dataChange.value[foundIndex] = this.miembroService.getDialogData();
            this.refreshTable();
            this.showNotification(
              'black',
              'Miembro actualizado exitosamente!',
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
  deleteItem(row: Miembro) {
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
        if (row.idMiembro !== undefined && row.idMiembro !== null) {
          this.miembroService.deleteMiembro(row).subscribe({
            next: () => {
              // Remove the item from the local data source
              const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
                (x) => x.idMiembro === row.idMiembro
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
              console.error('Error deleting miembro:', error);
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
        this.selection = new SelectionModel<Miembro>(true, []);
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
    this.exampleDatabase = new MiembroService(this.httpClient);
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
        Name: x.nombres,
        Surname: x.apellidos,
        Address: x.direccion,
        'Birth Date': formatDate(new Date(x.fechaNacimiento), 'yyyy-MM-dd', 'en') || '',
        University: x.universidad,
        Title: x.titulo,
        Mobile: x.telefono,
        Status: x.estado,
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

export class ExampleDataSource extends DataSource<Miembro> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Miembro[] = [];
  renderedData: Miembro[] = [];

  constructor(
    public exampleDatabase: MiembroService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<Miembro[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];

    this.exampleDatabase.getAllMiembros(); // Load data initially
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((miembro: Miembro) => {
            const searchStr = (
              miembro.nombres +
              miembro.apellidos +
              miembro.direccion +
              miembro.fechaNacimiento +
              miembro.universidad +
              miembro.titulo +
              miembro.telefono +
              miembro.estado
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

  sortData(data: Miembro[]): Miembro[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idMiembro':
          [propertyA, propertyB] = [a.idMiembro, b.idMiembro];
          break;
        case 'nombres':
          [propertyA, propertyB] = [a.nombres, b.nombres];
          break;
        case 'apellidos':
          [propertyA, propertyB] = [a.apellidos, b.apellidos];
          break;

        case 'direccion':
          [propertyA, propertyB] = [a.direccion, b.direccion];
          break;
        case 'telefono':
          [propertyA, propertyB] = [a.telefono, b.telefono];
          break;
        case 'universidad':
          [propertyA, propertyB] = [a.universidad, b.universidad];
          break;
        case 'titulo':
          [propertyA, propertyB] = [a.titulo, b.titulo];
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