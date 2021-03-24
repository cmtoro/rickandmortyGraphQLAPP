import { isNgTemplate } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { EpisodesComponent } from '@app/components/pages/episodes/episodes.component';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Character, DataResponse, Episode } from '../interfaces/data.interface';
import { LocalStorageService } from './localStorage.service';

const QUERY = gql`{
  episodes {
    results {
      name,
      episode
    }
  },
  characters {
    results {
      id,
      name,
      status,
      species,
      type,
      gender,
      image,
      created
    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  

  private episodeSubject = new BehaviorSubject<Episode[]>(null);
  public episode$ = this.episodeSubject.asObservable();

  private characterSubject = new BehaviorSubject<Character[]>(null);
  public character$ = this.characterSubject.asObservable();

  constructor(private apollo: Apollo, private localStorage: LocalStorageService) {
    this.getDataAPI();
  }

  private getDataAPI(): void {
    this.apollo.watchQuery<DataResponse>(
        {
          query:  QUERY
        }
      ).valueChanges.pipe(
        take(1),
        tap(({data}) => {
          const {episodes, characters} = data;
          this.episodeSubject.next(episodes.results);
          this.parseCharactersData(characters.results);
        })
      ).subscribe();
  }

  private parseCharactersData(characters: Character[]): void {
    const currentsFav = this.localStorage.getFavoriteCharacters();
    const newData = characters.map(character => {
      const found = !!currentsFav.find((fav: Character) => fav.id === character.id);
      return {...character, isFavorite: found};
    });
    this.characterSubject.next(newData);
  }
}
