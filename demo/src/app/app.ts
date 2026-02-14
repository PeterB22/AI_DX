import { Component, inject } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { SearchService } from './providers/search.service';
import { AsyncPipe } from '@angular/common';
import { SearchResponse } from './models/models';
import { Subject } from 'rxjs';
import { ArticleComponent } from './components/article/article.component';
import { MarkdownService } from './providers/markdown.service';
import { ProjectSelectorService } from './providers/project-selector.service';
import { ProjectSelectorComponent } from './components/project-selector/project-selector.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { select, Store } from '@ngrx/store';
import { selectLoading } from './store/features/search/search.selector';

@Component({
  selector: 'app-root',
  imports: [SearchComponent, ArticleComponent, ProjectSelectorComponent, AsyncPipe, MatProgressBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [SearchService, MarkdownService, ProjectSelectorService]
})
export class App {

  private store = inject(Store);
  loading$ = this.store.pipe(select(selectLoading));

  response$ = new Subject<SearchResponse>();

  onResponse(response: SearchResponse) {
    this.response$.next(response);
  }
}
