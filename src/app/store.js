import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice"
import categoryReducer from "../features/categories/categorySlice"
import authReducer from "../features/auth/authSlice"

// should turn off dev tools for production
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    categories: categoryReducer,
    auth: authReducer,
  }
})

// export type AppDispatch = typeof store.dispatch
// export RootState = typeof store.getState
