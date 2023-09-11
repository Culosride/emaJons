import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice"
import authReducer from "../features/auth/authSlice"
import tagReducer from "../features/tags/tagsSlice"

const reducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
  tags: tagReducer,
})

// should turn off dev tools for production
export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
})
