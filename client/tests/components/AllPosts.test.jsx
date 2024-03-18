import React from "react";
import AllPosts from "../../src/components/allPosts/AllPosts";
import { renderWithProviders } from "../../src/config/test-utils";

describe("AllPosts", () => {
  beforeEach(() => {
    // Mocks intersectionObserver, which isn't available in test environment
    const mockIntersectionObserver = vitest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

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
          preview:
            "somePreviewUrl",
        },
      ],
    },
    {
      _id: "w1",
      title: "w1",
      subtitle: "",
      content: "",
      postTags: ["Palermo"],
      category: "Walls",
      media: [
        {
          url: "someUrl",
          publicId: "id1",
          mediaType: "img",
          preview:
            "somePreviewUrl",
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
          preview:
            "somePreviewUrl",
        },
      ],
    },
  ];

  const routes = ["/Walls"]

  test("Should render a list of posts by category if posts exist.", () => {
    const { getAllByRole } = renderWithProviders(
      <AllPosts />,
      {
        preloadedState: {
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
            categoryTags: {},
            activeTag: "",
            status: "idle" || "loading" || "succeeded" || "failed",
            error: "" || null,
          },
        },
        routes: routes,
      }
    );

    const postsBelongingToCategory = initialPosts.filter(
      (post) => post.category === "Walls"
    );

    const postsLinks = getAllByRole("link");
    expect(postsLinks.length).toBe(postsBelongingToCategory.length);
  });

  test("Should render a no-posts message if there are no posts in the given category.", () => {
    const { getByLabelText } = renderWithProviders(
      <AllPosts />,
      {
        preloadedState: {
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
            categoryTags: {},
            activeTag: "",
            status: "idle" || "loading" || "succeeded" || "failed",
            error: "" || null,
          },
        },
        routes: ["/Sketchbooks", "/Sculptures"],
      }
    );
    const message = getByLabelText(/no-posts/i)
    expect(message).toBeInTheDocument();
  });
});
