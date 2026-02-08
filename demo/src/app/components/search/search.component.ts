import { Component, inject } from '@angular/core';
import { SearchService } from '../../providers/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  private searchService = inject(SearchService);

  onClick() {
    this.searchService.search({
      query: 'recipe',
      projectId: 'conference'
    })
  }
}
