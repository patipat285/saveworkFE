import { RequestService } from './../../../service/request.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import notify from 'devextreme/ui/notify';
import Query from 'devextreme/data/query';
import * as _ from 'lodash';

@Component({
  selector: 'app-save-work',
  templateUrl: './save-work.component.html',
  styleUrls: ['./save-work.component.css'],
})
export class SaveWorkComponent implements OnInit {
  dataDropdownProject: any = [];
  dataDropdownJobType: any = [];
  selectProject: any;
  displayModal = false;

  dataCreate: any = {
    date: new Date(Date()),
    project: '',
    jobType: '',
    detail: '',
    timeIn: null,
    timeOut: null
  };


  defaultStartDate = new Date();
  defaultStopDate = new Date();

  nowIn = moment().format('YYYY-MM-DD 09:00:00');
  nowOut = moment().format('YYYY-MM-DD 18:00:00');


  dataListWork: any = [];
  sumHour: any;
  sumTotalHour = 0;
  // mode = 'month';
  selectedValueDate = new Date(Date());
  headerPopup = '';
  idWork: any;
  searchFromDateFrom: any;
  searchFromProject: any = '';
  searchFromJobType: any = '';
  submitted = false;
  sat: any;
  sun: any;
  disabledDates = null;
  moviesData: any;
  holiday: any = [];
  convertHoliday: any = [];

  constructor(private RequestService: RequestService) {
    this.dataCreate.timeIn = moment(this.nowIn, 'YYYY-MM-DD HH:mm:ss', true).toDate();
    this.dataCreate.timeOut = moment(this.nowOut, 'YYYY-MM-DD HH:mm:ss', true).toDate();
    console.log("SaveWorkComponent -> constructor -> this.dataCreate", this.dataCreate)
    
  }

  ngOnInit() {
    this.fnGetDropdownProject();
    this.fnGetDataDropdownJobType();
    this.fnGetDataWork();
    this.fnGetHoliday();



  }

  fnGetDropdownProject() {
    try {
      this.RequestService.getAllDataProject().subscribe((data) => {
        this.dataDropdownProject = data;
      });
    } catch (error) {
      console.log(' error', error);
    }
  }

  fnGetDataDropdownJobType() {
    try {
      this.RequestService.getAllDataJobType().subscribe((data) => {
        this.dataDropdownJobType = data;
      });
    } catch (error) {
      console.log(' error', error);
    }
  }

  fnSaveWork() {
    this.displayModal = true;
  }

