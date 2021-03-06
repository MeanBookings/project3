import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';
declare var $
@Component({
  selector: 'bookingform',
  templateUrl: './bookingform.component.html',
  styleUrls: ['./bookingform.component.scss']
})
export class BookingformComponent implements OnInit {
  //modal bootstrap
  closeResult: string;
  //material settings
  autoTicks = true;
  disabled = false;
  invert = false;
  max = 8;
  min = 1;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 1;
  vertical = false;
  disableSelect = true;
  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;


  //lógica template

  error: string;
  day: any = {}
  dayDate: moment.Moment;
  hours: Array<any>;
  available: Array<any>;
  message: any = "";
  name: string;
  email: string;
  phone:string;
  constructor(
    public session: SessionService,
    public booking: BookingService,
    public router: Router
  ) {
    this.session.userReady.subscribe(user => {
      this.name = user.name
      this.email = user.email
      this.phone = user.phone 
    })

  }

  ngOnInit() {
  }

  sendBooking(bookingForm) {
    bookingForm.value.date_of_book = moment(bookingForm.value.date_of_book).format('YYYY-MM-DD 14:mm:ss')
    this.booking.placeBooking(bookingForm.value).subscribe(result => {
      //NOTA LIMPIAR FORMULARIO DESPUES DE ENVIAR :)
      $('#bookingModal').modal('show')
      if (this.error) console.log(this.error)
    })
  }



  checkDayAvailability(date) {
    this.booking.checkDayAvailability(moment(date).format('YYYY-MM-DD 14:mm:ss')).subscribe(day => {
      this.day = day;
      if (day !== null) this.dayDate = moment(this.day.date);
      if (day !== null) {
        this.disableSelect = false;
        this.hours = this.day.shift.filter(h => h.current > 0).map(h => h.hour)
        this.available = this.day.shift.filter(h => h.current > 0).map(h => h.current)
      }
    })
  }
}

