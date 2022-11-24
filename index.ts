import { fromEvent, map, of, tap } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, concatMap, switchMap, mergeMap, exhaustMap } from 'rxjs/operators';

const fetchButtonElement = document.getElementById('fetch');

interface User {
  nachname: string;
  vorname: string;
  land: string;
  plz: string;
  ort: string;
}

const fetchButton$ = fromEvent(fetchButtonElement, 'click');
const source$ = ajax<any[]>('https://random-data-api.com/api/v2/users?size=100');
fetchButton$
  .pipe(
    tap((event) => console.log(event.type)),
    exhaustMap(() =>
      source$.pipe(
        map((ajaxResponse) => ajaxResponse.response),
        map((response) =>
          response.map((item) => {
            return {
              nachname: item.last_name,
              vorname: item.first_name,
              land: item.address.country,
              plz: item.address.zip,
              ort: item.address.city,
            };
          })
        ),
        catchError((err) => of(`Fehler: ${err}`))
      )
    )
  )
  .subscribe({
    next: (value) => console.log(value),
    error: (error) => console.log('Error', error.message),
    complete: () => console.log('Completed'),
  });
