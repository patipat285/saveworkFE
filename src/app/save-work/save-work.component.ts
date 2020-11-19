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
    timeIn: Date,
    timeOut: Date
  };


  defaultStartDate = new Date();
  defaultStopDate = new Date();

  nowIn = moment().format('YYYY-MM-DD 09:00');
  nowOut = moment().format('YYYY-MM-DD 18:00');


  dataListWork: any = [];
  sumHour: any;
  sumTotalHour = 0;
  headerPopup = '';
  idWork= null;
  searchFromDateFrom :any;
  searchFromProject: any = '';
  searchFromJobType: any = '';
  submitted = false;
  sat: any;
  sun: any;
  disabledDates = null;
  moviesData: any;
  holiday: any = [];
  convertHoliday: any = [];
  rowGroupMetadata: any;
  dataclone : any;
  sumTotalHourtext :any;

  constructor(private RequestService: RequestService) {
    this.dataCreate.timeIn  = moment(this.nowIn, 'YYYY-MM-DD HH:mm', true).toDate();
    this.dataCreate.timeOut = moment(this.nowOut, 'YYYY-MM-DD HH:mm', true).toDate();

    // console.log("SaveWorkComponent -> constructor -> this.dataCreate", this.dataCreate)

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




  fnSubbmitSaveWork() {
    this.submitted = true;

    if ( this.dataCreate.date === null || this.dataCreate.project === '' || this.dataCreate.jobType === '' || this.dataCreate.detail === '' || this.dataCreate.timeIn === null || this.dataCreate.timeOut === null) {
      Swal.fire({
        icon: 'warning',
        title: 'required field',
        text: 'กรุณากรอกข้อมูล',
      });
      return;
    }
    this.displayModal = false;


    let data :any  = {
        date : moment(this.dataCreate.date).format('YYYY-MM-DD'),
        project : this.dataCreate.project,
        jobType : this.dataCreate.jobType,
        detail : this.dataCreate.detail,
        timeIn : this.dataCreate.timeIn,
        timeOut : this.dataCreate.timeOut
      }
      // console.log("SaveWorkComponent -> fnSubbmitSaveWork -> data", data)


    if (this.idWork) {
      // console.log("SaveWorkComponent -> fnSubbmitSaveWork -> idforupdate", this.idWork)
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to Update Work?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Confirm!',
      }).then((result) => {
        if (result.isConfirmed === true) {

            this.RequestService.updateDataWork(this.idWork, data).subscribe(
              (data) => {
                Swal.fire('Success!', ' Update Success', 'success');
                this.submitted = false;
                this.idWork = null
                this.fnGetDataWork();
              }
            );
        }
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to Save Work?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Confirm!',
      }).then((result) => {
        if (result.isConfirmed === true) {
      this.RequestService.saveWork(data).subscribe((data) => {
        Swal.fire('Success!', 'Save Work Success', 'success');
        this.dataCreate = {}
        this.submitted = false;
        this.fnGetDataWork();
      });
    }
      });
    }

  }



  fnEditWork(id) {
    this.idWork = id;
    this.headerPopup = 'Update Work';
    this.displayModal = true;

    if (this.idWork) {
      this.RequestService.getDataWorkeByIdForUpdate(this.idWork).subscribe(
        (data) => {

          this.dataCreate.date = moment(data['date']).toDate()
          this.dataCreate.detail = data['detail'];
          this.dataCreate.jobType = data['jobType'];
          this.dataCreate.project = data['project'];
          this.dataCreate.timeIn = moment(data['timeIn']).toDate()
          this.dataCreate.timeOut = moment(data['timeOut']).toDate()
          // console.log("SaveWorkComponent -> fnEditWork -> this.dataCreate", this.dataCreate)
        }
      );
    }
  }





  //Get aLL data Work
  fnGetDataWork() {
      this.RequestService.getAllDataWork().subscribe((data) => {

      this.dataListWork = data;
      // console.log("SaveWorkComponent -> fnGetDataWork -> this.dataListWork.length", this.dataListWork.length)
      if(this.dataListWork.length === 0) {
        this.sumTotalHour = 0;
      }
      let sumtimeIN;
      let sumtimeOut;
      let datalist;
      let sumTotal = 0;
      this.dataListWork = _.sortBy(this.dataListWork, ['date']);
      for (datalist of this.dataListWork) {
        sumtimeIN = moment(datalist.timeIn).format('yyyy-MM-DD HH:mm:ss');
        sumtimeOut = moment(datalist.timeOut).format('yyyy-MM-DD HH:mm:ss');
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


    });
  }




  //คำนวน ชั่วโมงจาก เวลา เข้า-ออก
  fnCalDiffHourFromTimeInTimeOut(startDate, endDate) {
    // let diff = endDate.getTime() - startDate.getTime();
    // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> startDate.getTime()", startDate.getTime())
    // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> endDate.getTime()", endDate.getTime())
    // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> diff", diff)
    // let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    // let hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
    // console.log("hours ====>", hours);

    // if (hours === 9) {
    //   return hours - 1;
    // } else if (hours < 9) {
    //   return hours;
    // }

let date1 = new Date(endDate).getTime();
let date2 = new Date(startDate).getTime();
let time = date1 - date2;  //msec
let hoursDiff = time / (3600 * 1000);
console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> hoursDiff", hoursDiff)


if(hoursDiff === 9){
  return hoursDiff -1
}else{
 return hoursDiff
}





    // const date1 = endDate.getTime();
    // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> date1", date1)
    // const date2 = startDate.getTime();
    // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> date2", date2)

    // const diffInMs = Date.parse(date2) - Date.parse(date1);
    // const diffInHours = diffInMs / 1000 / 60 / 60;

    // console.log(diffInHours);
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
    this.dataCreate.project = '';
    this.dataCreate.jobType = '';
    this.dataCreate.detail = '';
    // this.dataCreate = {
    //   date: new Date(Date()),
    //   project: '',
    //   jobType: '',
    //   detail: '',
    //   timeIn: null,
    //   timeOut: null
    // };
    // this.dataCreate = {}
    this.submitted = false;
  }




  fnSearchDataWork() {
    let searchWork = {
      searchFromDateFrom: this.searchFromDateFrom,
      searchFromProject: this.searchFromProject,
      searchFromJobType: this.searchFromJobType,
    };
    // console.log("SaveWorkComponent -> fnSearchDataWork -> searchWork", searchWork)

    // let searchWork2 = {

    // }
    // console.log("SaveWorkComponent -> fnSearchDataWork -> searchWork2", searchWork2)
    // console.log("SaveWorkComponent -> fnSearchDataWork -> searchWork", searchWork)


    this.RequestService.searchDataWork(searchWork).subscribe((data) => {
      let sumtimeIN;
      let sumtimeOut;
      let sumTotal = 0;
      this.dataListWork = data;
      if(this.dataListWork.length === 0) {
        this.sumTotalHour = 0;
      }
      this.dataListWork = _.sortBy(this.dataListWork, ['date']);
      for (const data of this.dataListWork) {
        sumtimeIN = moment(data.timeIn).format('yyyy-MM-DD HH:mm:ss');
        sumtimeOut = moment(data.timeOut).format('yyyy-MM-DD HH:mm:ss');
        this.sumHour = this.fnCalDiffHourFromTimeInTimeOut( new Date(sumtimeIN), new Date(sumtimeOut));
        data.hour = this.sumHour;
        sumTotal = sumTotal + data.hour;
        this.sumTotalHour = sumTotal;
        data.date = moment(data.date).format('DD-MM-YYYY');
        data.timeIn = moment(data.timeIn).format('HH:mm')
        data.timeOut = moment(data.timeOut).format('HH:mm')
      }



    });
  }




  clickClear() {
    this.searchFromDateFrom =  null;
    this.searchFromProject = '';
    this.searchFromJobType = '';
    this.sumTotalHour = 0;
    this.fnGetDataWork();
  }




  closeModalDevxtream(event) {
    // console.log("SaveWorkComponent -> closeModalDevxtream -> event", event)

    event.cancel = true;
    this.displayModal = true;
    this.headerPopup = 'Save Work';
    this.dataCreate.date = event.appointmentData.startDate;
    this.dataCreate.project = '';
    this.dataCreate.jobType = '';
    this.dataCreate.detail = '';

    this.dataCreate.timeIn  = moment(this.nowIn, 'YYYY-MM-DD HH:mm', true).toDate();
    this.dataCreate.timeOut = moment(this.nowOut, 'YYYY-MM-DD HH:mm', true).toDate();
    // this.dataCreate.timeIn = event.appointmentData.startDate;
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




  // fnInsertInRow(dataClone) {
  //   let newData = _.groupBy(dataClone, 'date');
  //   console.log("SaveWorkComponent -> fnInsertInRow -> newData", newData)
  //   let dataTemp = [];

  //   for (const key in newData) {
  //     if (newData[key].length > 1) {
  //       let dataListWorkNew1: any = {};
  //       for (let data of newData[key]) {
  //         dataListWorkNew1._id = data._id;
  //         dataListWorkNew1.date = data.date;
  //         dataListWorkNew1.timeIn = !dataListWorkNew1.timeIn
  //           ? '' + data.timeIn
  //           : `${dataListWorkNew1.timeIn}\n${data.timeIn}`;
  //         dataListWorkNew1.timeOut = !dataListWorkNew1.timeOut
  //           ? '' + data.timeOut
  //           : `${dataListWorkNew1.timeOut}\n${data.timeOut}`;
  //         dataListWorkNew1.project = !dataListWorkNew1.project
  //           ? '' + data.project
  //           : `${dataListWorkNew1.project}\n${data.project}`;
  //         dataListWorkNew1.hour = !dataListWorkNew1.hour
  //           ? '' + data.hour
  //           : `${dataListWorkNew1.hour}\n${data.hour}`;
  //         dataListWorkNew1.jobType = !dataListWorkNew1.jobType
  //           ? '' + data.jobType
  //           : `${dataListWorkNew1.jobType}\n${data.jobType}`;
  //         dataListWorkNew1.detail = !dataListWorkNew1.detail
  //           ? '' + data.detail
  //           : `${dataListWorkNew1.detail}\n${data.detail}`;
  //         dataTemp.push(dataListWorkNew1);
  //       }
  //     } else {
  //       let dataListWorkNew2: any = {};
  //       dataListWorkNew2._id = newData[key][0]._id;
  //       dataListWorkNew2.date = newData[key][0].date;
  //       dataListWorkNew2.timeIn = newData[key][0].timeIn;
  //       dataListWorkNew2.timeOut = newData[key][0].timeOut;
  //       dataListWorkNew2.project = newData[key][0].project;
  //       dataListWorkNew2.hour = newData[key][0].hour;
  //       dataListWorkNew2.jobType = newData[key][0].jobType;
  //       dataListWorkNew2.detail = newData[key][0].detail;
  //       dataTemp.push(dataListWorkNew2);
  //     }
  //   }

  //   let dataListWorkNew3 = _.unionBy(dataTemp, 'date');
  //   this.dataListWork = dataListWorkNew3;
  //   console.log("SaveWorkComponent -> fnInsertInRow -> this.dataListWork", this.dataListWork)


  // }

  onSort() {
    this.updateRowGroupMetaData();
}




  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.dataListWork) {
        for (let i = 0; i < this.dataListWork.length; i++) {
            let rowData = this.dataListWork[i];
            let representativeName = rowData.date;
            if (i == 0) {
                this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
            }
            else {
                let previousRowData = this.dataListWork[i - 1];
                let previousRowGroup = previousRowData.date;

                if (representativeName === previousRowGroup)
                    this.rowGroupMetadata[representativeName].size++;
                else
                    this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
            }
        }
    }

    // console.log("SaveWorkComponent -> updateRowGroupMetaData -> rowGroupMetadata", this.rowGroupMetadata)
}


