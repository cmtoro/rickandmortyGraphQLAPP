import { Component } from '@angular/core';
import { SpinnerSerivce } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="overlay" *ngIf="isLoading$ | async">
      <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>`,
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  isLoading$ = this.spinnerService.isLoading$;

  constructor(private spinnerService: SpinnerSerivce) { }
}
