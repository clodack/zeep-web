import { configureStore } from '@reduxjs/toolkit';

import { reducer as eventsReducer } from '../features/events/eventsSlize';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
