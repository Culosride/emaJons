import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice"
import categoriesReducer from "../features/categories/categoriesSlice"
import tagsReducer from "../features/tags/tagsSlice"
import authReducer from "../features/auth/authSlice"
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["posts", "auth", "tags"]
}

const rootReducer = combineReducers({
  posts: postsReducer,
  categories: categoriesReducer,
  auth: authReducer,
  tags: tagsReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// should turn off dev tools for production
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
