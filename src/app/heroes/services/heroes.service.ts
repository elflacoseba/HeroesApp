import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';
import { filter, map } from 'rxjs/operators';
@Injectable({providedIn: 'root'})
export class HeroService {

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

}
