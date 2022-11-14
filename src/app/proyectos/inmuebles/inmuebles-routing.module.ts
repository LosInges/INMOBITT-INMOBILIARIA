import { RouterModule, Routes } from '@angular/router';

import { InmueblesPage } from './inmuebles.page';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: InmueblesPage
  },
  {
    path: 'inmueble/:titulo',
    loadChildren: () => import('./inmueble/inmueble.module').then( m => m.InmueblePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InmueblesPageRoutingModule {}
