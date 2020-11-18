import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalhourComponent } from './calhour.component';

const routes: Routes = [{ path: '', component: CalhourComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
