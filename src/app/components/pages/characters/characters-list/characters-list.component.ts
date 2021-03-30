import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'app-characters-list',
  template: `
    <section class="character__list"
      infiniteScroll (scrolled)="onScrollDown()"
    >
      <app-characters-card *ngFor="let character of characters$ | async" [character]="character"></app-characters-card>
      <button *ngIf="showButton" class="button" (click)="scrollToTop()">⬆️</button>
    </section>
  `,
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent {

  public characters$ = this.dataService.character$;

  public showButton = false;

  private scrollHeight = 500;

  private pageNum = 2;

  constructor(private dataService: DataService, @Inject(DOCUMENT) private document: Document) { }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    const yOffSet = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;
    this.showButton = (yOffSet || scrollTop) > this.scrollHeight;
  }

  public scrollToTop(): void {
    this.document.documentElement.scrollTop = 0;
  }

  public onScrollDown(): void {
    this.dataService.getCharactersByPage(this.pageNum++);
  }

}
