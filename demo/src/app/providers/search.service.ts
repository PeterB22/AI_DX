import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, switchMap } from 'rxjs';
import { SearchRequest, SearchResponse } from '../models/models';

@Injectable()
export class SearchService {

    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);
    private serverUrl = 'http://localhost:3000';
    searchResult$ = new Subject<SearchResponse>();

    search(config: SearchRequest) {
        this.httpClient.post(`${this.serverUrl}/api/search`, config).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(response => this.searchResult$.next(response as SearchResponse));
    }

}
