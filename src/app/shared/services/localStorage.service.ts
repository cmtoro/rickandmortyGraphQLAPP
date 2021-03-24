import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Character } from "@shared/interfaces/data.interface";

const MY_FAVORITES = 'myFavorites';

@Injectable({
    providedIn:'root'
})
export class LocalStorageService {

    private charactersFavSubject = new BehaviorSubject<Character[]>(null);
    public charactersFav$ = this.charactersFavSubject.asObservable();

    constructor() {
        this.initialStorage();
        this.getFavoriteCharacters();
    }

    private initialStorage(): void {

        const currents = JSON.parse(localStorage.getItem(MY_FAVORITES));
        if (!currents) {
            localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
        }
    }

    private removeFromFavorites(id:number): void {
        try {
            const currentsFav = this.getFavoriteCharacters();
            const characters = currentsFav.filter(item => item.id !== id);
            localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
            this.charactersFavSubject.next([...characters]); 
        } catch (error) {
            console.log('Error removing favorites from local storage', error);
            alert('Error removing from local storage');
        }
    }

    private addToFavorites(character:Character): void {
        try {
            const currentsFav = this.getFavoriteCharacters();
            localStorage.setItem(MY_FAVORITES, JSON.stringify([...currentsFav, character]));
            this.charactersFavSubject.next([...currentsFav, character]);
        } catch (error) {
            console.log('Error saving favorites to local storage', error);
            alert('Error saving in local storage');
        }
    }

    public addOrRemoveFavorite(character: Character): void {
        const {id} = character;
        const currentFav = this.getFavoriteCharacters();
        const found = !!currentFav.find((fav: Character) => fav.id === id);
        if (found) {
            this.removeFromFavorites(character.id);
        } else {
            this.addToFavorites(character);
        }
    }

    public clearStorage() {
        try {
            localStorage.clear();
        } catch (error) {
            console.log('Error cleaning favorites from local storage', error);
        }
    }

    public getFavoriteCharacters(): any[] {
        try {
            const charactersFav = JSON.parse(localStorage.getItem(MY_FAVORITES));
            this.charactersFavSubject.next(charactersFav);
            return charactersFav;
        }catch (error) {
            console.log('Error getting favorites from local storage', error);
        }
    }

}