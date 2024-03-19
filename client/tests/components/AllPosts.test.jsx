import React from "react";
import AllPosts from "../../src/components/allPosts/AllPosts";
import { renderWithProviders } from "../../src/config/test-utils";
import { initalStateTest } from "../../src/config/test-utils";

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

  test("Should render a list of posts by category if posts exist.", () => {
    // Test with a category that has posts in initialStateTest
    const testCategory = "Walls"

    const { getAllByRole } = renderWithProviders(<AllPosts />, {
      preloadedState: initalStateTest,
      routes: [`/${testCategory}`,],
    });

    const postsBelongingToCategory = initalStateTest.posts.posts.filter(
      (post) => post.category === testCategory
    );

    const postsLinks = getAllByRole("link");
    expect(postsLinks.length).toBe(postsBelongingToCategory.length);
  });

  test("Should render a no-posts message if there are no posts in the given category.", () => {
    // Test with a category that does NOT have posts in initialStateTest
    const testCategory = "Sketchbooks"

    const { getByLabelText } = renderWithProviders(<AllPosts />, {
      preloadedState: initalStateTest,
      routes: [`/${testCategory}`,],
    });

    const message = getByLabelText(/no-posts/i);
    expect(message).toBeInTheDocument();
  });
});
