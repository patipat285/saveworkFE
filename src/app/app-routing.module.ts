import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'project', loadChildren: () => import('./project/project.module').then(m => m.ProjectModule) },
  { path: 'jobtype', loadChildren: () => import('./jobtype/jobtype.module').then(m => m.JobtypeModule) },
  { path: 'saveWork', loadChildren: () => import('./save-work/save-work.module').then(m => m.SaveWorkModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
