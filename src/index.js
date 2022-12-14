import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {store} from "./app/store"
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import App from "./App";

const root = createRoot(document.getElementById("root"));
let persistor = persistStore(store);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
