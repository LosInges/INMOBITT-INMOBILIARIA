import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ProyectosPage } from './proyectos.page';

const routes: Routes = [
  {
    path: '',
    component: ProyectosPage
  },
  {
    path: ':proyecto/inmuebles',
    loadChildren: () => import('./inmuebles/inmuebles.module').then( m => m.InmueblesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProyectosPageRoutingModule {}
