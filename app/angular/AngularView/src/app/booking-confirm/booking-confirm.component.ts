import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
  styleUrls: ['./booking-confirm.component.scss']
})
export class BookingConfirmComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (!history.state.submitted) {
      this.router.navigate(['/edit']);
    }
  }

}
