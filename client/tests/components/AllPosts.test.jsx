import React from "react";
import AllPosts from "../../src/components/allPosts/AllPosts";
import { initialStateTest, renderWithProviders } from "../../src/config/test-utils";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";

describe("AllPosts", () => {
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

  test("should render a list of posts by category if posts exist.", () => {
    // Test with a category that has posts in initialStateTest
    const testCategory = "Walls";

    const { getAllByRole } = renderWithProviders(
      <Routes>
        <Route path="/:category" element={<AllPosts />} />
      </Routes>,
      {
        preloadedState: initialStateTest,
        routes: [`/${testCategory}`],
      }
    );

    const postsBelongingToCategory = initialStateTest.posts.posts.filter(
      (post) => post.category === testCategory
    );

    const postsLinks = getAllByRole("link");
    expect(postsLinks.length).toBe(postsBelongingToCategory.length);
  });

  test("should render a no-posts message if there are no posts in the given category.", () => {
    // Test with a category that does NOT have posts in initialStateTest
    const testCategory = "Sketchbooks";

    const { getByLabelText } = renderWithProviders(
      <Routes>
        <Route path="/:category" element={<AllPosts />} />
      </Routes>,
      {
        preloadedState: initialStateTest,
        routes: [`/${testCategory}`],
      }
    );

    const message = getByLabelText(/no-posts/i);
    expect(message).toBeInTheDocument();
  });

  test("should render posts filtered by active tag", () => {
    const testCategory = "Walls";
    const activeTag = "Mexico";

    const { getAllByRole } = renderWithProviders(
      <Routes>
        <Route path="/:category" element={<AllPosts />} />
      </Routes>,
      {
        preloadedState: {
          ...initialStateTest,
          tags: {
            ...initialStateTest.tags,
            activeTag: activeTag,
          },
        },
        routes: [`/${testCategory}`],
      }
    );

    const filteredPostsByActiveTag = initialStateTest.posts.posts.filter(
      (post) => post.postTags.includes(activeTag)
    );

    const postsLinks = getAllByRole("link");
    expect(postsLinks.length).toBe(filteredPostsByActiveTag.length);
  });
});
