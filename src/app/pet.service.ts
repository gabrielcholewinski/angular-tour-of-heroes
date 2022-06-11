import { Injectable } from '@angular/core';
import { Pet } from 'src/app/pets/pet';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private petsUrl = 'api/pets';  // URL to web api

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  /** GET pets from the server */
  getPets (): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.petsUrl)
      .pipe(
        tap(_ => this.log('fetched pets')),
        catchError(this.handleError<Pet[]>('getPets', []))
      );
  }

  /** GET pet by id. Will 404 if id not found */
  getPet(name: string): Observable<Pet> {
    const url = `${this.petsUrl}/${name}`;
    return this.http.get<Pet>(url).pipe(
      tap(_ => this.log(`fetched pet name=${name}`)),
      catchError(this.handleError<Pet>(`getPet name=${name}`))
    );
  }

  /** PUT: update the pet on the server */
  updatePet (pet: Pet): Observable<any> {
    return this.http.put(this.petsUrl, pet, this.httpOptions).pipe(
      tap(_ => this.log(`updated pet name=${pet.name}`)),
      catchError(this.handleError<any>('updatePet'))
    );
  }

  /** POST: add a new pet to the server */
  addPet (pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(this.petsUrl, pet, this.httpOptions).pipe(
      tap((newPet: Pet) => this.log(`added pet w/ id=${newPet.name}`)),
      catchError(this.handleError<Pet>('addPet'))
    );
  }

  /** DELETE: delete the pet from the server */
  deletePet (pet: Pet | number): Observable<Pet> {
    const id = typeof pet === 'number' ? pet : pet.name;
    const url = `${this.petsUrl}/${name}`;

    return this.http.delete<Pet>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted pet name=${name}`)),
      catchError(this.handleError<Pet>('deletePet'))
    );
  }

  /* GET pets whose name contains search term */
  searchPets(term: string): Observable<Pet[]> {
    if (!term.trim()) {
      // if not search term, return empty pet array.
      return of([]);
    }
    return this.http.get<Pet[]>(`${this.petsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found pets matching "${term}"`) :
         this.log(`no pets matching "${term}"`)),
      catchError(this.handleError<Pet[]>('searchPetes', []))
    );
  }

  /** Log a PetService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PetService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
