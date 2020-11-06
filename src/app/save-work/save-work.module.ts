import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaveWorkRoutingModule } from './save-work-routing.module';
import { SaveWorkComponent } from './save-work.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import { DxButtonModule } from 'devextreme-angular';
import { DxSchedulerModule} from 'devextreme-angular';
import { DxAutocompleteModule, DxTemplateModule } from 'devextreme-angular';
import { DxSwitchModule } from 'devextreme-angular';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';



@NgModule({
  declarations: [SaveWorkComponent],
  imports: [
    CommonModule,
    SaveWorkRoutingModule,
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
    FormsModule,
    CalendarModule,
    DropdownModule,
    DxSchedulerModule,
    DxButtonModule,
    DxAutocompleteModule,
    DxSwitchModule,
    NzCalendarModule,
    DxTemplateModule
  ]
})
export class SaveWorkModule { }
