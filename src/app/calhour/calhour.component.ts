import { RequestService } from '../../../service/request.service';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-calhour',
  templateUrl: './calhour.component.html',
  styleUrls: ['./calhour.component.css'],
})
export class CalhourComponent implements OnInit {
  sumTotalHourtext: any;

  data: any = {
    timeIn: Date,
    timeOut: Date,
  };



  defaultStartDate = new Date();
  defaultStopDate = new Date();

  nowIn = moment().format('YYYY-MM-DD 09:00');
  nowOut = moment().format('YYYY-MM-DD 18:00');


  constructor(
    private confirmationService: ConfirmationService,
    private RequestService: RequestService,
    private router: Router
  ) {
    this.data.timeIn  = moment(this.nowIn, 'YYYY-MM-DD HH:mm', true).toDate();
    this.data.timeOut = moment(this.nowOut, 'YYYY-MM-DD HH:mm', true).toDate();
  }

  ngOnInit() {}






















  calculate() {
    let datadate: any = {
      timeIn: this.data.timeIn,
      timeOut: this.data.timeOut,
    };
    console.log("CalhourComponent -> calculate -> data", datadate)

    let timeIn = datadate.timeIn.getTime();
    let timeOut = datadate.timeOut.getTime();



    let timeInHours  = +moment(datadate.timeIn).format('HH');
    let timeOutHours = +moment(datadate.timeOut).format('HH');
    let timeInMin    = +moment(datadate.timeIn).format('mm');
    let timeOutMin   = +moment(datadate.timeOut).format('mm');

    let calH1;
    let calH2;
    let calH3;
    let calM;

    // calH1 = 12 - timeInH
    // if (timeInH < 13) {
    //     timeInH = 13
    // }
    // calH2 = timeOutHours - timeInH
    // this.sumTotalHourtext = calH1 + calH2


    //////// คำนวนทั้งวัน ///////
    if (timeInHours >= 9 && timeOutHours <= 18) {
      calH1 = 12 - timeInHours;
      console.log("CalhourComponent -> calculate -> calH1", calH1)
      if (timeInHours < 13) {
        timeInHours = 13;
      }
      calH2 = timeOutHours - timeInHours;
      console.log("CalhourComponent -> calculate -> calH2", calH2)
    }

    let sum = calH1 + calH2
    let timeMin =  timeOutMin-timeInMin;

    if (timeMin < 0){
      sum -= 1;
    }


    // if(){

    // }

    sum += '.' + Math.abs(timeMin);
     console.log("CalhourComponent -> calculate -> asd", sum)



     this.sumTotalHourtext = sum
    //////// คำนวนช่วงเช้า ///////
    // if (timeInHours >= 9 && timeOutHours <= 13) {
    //   calH1 = 12 - timeInHours;
    // }






    //////// คำนวนช่วงบ่าย ///////
    // if (timeInHours >= 12 && timeOutHours <= 18) {
    //   if (timeInHours < 13) {
    //     timeInHours = 13;
    //   }
    //   calH2 = 18 - timeInHours;

    // }




    // if(timeIn >= 1605751200000 &&  timeOut !> 1605762000000){
    // let morning;
    // morning = timeOut - timeIn
    // let hoursDiff1 = morning / (3600 * 1000); //หารเอาจำนวนเต็ม

    // }else if(timeIn >= 1605765600000 && timeOut <= 1605751200000){
    // let evening;
    // evening = timeOut - timeIn
    // let hoursDiff2 = evening / (3600 * 1000); //หารเอาจำนวนเต็ม
    // console.log("SaveWorkComponent -> calculate -> hoursDiff2", hoursDiff2)
    // }



  }





























   //คำนวน ชั่วโมงจาก เวลา เข้า-ออก
   fnCalDiffHourFromTimeInTimeOut() {

    let datadate: any = {
      timeIn: this.data.timeIn,
      timeOut: this.data.timeOut,
    };


      let timeOut = new Date(datadate.timeOut).getTime();
      let timeIn = new Date(datadate.timeIn).getTime();
    
    
      let time12 = new Date();
      time12.setHours(12)
      time12.setMinutes(0)
      time12.setSeconds(0)
      time12.setMilliseconds(0)
      let date12 = time12.getTime();
      // console.log("CalhourComponent -> fnCalDiffHourFromTimeInTimeOut -> date12", date12)
   


      let time13 = new Date();
      time13.setHours(13)
      time13.setMinutes(0)
      time13.setSeconds(0)
      time13.setMilliseconds(0)
      let date13 = time13.getTime();
      // console.log("CalhourComponent -> fnCalDiffHourFromTimeInTimeOut -> date13", date13)
   
      if(timeIn <=  date12 && timeIn <= date13){
        let time = timeOut - timeIn;  //msec
        let hoursDiff = time / (3600 * 1000);
        this.sumTotalHourtext =  Math.round(hoursDiff*10)/10 -1;
        console.log("CalhourComponent -> fnCalDiffHourFromTimeInTimeOut -> this.sumTotalHourtext", this.sumTotalHourtext)

      }else{

        let time = timeOut - timeIn;  //msec
        let hoursDiff = time / (3600 * 1000);
        this.sumTotalHourtext = Math.round(hoursDiff*10)/10;

      }
      
   


      // if(+timeIn <= +time12 || +timeOut >= +time13){
      
      //   let time = timeOut - timeIn;  //msec
      //   let hoursDiff = time / (3600 * 1000);
      //   this.sumTotalHourtext = hoursDiff -1
      // }


      // let time = date1 - date2;  //msec
      // let hoursDiff = time / (3600 * 1000);
      // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> hoursDiff", hoursDiff)




      // if(hoursDiff === 9){
      //   this.sumTotalHourtext =  hoursDiff -1
      // }else{
      //   this.sumTotalHourtext =  hoursDiff
      // }





    // const date1 = endDate.getTime();
    // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> date1", date1)
    // const date2 = startDate.getTime();
    // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> date2", date2)

    // const diffInMs = Date.parse(date2) - Date.parse(date1);
    // const diffInHours = diffInMs / 1000 / 60 / 60;

    // console.log(diffInHours);
  }



  reset(){
  this.sumTotalHourtext = ''
  }


  // calculate2() {
  //   let datadate: any = {
  //     timeIn: this.data.timeIn,
  //     timeOut: this.data.timeOut,
  //   };

  //   let timeI = +new Date(datadate.timeIn)
  //   console.log("CalhourComponent -> calculate2 -> timeI", timeI)
  //   let timeOut = +new Date(datadate.timeOut)
  //   console.log("CalhourComponent -> calculate2 -> timeOut", timeOut)
  // }


}
