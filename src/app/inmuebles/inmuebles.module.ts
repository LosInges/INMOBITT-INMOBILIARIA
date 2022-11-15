import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InmueblesPageRoutingModule } from './inmuebles-routing.module';

import { InmueblesPage } from './inmuebles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InmueblesPageRoutingModule
  ],
  declarations: [InmueblesPage]
})
export class InmueblesPageModule {}
