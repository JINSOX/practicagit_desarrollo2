import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { Role } from '@core';
import { MiembroComponent } from './Components/miembro/miembro.component';
import { UsuarioComponent } from './Components/usuario/usuario.component';
import { PagoComponent } from './Components/pago/pago.component';

export const APP_ROUTE: Route[] = [
    {
        path: '1',
        component: MiembroComponent,
    },
    {
        path: '2',
        component: UsuarioComponent,
    },
    {
        path: '3',
        component: PagoComponent,
    },
    { path: '**', component: Page404Component },
];
