import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPage } from './perfil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  },
  {
    path: 'agente/:rfc',
    loadChildren: () => import('./agente/agente.module').then( m => m.AgentePageModule)
  },
  {
    path: 'notario/:rfc',
    loadChildren: () => import('./notario/notario.module').then( m => m.NotarioPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}
