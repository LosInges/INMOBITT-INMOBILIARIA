import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotarioPageRoutingModule } from './notario-routing.module';

import { NotarioPage } from './notario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotarioPageRoutingModule
  ],
  declarations: [NotarioPage]
})
export class NotarioPageModule {}
