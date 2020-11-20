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
 //ประกาศตัวแปรรับค่า date time
 let timeIn = new Date(startDate).getTime();   //unixTime
 let timeOut = new Date(endDate).getTime(); //unixTime



      //ประกาศตัวแปร รับ new date แล้ว set เวลา
      let time12 = new Date();
      time12.setHours(12)
      time12.setMinutes(0)
      time12.setSeconds(0)
      time12.setMilliseconds(0)
      let date12 = time12.getTime(); // getTime เพื่อเอา date time ตอนเทีย่ง



      //ประกาศตัวแปร รับ new date แล้ว set เวลา
      let time13 = new Date();
      time13.setHours(13)
      time13.setMinutes(0)
      time13.setSeconds(0)
      time13.setMilliseconds(0)
      let date13 = time13.getTime();// getTime เพื่อเอา date time บ่ายโมง


      if( timeIn <= date12  ){ // ถ้าเวลาเข้า น้อย กว่า หรือเท่ากับ เที่ยง
        let time = timeOut - timeIn;  //เอาเวลาออก ลบ เวลาเข้า จะได้ เวลา ที่เป็น milisecond
        let hoursDiff = time / (3600 * 1000); //หารเอาจำนวนเต็ม = x hour
        if (timeOut >= date13) { // ถ้า เวลาออก มากกว่า หรือ เท่ากับ บ่ายโมง
          return  Math.round(hoursDiff*10)/10-1; // ให้ลบออก 1 ชั่วโมง
        } else {
          return  Math.round(hoursDiff*10)/10;
        }

      }else{
        let time = timeOut - timeIn;  //msec
        let hoursDiff = time / (3600 * 1000);
        return Math.round(hoursDiff*10)/10;


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