  fnSubbmitSaveWork(id) {
    this.submitted = true;
    let data: any = {};
    let text;
    data = this.dataCreate;
    console.log("SaveWorkComponent -> fnSubbmitSaveWork -> data", data)
    if (
      this.dataCreate.date === null ||
      this.dataCreate.project === '' ||
      this.dataCreate.jobType === '' ||
      this.dataCreate.detail === '' ||
      this.dataCreate.timeIn === null ||
      this.dataCreate.timeOut === null
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'required field',
        text: 'กรุณากรอกข้อมูล',
      });
      return;
    }
    this.displayModal = false;

    if (id) {
      console.log('SaveWorkComponent -> fnSubbmitSaveWork -> id', id);
      text = 'Do you want to Update Work?';
    } else {
      text = 'Do you want to Create Work?';
    }
    Swal.fire({
      title: 'Are you sure?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm!',
    }).then((result) => {
      if (result.isConfirmed === true) {
        if (this.idWork) {
          this.RequestService.updateDataWork(this.idWork, data).subscribe(
            (data) => {
              Swal.fire('Success!', ' Update Success', 'success');
              this.submitted = false;
              this.fnGetDataWork();
            }
          );
        } else {
          this.RequestService.saveWork(data).subscribe((data) => {
            Swal.fire('Success!', 'Save Work Success', 'success');
              this.dataCreate.project = '';
              this.dataCreate.jobType = '';
              this.dataCreate.detail = '';
              this.dataCreate.timeIn = null ;
              this.dataCreate.timeOut = null;

            this.submitted = false;
            this.fnGetDataWork();
          });
        }
      }
    });
  }

  fnEditWork(id) {
    this.headerPopup = 'Update Work';
    this.displayModal = true;
    this.idWork = id;
    let dataFromId: any = {};
    if (this.idWork) {
      this.RequestService.getDataWorkeByIdForUpdate(this.idWork).subscribe(
        (data) => {
          dataFromId = data;
          console.log("SaveWorkComponent -> fnEditWork -> dataFromId", dataFromId)
          this.dataCreate.date = dataFromId.date
          // this.dataCreate.detail = dataFromId['detail'];
          // this.dataCreate.jobType = dataFromId['jobType'];
          // this.dataCreate.project = dataFromId['project'];
          // this.dataCreate.timeIn = dataFromId['timeIn'];
          // this.dataCreate.timeOut = dataFromId['timeOut'];
        }
      );
    }
  }



  //Get aLL data Work
  fnGetDataWork() {
      this.RequestService.getAllDataWork().subscribe((data) => {
      console.log("SaveWorkComponent -> fnGetDataWork -> data", data)
      this.dataListWork = data;


      let sumtimeIN;
      let sumtimeOut;
      let datalist;
      let sumTotal = 0;

      for (datalist of this.dataListWork) {
        sumtimeIN = moment(datalist.timeIn).format('yyyy-MM-DD HH:mm:ss');
        // console.log("SaveWorkComponent -> fnGetDataWork -> sumtimeIN", sumtimeIN)
        sumtimeOut = moment(datalist.timeOut).format('yyyy-MM-DD HH:mm:ss');
        // console.log("SaveWorkComponent -> fnGetDataWork -> sumtimeOut", sumtimeOut)
        this.sumHour = this.fnCalDiffHourFromTimeInTimeOut(
          new Date(sumtimeIN),
          new Date(sumtimeOut)
        );
        datalist.hour = this.sumHour;
        sumTotal = sumTotal + datalist.hour;
        this.sumTotalHour = sumTotal;
        datalist.date = moment(datalist.date).format('DD-MM-YYYY');
        datalist.timeIn = moment(datalist.timeIn).format('HH:mm')
        datalist.timeOut = moment(datalist.timeOut).format('HH:mm')
      }
     

      let dataClone = _.cloneDeep(this.dataListWork);
      this.fnInsertInRow(dataClone);
    });
  }

  //คำนวน ชั่วโมงจาก เวลา เข้า-ออก
  fnCalDiffHourFromTimeInTimeOut(startDate, endDate) {
    let diff = endDate.getTime() - startDate.getTime();
    let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    let hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
    if (hours === 9) {
      return hours - 1;
    } else {
      return hours;
    }
  }

  fnDeleteWork(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete Work?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.RequestService.deleteDataWork(id).subscribe((res) => {
          Swal.fire('Deleted!', 'delete success', 'success');
          this.sumTotalHour = 0;
          this.fnGetDataWork();
        });
      }
    });
  }

  closeModal() {
    this.displayModal = false;
    // this.dataCreate = {
    //   date: new Date(Date()),
    //   project: '',
    //   jobType: '',
    //   detail: '',
    //   timeIn: null,
    //   timeOut: null
    // };
    this.submitted = false;
  }

  fnSearchDataWork() {
    let searchWork = {
      searchFromDateFrom: this.searchFromDateFrom,
      searchFromProject: this.searchFromProject,
      searchFromJobType: this.searchFromJobType,
    };
    console.log('SaveWorkComponent -> fnSearchDataWork -> searchWork',searchWork);

    this.RequestService.searchDataWork(searchWork).subscribe((data) => {
      let sumtimeIN;
      let sumtimeOut;
      let sumTotal = 0;
      this.dataListWork = data;
      for (const data of this.dataListWork) {
        sumtimeIN = moment(data.timeIn).format('yyyy-MM-DD HH:mm:ss');
        sumtimeOut = moment(data.timeOut).format('yyyy-MM-DD HH:mm:ss');
        this.sumHour = this.fnCalDiffHourFromTimeInTimeOut(
          new Date(sumtimeIN),
          new Date(sumtimeOut)
        );
        data.hour = this.sumHour;
        sumTotal = sumTotal + data.hour;
        this.sumTotalHour = sumTotal;
        data.date = moment(data.date).format('dd-mm-yy');
        data.timeIn = moment(data.timeIn).format('HH:mm');
        data.timeOut = moment(data.timeOut).format('HH:mm');
      }
    });
  }

  clickClear() {
    this.searchFromDateFrom = '';
    this.searchFromProject = '';
    this.searchFromJobType = '';
    this.sumTotalHour = 0;
    this.fnGetDataWork();
  }

  closeModalDevxtream(event) {
    event.cancel = true;
    this.displayModal = true;
    this.headerPopup = 'Save Work';
    this.dataCreate.date = event.appointmentData.startDate;
    this.dataCreate.project = '';
    this.dataCreate.jobType = '';
    this.dataCreate.detail = '';
  }

  isWeekend(date: Date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  fnGetHoliday() {
    this.RequestService.getHolidays().subscribe((data) => {
      this.holiday = data;
      for (const iterator of this.holiday) {
        let changeFormattDate = moment(iterator.startDate).toDate();
        this.convertHoliday.push(changeFormattDate);
      }
    });
  }

  isHoliday(date: Date) {
    let localeDate = date.toLocaleDateString();
    let holidays = this.convertHoliday;
    return (
      holidays.filter((holiday) => {
        return holiday.toLocaleDateString() === localeDate;
      }).length > 0
    );
  }

  notifyDisableDate() {
    Swal.fire({
      icon: 'warning',
      title: 'เป็นวันหยุด!!',
    });
  }

  fnInsertInRow(dataClone) {
    let newData = _.groupBy(dataClone, 'date');
    let dataTemp = [];

    for (const key in newData) {
      if (newData[key].length > 1) {
        let dataListWorkNew1: any = {};
        for (let data of newData[key]) {
          dataListWorkNew1._id = data._id;
          dataListWorkNew1.date = data.date;
          dataListWorkNew1.timeIn = !dataListWorkNew1.timeIn
            ? '' + data.timeIn
            : `${dataListWorkNew1.timeIn}\n${data.timeIn}`;
          dataListWorkNew1.timeOut = !dataListWorkNew1.timeOut
            ? '' + data.timeOut
            : `${dataListWorkNew1.timeOut}\n${data.timeOut}`;
          dataListWorkNew1.project = !dataListWorkNew1.project
            ? '' + data.project
            : `${dataListWorkNew1.project}\n${data.project}`;
          dataListWorkNew1.hour = !dataListWorkNew1.hour
            ? '' + data.hour
            : `${dataListWorkNew1.hour}\n${data.hour}`;
          dataListWorkNew1.jobType = !dataListWorkNew1.jobType
            ? '' + data.jobType
            : `${dataListWorkNew1.jobType}\n${data.jobType}`;
          dataListWorkNew1.detail = !dataListWorkNew1.detail
            ? '' + data.detail
            : `${dataListWorkNew1.detail}\n${data.detail}`;
          dataTemp.push(dataListWorkNew1);
        }
      } else {
        let dataListWorkNew2: any = {};
        dataListWorkNew2._id = newData[key][0]._id;
        dataListWorkNew2.date = newData[key][0].date;
        dataListWorkNew2.timeIn = newData[key][0].timeIn;
        dataListWorkNew2.timeOut = newData[key][0].timeOut;
        dataListWorkNew2.project = newData[key][0].project;
        dataListWorkNew2.hour = newData[key][0].hour;
        dataListWorkNew2.jobType = newData[key][0].jobType;
        dataListWorkNew2.detail = newData[key][0].detail;
        dataTemp.push(dataListWorkNew2);
      }
    }

    let dataListWorkNew3 = _.unionBy(dataTemp, 'date');
    this.dataListWork = dataListWorkNew3;


  }
}
