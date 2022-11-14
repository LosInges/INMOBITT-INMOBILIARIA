import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotarioPage } from './notario.page';

const routes: Routes = [
  {
    path: '',
    component: NotarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotarioPageRoutingModule {}