calculate(){
let data :any  = {
  date : moment(this.dataCreate.date).format('YYYY-MM-DD'),
  project : this.dataCreate.project,
  jobType : this.dataCreate.jobType,
  detail : this.dataCreate.detail,
  timeIn : this.dataCreate.timeIn,
  timeOut : this.dataCreate.timeOut
}


let timeInH  = +moment(data.timeIn).format("HH")
let timeOutH = +moment(data.timeOut).format("HH")
let timeInM  = +moment(data.timeIn).format("mm")
let timeOutM = +moment(data.timeOut).format("mm")



  let calH1;
  let calH2;
  let calH3;

  let calM;


  // calH1 = 12 - timeInH
  // if (timeInH < 13) {
  //     timeInH = 13
  // }
  // calH2 = timeOutH - timeInH


  // this.sumTotalHourtext = calH1 + calH2



if(timeInH >= 9 && timeOutH <= 18 ){
  calH1 = 12 - timeInH
  if (timeInH < 13) {
    timeInH = 13
  }
  calH2 = timeOutH - timeInH

}


if(timeInH >= 9 && timeOutH <= 13){
  calM = timeInM - timeOutM
  calH1 = 12 - timeInH
}


if (timeInH >= 12 && timeOutH <= 18){
 if (timeInH < 13) {
    timeInH = 13
 }
 calH2 = 18 - timeInH
}










// this.sumTotalHourtext = cal1 + cal2
// console.log("SaveWorkComponent -> calculate -> this.sumTotalHourtext", this.sumTotalHourtext)



// if(getTimein >=  1605751200000 &&  getTimeout !> 1605762000000){
//   let morning;
//  morning = getTimeout - getTimein
//  let hoursDiff1 = morning / (3600 * 1000); //หารเอาจำนวนเต็ม
//  console.log("SaveWorkComponent -> calculate -> hoursDiff1", hoursDiff1)

//  }else if(getTimein >= 1605765600000 && getTimeout <= 1605751200000){

//   let evening;
//   evening = getTimeout - getTimein
//  let hoursDiff2 = evening / (3600 * 1000); //หารเอาจำนวนเต็ม
//  console.log("SaveWorkComponent -> calculate -> hoursDiff2", hoursDiff2)

//  }




// let time = getTimeout - getTimein;  //มิลลิวินาที
// let hoursDiff = time / (3600 * 1000); //หารเอาจำนวนเต็ม
// console.log("SaveWorkComponent -> calculate -> hoursDiff", hoursDiff)



// if(hoursDiff >= 9){
//   this.sumTotalHourtext =  hoursDiff -1
// }else{
//   this.sumTotalHourtext = hoursDiff;
// }


// if(hoursDiff === 9){
//   this.sumTotalHourtext  = hoursDiff -1
// }else{
//   // this.sumTotalHourtext =  Math.round(hoursDiff*100)/100;
//   // this.sumTotalHourtext = hoursDiff
// }
// console.log("SaveWorkComponent -> calculate -> this.sumTotalHourtext", this.sumTotalHourtext)
}






}
