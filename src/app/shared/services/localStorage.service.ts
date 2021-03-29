import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Character } from "@shared/interfaces/data.interface";
import { ToastrService } from "ngx-toastr";

const MY_FAVORITES = 'myFavorites';

@Injectable({
    providedIn:'root'
})
export class LocalStorageService {

    private charactersFavSubject = new BehaviorSubject<Character[]>(null);
    public charactersFav$ = this.charactersFavSubject.asObservable();

    constructor(private toastrService: ToastrService) {
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
            this.toastrService.warning(`Removed from favorites`, 'Rick&MortyApp');
        } catch (error) {
            console.log('Error removing favorites from local storage', error);
            this.toastrService.error(`Error removing favorites from local storage ${error}`, 'Rick&MortyApp');
        }
    }

    private addToFavorites(character:Character): void {
        try {
            const currentsFav = this.getFavoriteCharacters();
            localStorage.setItem(MY_FAVORITES, JSON.stringify([...currentsFav, character]));
            this.charactersFavSubject.next([...currentsFav, character]);
            this.toastrService.success(`${character.name} added to favorites`, 'Rick&MortyApp');
        } catch (error) {
            console.log('Error saving favorites to local storage', error);
            this.toastrService.error(`Error saving favorites to local storage ${error}`, 'Rick&MortyApp');
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