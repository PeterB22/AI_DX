import { createSelector } from "@ngrx/store";

export interface SearchState {
  projectId: string;
  query: string;
}

export interface AppState {
  search: SearchState;
}

export const selectSearch = (state: AppState) => state.search;

export const selectProjectId = createSelector(
  selectSearch,
  (searchState: SearchState) => {
    return searchState.projectId;
  }
);

export const selectQuery = createSelector(
    selectSearch,
    (searchState: SearchState) => {
        return searchState.query;
    }
)