import { appRoutes, router } from "../../src/routes/router";
import {
  initialStateTest,
  renderWithProviders,
} from "../../src/config/test-utils";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import AllPosts from "../../src/components/allPosts/AllPosts";
import Post from "../../src/components/post/Post";
import Home from "../../src/components/home/Home";
import Layout from "../../src/components/layout/Layout";
import { loader } from "../../src/App";
import React from "react";
import Contact from "../../src/components/contact/Contact";

function mockLoader() {
  return {
    posts: initialStateTest.posts,
    availableTags: initialStateTest.tags.availableTags,
    categoryTags: initialStateTest.tags.categoryTags
  }
}
beforeEach(() => {
  // Mocks intersectionObserver, which isn't available in test environment
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

test("renders header component", async () => {
  const { getByText } = renderWithProviders(
    {},
    {
      testRouter: [
        {
          element: <Layout />,
          loader: mockLoader,
          id: "root",
          children: [
            { path: "contact", element: <Contact /> },
          ],
        },
      ],
      preloadedState: initialStateTest,
      routes: ["/contact"],
    }
  );
  screen.debug();
  const user = userEvent.setup();
  const link = getByText(/contact/i);
  expect(link).toBeInTheDocument();

  await user.click(link);
});
