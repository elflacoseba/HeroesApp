import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes():Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroById(id: string):Observable<Hero|undefined> {
    return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions(query: string): Observable<Hero[]> {

    if (query.length === 0) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
      .pipe(
        map(heroes => {
          if (heroes.length === 0) {
            console.log('No se encontraron héroes');
            return [];
          }

          return heroes.filter(hero => hero.superhero.toLowerCase().includes(query.toLowerCase()));
        })
      );
  }

  addHero( hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero);
  }

  updateHero( hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('El id del héroe es requerido.');

    return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${ hero.id }`, hero);
  }

  deleteHeroById( id: string): Observable<boolean> {
    if (!id) throw Error('El id del héroe es requerido.');

    return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        map( () => true ),
        catchError( error => of(false) ),
      );
  }

}
