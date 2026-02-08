import { Component, inject } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { SearchService } from './providers/search.service';
import { AsyncPipe } from '@angular/common';
import { SearchResponse } from './models/models';
import { Observable, tap, toArray } from 'rxjs';
import { ArticleComponent } from './components/article/article.component';
import { MarkdownService } from './providers/markdown.service';

@Component({
  selector: 'app-root',
  imports: [SearchComponent, ArticleComponent, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [SearchService, MarkdownService]
})
export class App {
  private searchService = inject(SearchService);
  articles$: Observable<SearchResponse> = this.searchService.searchResult$.pipe(
    tap((b) => console.log(b))
  );

}
