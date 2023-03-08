import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice"
import authReducer from "../features/auth/authSlice"
import tagReducer from "../features/tags/tagsSlice"
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
  whitelist: ["auth"]
}

const rootReducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
  tags: tagReducer,
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
