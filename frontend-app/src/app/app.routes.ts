import { Routes } from '@angular/router';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

export const routes: Routes = [
  { path: '', component: BienvenidaComponent },
  { path: 'gastos', component: GastosComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '**', redirectTo: '' }
];