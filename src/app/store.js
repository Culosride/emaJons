import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice"

// should turn off dev tools for production
export const store = configureStore({
  reducer: {
    posts: postsReducer,
  }
})

// export type AppDispatch = typeof store.dispatch
// export RootState = typeof store.getState
