import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MapsComponent } from './maps.component';

@NgModule({
  declarations: [MapsComponent],
  imports: [CommonModule, IonicModule],
  exports: [MapsComponent],
})
export class MapsModule {}
