import { createAction, props } from "@ngrx/store";

export const updateProjectId = createAction('[Search] Change project id',
    props<{ projectId: string}>()
);

export const updateQuery = createAction('[Search] Change query',
    props<{ query: string }>()
);

export const updateLoading = createAction('[Search] Change loading',
    props<{ loading: boolean }>()
);
