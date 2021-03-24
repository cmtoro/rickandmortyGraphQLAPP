import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/localStorage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public charactersFav$ = this.localStorageService.charactersFav$;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
  }

}
