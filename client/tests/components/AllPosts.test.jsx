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
      title: "v1",
      subtitle: "",
      content: "",
      postTags: ["Palermo"],
      category: "Video",
      media: [
        {
          url: "http://res.cloudinary.com/dq5eoxabt/video/upload/v1710315055/emaJons_dev/apflnpwaw5urlr1ym1ni.mp4",
          publicId: "emaJons_dev/apflnpwaw5urlr1ym1ni",
          mediaType: "video",
          preview:
            "http://res.cloudinary.com/dq5eoxabt/video/upload/du_1,eo_20p/fl_splice,l_video:emaJons_dev:apflnpwaw5urlr1ym1ni/du_1,eo_50p/fl_layer_apply/fl_splice,l_video:emaJons_dev:apflnpwaw5urlr1ym1ni/du_1,eo_80p/fl_layer_apply/v1/emaJons_dev/apflnpwaw5urlr1ym1ni",
          _id: {
            $oid: "65f156303307f7265f1f944a",
          },
        },
      ],
      createdAt: {
        $date: "2024-03-13T07:30:53.245Z",
      },
      updatedAt: {
        $date: "2024-03-13T18:21:14.879Z",
      },
    },
    {
      _id: "65f1ec86886eab92bc560cd7",
      title: "w1",
      subtitle: "",
      content: "",
      postTags: ["2020", "Macomer"],
      category: "Walls",
      media: [
        {
          url: "http://res.cloudinary.com/dq5eoxabt/image/upload/v1710353543/emaJons_dev/qu6xi7pwrmz5rc9t4xcz.jpg",
          publicId: "emaJons_dev/qu6xi7pwrmz5rc9t4xcz",
          mediaType: "image",
          preview:
            "http://res.cloudinary.com/dq5eoxabt/video/upload/du_1,eo_20p/fl_splice,l_video:emaJons_dev:qu6xi7pwrmz5rc9t4xcz/du_1,eo_50p/fl_layer_apply/fl_splice,l_video:emaJons_dev:qu6xi7pwrmz5rc9t4xcz/du_1,eo_80p/fl_layer_apply/v1/emaJons_dev/qu6xi7pwrmz5rc9t4xcz",
          _id: "65f1ec88886eab92bc560cd9",
          createdAt: "2024-03-13T18:13:17.762Z",
          updatedAt: "2024-03-13T18:13:17.762Z",
        },
      ],
      createdAt: "2024-03-13T18:12:22.368Z",
      updatedAt: "2024-03-13T18:21:14.879Z",
    },
    {
      _id: "65f1ec9f886eab92bc560cee",
      title: "w2",
      subtitle: "",
      content: "",
      postTags: ["2020", "Macomer"],
      category: "Walls",
      media: [
        {
          url: "http://res.cloudinary.com/dq5eoxabt/image/upload/v1710353568/emaJons_dev/vpyy17t8z5xvfmquj0lb.jpg",
          publicId: "emaJons_dev/vpyy17t8z5xvfmquj0lb",
          mediaType: "image",
          preview:
            "http://res.cloudinary.com/dq5eoxabt/video/upload/du_1,eo_20p/fl_splice,l_video:emaJons_dev:vpyy17t8z5xvfmquj0lb/du_1,eo_50p/fl_layer_apply/fl_splice,l_video:emaJons_dev:vpyy17t8z5xvfmquj0lb/du_1,eo_80p/fl_layer_apply/v1/emaJons_dev/vpyy17t8z5xvfmquj0lb",
          _id: "65f1eca1886eab92bc560cf0",
          createdAt: "2024-03-13T18:13:25.098Z",
          updatedAt: "2024-03-13T18:13:25.098Z",
        },
      ],
      createdAt: "2024-03-13T18:12:47.858Z",
      updatedAt: "2024-03-13T18:21:14.879Z",
    },
  ];

  test("Should render posts by category if posts exist.", () => {
    const { getByTestId, getByText, getByRole, getAllByRole } = renderWithProviders(
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
        routes: ["/walls"],
      }
    );

    const postsBelongingToCategory = initialPosts.filter(
      (post) => post.category === "Walls"
    );

    const postsLinks = getAllByRole("link");
    expect(postsLinks.length).toBe(postsBelongingToCategory.length);
  });
});
