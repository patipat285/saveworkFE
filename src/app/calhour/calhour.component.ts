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

    let timeInH = +moment(datadate.timeIn).format('HH');
    let timeOutH = +moment(datadate.timeOut).format('HH');
    let timeInM = +moment(datadate.timeIn).format('mm');
    let timeOutM = +moment(datadate.timeOut).format('mm');

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



    if (timeInH >= 9 && timeOutH <= 18) {
      calH1 = 12 - timeInH;
      if (timeInH < 13) {
        timeInH = 13;
      }
      calH2 = timeOutH - timeInH;

    }

    if (timeInH >= 9 && timeOutH <= 13) {
      calH1 = 12 - timeInH;
      console.log("CalhourComponent -> calculate -> calH1", calH1)
    }

    if (timeInH >= 12 && timeOutH <= 18) {
      if (timeInH < 13) {
        timeInH = 13;
      }
      calH2 = 18 - timeInH;
      console.log("CalhourComponent -> calculate -> calH2", calH2)

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


   //คำนวน ชั่วโมงจาก เวลา เข้า-ออก
   fnCalDiffHourFromTimeInTimeOut() {

    let datadate: any = {
      timeIn: this.data.timeIn,
      timeOut: this.data.timeOut,
    };


      let date1 = new Date(datadate.timeOut).getTime();
      let date2 = new Date(datadate.timeIn).getTime();
      let time = date1 - date2;  //msec
      let hoursDiff = time / (3600 * 1000);
      // console.log("SaveWorkComponent -> fnCalDiffHourFromTimeInTimeOut -> hoursDiff", hoursDiff)


      if(hoursDiff === 9){
        this.sumTotalHourtext =  hoursDiff -1
      }else if(hoursDiff < 9) {
        this.sumTotalHourtext = Math.round(hoursDiff*100)/100;
      }else{
        this.sumTotalHourtext =  hoursDiff
      }





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



}
