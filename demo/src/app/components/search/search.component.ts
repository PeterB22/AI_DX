import { Component, inject } from '@angular/core';
import { SearchService } from '../../providers/search.service';
import { select, Store } from '@ngrx/store';
import { selectProjectId, selectQuery } from '../../store/features/search/search.selector';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { updateQuery } from '../../store/features/search/search.action';
import { debounceTime, distinctUntilChanged, filter, switchMap, withLatestFrom } from 'rxjs';
import { SearchRequest } from '../../models/models';

@Component({
  selector: 'app-search',
  imports: [MatFormField, MatInput],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  private searchService = inject(SearchService);
  private store = inject(Store);

  ngAfterViewInit() {
    this.store.pipe(
      select(selectQuery),
      distinctUntilChanged(),
      debounceTime(500),
      withLatestFrom(this.store.pipe(
        select(selectProjectId),
        distinctUntilChanged()
      )),
      filter(([query, projectId]) => Boolean(query) && Boolean(projectId)),
      switchMap(([query, projectId]) => {
        const searchRequest: SearchRequest = {
          query,
          projectId
        };
        return this.searchService.search(searchRequest);
      })
    ).subscribe(searchResponse => {
      this.searchService.searchResult$.next(searchResponse);
    });
  }

  onChange(inputEvent: Event) {
    const query = (inputEvent?.target as HTMLInputElement)?.value;
    this.store.dispatch(updateQuery({ query }))
  }
}
