import { RequestService } from '../../../service/request.service';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calhour',
  templateUrl: './calhour.component.html',
  styleUrls: ['./calhour.component.css'],
})
export class CalhourComponent implements OnInit {



  constructor(
    private confirmationService: ConfirmationService,
    private RequestService: RequestService,
    private router: Router
  ) {}

  ngOnInit() {

  }












}
