import React from "react";
import AllPosts from "../../src/components/allPosts/AllPosts";
import { initialStateTest, renderWithProviders } from "../../src/config/test-utils";
import Post from "../../src/components/post/Post";
import userEvent from "@testing-library/user-event";

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

  describe("Render", () => {
    test("should render a list of posts by category if posts exist", () => {
      // Test with a category that has posts in initialStateTest
      const testCategory = "Walls";
      const { getAllByRole } = renderWithProviders({}, {
        preloadedState: initialStateTest,
        testRouter: [{ path: "/:category", element: <AllPosts /> }],
        routes: [`/${testCategory}`]
      });

      const postsBelongingToCategory = initialStateTest.posts.posts.filter(
        (post) => post.category === testCategory
      );

      const postsLinks = getAllByRole("link");
      expect(postsLinks.length).toBe(postsBelongingToCategory.length);
    });

    test("should render a no-posts message if there are no posts in the given category", () => {
      // Test with a category that does NOT have posts in initialStateTest
      const testCategory = "Sketchbooks";

      const { getByLabelText } = renderWithProviders({}, {
        preloadedState: initialStateTest,
        testRouter: [{ path: "/:category", element: <AllPosts /> }],
        routes: [`/${testCategory}`]
      });

      const message = getByLabelText(/no-posts/i);
      expect(message).toBeInTheDocument();
    });

    test("should render posts filtered by active tag", () => {
      const testCategory = "Walls";
      const activeTag = "Mexico";

      const { getAllByRole } = renderWithProviders({}, {
        testRouter: [{ path: "/:category", element: <AllPosts /> }],
        preloadedState: {
          ...initialStateTest,
          tags: {
            ...initialStateTest.tags,
            activeTag: activeTag,
          },
        },
        routes: [`/${testCategory}`]
      });

      const filteredPostsByActiveTag = initialStateTest.posts.posts.filter(
        (post) => post.postTags.includes(activeTag)
      );

      const postsLinks = getAllByRole("link");
      expect(postsLinks.length).toBe(filteredPostsByActiveTag.length);
    });
  });

  // describe("Behavior", () => {
    // test scrolling down to load more posts ?
  // })

  describe("Navigation", () => {
    test('should navigate to clicked post', async () => {
      const testCategory = "Walls";
      const testTitle = "Test wall post";

      const { getByText, getByRole } = renderWithProviders({}, {
        testRouter: [
          { path: "/:category", element: <AllPosts /> },
          { path: "/:category/:postId", element: <Post /> },
        ],
        preloadedState: {
          ...initialStateTest,
          posts: {
            ...initialStateTest.posts,
            posts: [
              {
                _id: "w1",
                title: testTitle,
                category: testCategory,
                media: [{
                  url: "http://someUrl",
                  publicId: "id1",
                  mediaType: "image",
                  preview: "somePreviewUrl",
                },],
                postTags: ["testTag1", "testTag2"]
              }
            ]
          }
        },
        routes: [`/${testCategory}`],
      });

      const user = userEvent.setup()

      const postToClik = getByText(new RegExp(testTitle, "i"))
      expect(postToClik).toBeInTheDocument()

      await user.click(postToClik)
      const title = getByRole("heading").textContent

      expect(title).toBeTruthy()
      expect(title).toBe(testTitle)
    })
  })
});
