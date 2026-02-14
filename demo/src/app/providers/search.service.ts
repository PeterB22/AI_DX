import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable, Subject, tap } from 'rxjs';
import { SearchRequest, SearchResponse } from '../models/models';
import { Store } from '@ngrx/store';
import { updateLoading, updateQuery } from '../store/features/search/search.action';

@Injectable()
export class SearchService {

    private httpClient = inject(HttpClient);
    private destroyRef = inject(DestroyRef);
    private store = inject(Store);
    private serverUrl = 'http://localhost:3000';
    searchResult$ = new Subject<SearchResponse>();

    search(config: SearchRequest): Observable<SearchResponse> {
        this.store.dispatch(updateLoading({ loading: true }));
        return this.httpClient.post<SearchResponse>(`${this.serverUrl}/api/search`, config).pipe(
            tap(() => this.store.dispatch(updateQuery({ query: '' }))),
            finalize(() => {
                this.store.dispatch(updateLoading({ loading: false }));
            }),
            takeUntilDestroyed(this.destroyRef)
        );
    }

}
