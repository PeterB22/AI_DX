import { createReducer, on } from "@ngrx/store";
import { updateLoading, updateProjectId, updateQuery } from "./search.action";

export const initialState = {
    projectId: '',
    query: '',
    loading: false
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
  }),
  on(updateLoading, (state, { loading }) => {
    return {
      ...state,
      loading
    };
  })
);
