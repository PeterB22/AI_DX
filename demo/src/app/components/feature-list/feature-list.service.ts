import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectProjectId } from '../../store/features/search/search.selector';
import { distinctUntilChanged, exhaustMap, filter, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FeatureListService {

  private store = inject(Store);
  private httpClient = inject(HttpClient);
  private serverUrl = 'http://localhost:3000';

  getFeatures(): Observable<string[]> {
    return this.store.pipe(
      select(selectProjectId),
      distinctUntilChanged(),
      filter(projectId => projectId?.length > 0),
      exhaustMap(projectId => this.httpClient.post<string[]>(`${this.serverUrl}/api/features`, { projectId }))
    );
  }

}
