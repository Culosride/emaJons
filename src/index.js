import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
const root = createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/*" element={<App />}></Route>
          </Routes>
        </Router>
    </Provider>
)
