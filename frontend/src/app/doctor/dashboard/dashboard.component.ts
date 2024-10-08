/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexYAxis, ApexPlotOptions, ApexStroke, ApexLegend, ApexNonAxisChartSeries, ApexFill, ApexGrid, NgApexchartsModule } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Task } from './task.model';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';

export type areaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
};

export type linechartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
};

export type radialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
    MatButtonModule,
    NgScrollbar,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatIconModule,
    MatCheckboxModule,
    CdkDragPlaceholder,
    MatTooltipModule,
    NgClass,
    FormsModule, 
    ReactiveFormsModule,
    MatSidenavModule,
    DatePipe,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart')
  chart!: ChartComponent;
  public areaChartOptions!: Partial<areaChartOptions>;
  public radialChartOptions!: Partial<radialChartOptions>;
  public linechartOptions!: Partial<linechartOptions>;

  // Importado desde task
  mode = new UntypedFormControl('side');
  taskForm: UntypedFormGroup;
  showFiller = false;
  isNewEvent = false;
  dialogTitle?: string;
  userImg?: string;
  tasks: Task[] = [];
  selectedPerson: any = null;

  constructor(private fb: UntypedFormBuilder, private http: HttpClient, private changeDetector: ChangeDetectorRef) {
    const blank = {} as Task;
    this.taskForm = this.createFormGroup(blank);

    this.fetch((data: Task[]) => {
      this.tasks = data;
    });
  }

  fetch(cb: (i: Task[]) => void) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/task.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

  toggle(task: { done: boolean }, nav: MatSidenav) {
    nav.close();
    task.done = !task.done;
  }

  personClick(person: any, nav: MatSidenav): void {
    this.selectedPerson = person; // Asigna los datos de la persona a la variable
    nav.open();
  }

  closeSlider(nav: MatSidenav) {
    nav.close();
  }
  
  createFormGroup(data: Task) {
    return this.fb.group({
      id: [data ? data.id : this.getRandomID()],
      img: [data ? data.img : 'assets/images/user/user1.jpg'],
      name: [data ? data.name : null],
      title: [data ? data.title : null],
      done: [data ? data.done : null],
      priority: [data ? data.priority : null],
      due_date: [data ? data.due_date : null],
      note: [data ? data.note : null],
    });
  }

  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }

  // TODO start
  tasks2 = [
    {
      id: '1',
      title: 'Check patient report',
      done: true,
      priority: 'High',
    },
    {
      id: '2',
      title: 'Request for festivle holiday',
      done: false,
      priority: 'High',
    },
    {
      id: '3',
      title: 'Order new medicine stock',
      done: false,
      priority: 'Low',
    },
    {
      id: '4',
      title: 'Remind for lunch in hotel',
      done: true,
      priority: 'Normal',
    },
    {
      id: '5',
      title: 'Conference in london',
      done: false,
      priority: 'High',
    },
    {
      id: '6',
      title: 'Announcement for',
      done: false,
      priority: 'Normal',
    },
    {
      id: '7',
      title: 'call bus driver',
      done: true,
      priority: 'High',
    },
    {
      id: '8',
      title: 'Web service data load issue',
      done: false,
      priority: 'High',
    },
    {
      id: '9',
      title: 'Java compile error',
      done: false,
      priority: 'Low',
    },
    {
      id: '10',
      title: 'Integrate project with spring boot',
      done: true,
      priority: 'High',
    },
  ];

  toggle2(task: { done: boolean }) {
    task.done = !task.done;
  }
  
  onDateChange(event: MatDatepickerInputEvent<moment.Moment>) {
    if (event.value) {
      this.fechaSeleccionada = event.value.toDate(); // Convierte el objeto Moment a Date
      this.filtrarPersonasPorFecha(this.fechaSeleccionada);
    }
  }

  people: any[] = [];
  fechaSeleccionada: Date = new Date(); // Inicializa con la fecha actual
  filteredPeople = new BehaviorSubject<any[]>([]);

  ngOnInit() {
    this.chart1();
    this.chart2();
    this.chart3();
    this.getPeople('').subscribe(people => {
      this.people = people;
      console.log("Personas cargadas:", this.people); // Verifica los datos cargados
      this.filtrarPersonasPorFecha(this.fechaSeleccionada);
    });
  }

  filtrarPersonasPorFecha(fecha: Date) {
    // Asegúrate de que 'fecha' sea un objeto Date
    if (fecha instanceof Date) {
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1; // Los meses en JavaScript comienzan en 0
      const day = fecha.getDate();
  
      // Filtra las personas basándote en la fecha
      const filtered = this.people.filter(person => 
        person.year_ === year && person.month_ === month && person.day_ === day
      );
  
      // Asegúrate de que la llamada a console.log esté aquí, después de filtrar
      console.log("Personas filtradas:", filtered);
      this.filteredPeople.next(filtered); // Actualiza el BehaviorSubject
    } else {
      console.error('La fecha proporcionada no es una instancia de Date.');
    }
  }

  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'New Patients',
          data: [31, 40, 28, 51, 42, 85, 77],
        },
        {
          name: 'Old Patients',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#7D4988', '#66BB6A'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z',
        ],
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }
  private chart2() {
    this.radialChartOptions = {
      series: [44, 55, 67],
      chart: {
        height: 265,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function () {
                return '249';
              },
            },
          },
        },
      },
      colors: ['#ffc107', '#3f51b5', '#8bc34a'],

      labels: ['Face TO Face', 'E-Consult', 'Available'],
    };
  }
  private chart3() {
    this.linechartOptions = {
      series: [
        {
          name: 'Male',
          data: [44, 55, 57, 56, 61, 58],
        },
        {
          name: 'Female',
          data: [76, 85, 101, 98, 87, 105],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#5C9FFB', '#AEAEAE'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      yaxis: {},
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  colores = ['col-purple', 'col-indigo', 'col-blue', 'col-cyan', 'col-teal', 'col-yellow', 'col-brown', 'col-grey'];

  getPeople(filter: string): Observable<any[]> {
    // Aquí debes implementar la lógica para obtener la lista de personas desde tu backend
    // Por ahora, solo devolveremos una lista de prueba
    return of([
      { 
        id_cita_medica: 151,
        id_paciente: 1,
        hora_cita: 10,
        minutos: 35,
        nombre: 'Juan Carlos Caceres asjdnciaslnsdicj',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'F',
        edad: 22,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 16,
        tipoCita: "Nueva Cita",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 152,
        id_paciente: 2,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 16,
        tipoCita: "Nueva Cita",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 153,
        id_paciente: 3,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 16,
        tipoCita: "Nueva Cita",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 154,
        id_paciente: 4,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 15,
        tipoCita: "Antigua",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 155,
        id_paciente: 5,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 14,
        tipoCita: "Antigua",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 156,
        id_paciente: 6,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 15,
        tipoCita: "Nueva Cita",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 157,
        id_paciente: 7,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 15,
        tipoCita: "Antigua",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 158,
        id_paciente: 8,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 14,
        tipoCita: "Nueva Cita",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
      { 
        id_cita_medica: 159,
        id_paciente: 9,
        hora_cita: 9,
        minutos: 35,
        nombre: 'Juan Carlos Vargas Caceres',
        ruta_imagen: 'assets/images/user/usrbig4.jpg',
        sexo: 'M',
        edad: 30,
        symptoms: ['prueba'],
        year_: 2024,
        month_: 5,
        day_: 14,
        tipoCita: "Antigua",
        observacion: 'nada por ahora',
        ultima_atencion: '2023-12-30T15:30:41.898',
        ultimo_diagnostico: 'data',
        ultimo_tratamiento: 'tratamiento'
      },
    ]);
  }
}
