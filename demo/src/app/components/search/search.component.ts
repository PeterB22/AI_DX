import { Component, DestroyRef, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { SearchService } from '../../providers/search.service';
import { select, Store } from '@ngrx/store';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { updateQuery } from '../../store/features/search/search.action';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { selectLoading, selectProjectId, selectQuery } from '../../store/features/search/search.selector';
import { AsyncPipe } from '@angular/common';
import { distinctUntilChanged, filter, first, map, merge, switchMap, tap, withLatestFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchRequest, SearchResponse } from '../../models/models';

@Component({
  selector: 'app-search',
  imports: [MatFormField, MatInput, MatIcon, MatSuffix, MatLabel, MatMiniFabButton, AsyncPipe],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);
  private store = inject(Store);
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  searchDisabled$ = merge(
    this.store.pipe(select(selectLoading)),
    this.store.pipe(select(selectQuery)).pipe(
      map(query => query?.length === 0)
    )
  );
  @Output() response: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  onClick() {
    this.store.pipe(
      select(selectQuery),
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
        return this.searchService.search(searchRequest).pipe(
          tap(() => this.inputEl.nativeElement.value = '')
        );
      }),
      first()
    ).subscribe((searchResult) => {
      this.response.emit(searchResult);
    })
  }

  onChange(inputEvent: Event) {
    const query = (inputEvent?.target as HTMLInputElement)?.value;
    this.store.dispatch(updateQuery({ query }))
  }
}
