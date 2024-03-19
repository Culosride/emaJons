import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { setupStore } from "../app/store";

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    routes = ["/Walls", "/Walls/w1"],
    ...renderOptions
  } = {}
) {
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
const initialPosts = [
  {
    _id: "v1",
    title: "v1",
    subtitle: "",
    content: "",
    postTags: ["Palermo"],
    category: "Video",
    media: [
      {
        url: "someUrl",
        publicId: "id1",
        mediaType: "video",
        preview: "somePreviewUrl",
      },
    ],
  },
  {
    _id: "w1",
    title: "w1",
    subtitle: "",
    content: "",
    postTags: ["Mexico"],
    category: "Walls",
    media: [
      {
        url: "someUrl",
        publicId: "id1",
        mediaType: "img",
        preview: "somePreviewUrl",
      },
    ],
  },
  {
    _id: "w2",
    title: "w2",
    subtitle: "",
    content: "",
    postTags: ["2020"],
    category: "Walls",
    media: [
      {
        url: "someUrl",
        publicId: "id1",
        mediaType: "img",
        preview: "somePreviewUrl",
      },
    ],
  },
];

export const initalStateTest = {
  posts: {
    posts: initialPosts,
    currentCategory: "Walls",
    currentPost: initialPosts[0],
    loadMore: {
      Walls: false,
      Paintings: false,
      Sketchbooks: false,
      Video: false,
      Sculptures: false,
    },
    status: "succeeded",
    error: "",
  },
  tags: {
    availableTags: [],
    categoryTags: {
      Walls: [
        "2020",
        "Macomer",
        "Belluno",
        "2021",
        "2018",
        "Cagliari",
        "Mexico",
      ],
      Paintings: [],
      Sketchbooks: ["Sketchbook", "2018"],
      Video: ["Palermo"],
      Sculptures: [],
    },
    activeTag: "",
    status: "idle" || "loading" || "succeeded" || "failed",
    error: "" || null,
  },
};
