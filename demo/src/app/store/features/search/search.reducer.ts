import { createReducer, on } from "@ngrx/store";
import { updateProjectId, updateQuery } from "./search.action";

export const initialState = {
    projectId: '',
    query: ''
};

export const searchReducer = createReducer(
  initialState,
  on(updateProjectId, (state, { projectId }) => {
    return {
        ...state,
        projectId
    };
  }),
  on(updateQuery, (state, { query }) => {
    return {
        ...state,
        query
    }
  })
);
