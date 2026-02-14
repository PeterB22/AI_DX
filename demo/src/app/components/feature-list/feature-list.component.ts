import { Component, inject } from '@angular/core';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { FeatureListService } from './feature-list.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss'],
  imports: [MatChipSet, MatChip, AsyncPipe],
  providers: [FeatureListService]
})
export class FeatureListComponent {

  private featureListService = inject(FeatureListService);
  featureList$ = this.featureListService.getFeatures();

}
