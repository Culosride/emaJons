import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice"
import tagsReducer from "../features/tags/tagsSlice"

// should turn off dev tools for production
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    tags: tagsReducer,
  }
})

// export type AppDispatch = typeof store.dispatch
// export RootState = typeof store.getState
