import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { shareReplay, tap } from "rxjs";
import { ProjectSelectorService } from "../../providers/project-selector.service";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect, MatSelectChange } from "@angular/material/select";
import { Store } from "@ngrx/store";
import { updateProjectId } from "../../store/features/search/search.action";

@Component({
  selector: 'app-project-selector',
  imports: [AsyncPipe, MatFormField, MatSelect, MatOption, MatLabel],
  templateUrl: './project-selector.component.html',
})
export class ProjectSelectorComponent {

  private projectSelectorService = inject(ProjectSelectorService);
  private store = inject(Store);

  features$ = this.projectSelectorService.getProjects().pipe(
    shareReplay(1),
    tap((features) => this.store.dispatch(updateProjectId({ projectId: features[0] })))
  );

  onChangedSelection({ value }: MatSelectChange<string>) {
    this.store.dispatch(updateProjectId({ projectId: value }));
  }
}
