import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobtypeComponent } from './jobtype.component';

const routes: Routes = [{ path: '', component: JobtypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobtypeRoutingModule { }
