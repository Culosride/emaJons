import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice"
import categoryReducer from "../features/categories/categorySlice"
import authReducer from "../features/auth/authSlice"
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// import {saveAuthToken} from "../middleware/saveAuthToken"

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ["posts", "categories"]
}

const rootReducer = combineReducers({
  posts: postsReducer,
  categories: categoryReducer,
  auth: authReducer,
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
