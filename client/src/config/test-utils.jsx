import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { RouterProvider, createMemoryRouter} from "react-router-dom";
import { setupStore } from "../app/store";

vi.mock("axios", () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
        },
      },
    },
  };
});

export function renderWithProviders(
  ui,
  {
    preloadedState = initialStateTest,
    store = setupStore(preloadedState),
    testRouter = [{}],
    routes = ["/"],
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    const memoryRouter = createMemoryRouter(testRouter, {
      initialEntries: routes,
      initialIndex: 0,
    });

    return (
      <Provider store={store}>
        <RouterProvider router={memoryRouter}>
          {children}
        </RouterProvider>
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

export const initialStateTest = {
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
  auth: {
    isLogged: false,
  }
};
