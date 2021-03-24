import { Injectable } from '@angular/core';
import { EpisodesComponent } from '@app/components/pages/episodes/episodes.component';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Character, DataResponse, Episode } from '../interfaces/data.interface';

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

  constructor(private apollo: Apollo) {
    this.getDataAPI();
  }

  private getDataAPI(): void {
    console.log('getDataAPI');
    this.apollo.watchQuery<DataResponse>(
        {
          query:  QUERY
        }
      ).valueChanges.pipe(
        take(1),
        tap(({data}) => {
          const {episodes, characters} = data;
          console.log(episodes);
          console.log(characters);
          this.episodeSubject.next(episodes.results);
          this.characterSubject.next(characters.results);
        })
      ).subscribe();
  }
}
