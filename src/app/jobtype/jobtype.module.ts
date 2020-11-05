import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobtypeRoutingModule } from './jobtype-routing.module';
import { JobtypeComponent } from './jobtype.component';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {RatingModule} from 'primeng/rating';
import {FileUploadModule} from 'primeng/fileupload';
import {TabMenuModule} from 'primeng/tabmenu';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [JobtypeComponent],
  imports: [
    CommonModule,
    JobtypeRoutingModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    InputNumberModule,
    RatingModule,
    FileUploadModule,
    TabMenuModule,
    ButtonModule,
    FormsModule
  ]
})
export class JobtypeModule { }
