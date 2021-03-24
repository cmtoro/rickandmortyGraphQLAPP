import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/localStorage.service';
import { Character } from '@shared/interfaces/data.interface';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersCardComponent {
  
  @Input()
  public character: Character;

  constructor(private localStorage: LocalStorageService) {

  }

  public toggleFavorite() :void {
    const isFavorite = this.character.isFavorite;
    this.character.isFavorite = !isFavorite;
    this.localStorage.addOrRemoveFavorite(this.character);
  }

  public getIcon(): string {
    return this.character.isFavorite ? 'heart-solid.svg' : 'heart.svg';
  }
}
