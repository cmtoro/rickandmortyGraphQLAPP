import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { pluck, take, tap, withLatestFrom } from 'rxjs/operators';
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

  public getCharactersByPage(pageNum: number): any {
    const QUERY_BY_PAGE = gql`{
      characters(page: ${pageNum}) {
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
    this.apollo.watchQuery<any>({
      query: QUERY_BY_PAGE,
    }).valueChanges.pipe(
      take(1),
      pluck('data', 'characters'),
      withLatestFrom(this.character$),
      tap(([apiResponse, characters])=>{
        this.parseCharactersData([...characters, ...apiResponse.results]);
      })
    ).subscribe();
  }
}
