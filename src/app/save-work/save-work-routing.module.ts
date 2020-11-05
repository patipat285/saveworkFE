import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaveWorkComponent } from './save-work.component';

const routes: Routes = [{ path: '', component: SaveWorkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaveWorkRoutingModule { }
