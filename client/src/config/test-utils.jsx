import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { setupStore } from "../app/store";

export function renderWithProviders( ui, { preloadedState = {}, store = setupStore(preloadedState), routes, ...renderOptions } = {} ) {

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={routes}>
          <Routes>
            <Route path={"/:category"} element={children} />
            <Route path={"/:category/:postId"} element={children} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
