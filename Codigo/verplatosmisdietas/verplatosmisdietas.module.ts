import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerplatosmisdietasPage } from './verplatosmisdietas.page';

const routes: Routes = [
  {
    path: '',
    component: VerplatosmisdietasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerplatosmisdietasPage]
})
export class VerplatosmisdietasPageModule {}
