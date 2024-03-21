import React from "react";
import TagsContainer from "../../src/components/tag/TagsContainer";
import { renderWithProviders, initialStateTest, } from "../../src/config/test-utils";
import { selectTag } from "../../src/features/tags/tagsSlice";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

describe("TagsContainer", () => {
  describe('Render', () => {
    // TO DO
    // Test with empty tag data to ensure the component handles empty states gracefully.
    test("should render the correct number of tags from Redux store, filtered by category", () => {
      const testCategory = "Video";
      // Tag that should be rendered
      const testTags = ["tag1", "tag2", "tag3"];
      // Tag that should NOT be rendered
      const testTagsFalse = ["2020"];

      const { getByText, queryByText } = renderWithProviders({}, {
        testRouter: [
          { path: "/", element:  <TagsContainer /> },
        ],
        preloadedState: {
          ...initialStateTest,
          posts: {
            ...initialStateTest.posts,
            currentCategory: testCategory,
          },
          tags: {
            ...initialStateTest.tags,
            categoryTags: {
              Video: testTags,
              Walls: testTagsFalse,
            },
          },
        },
      });

      testTags.forEach((tag) => {
        expect(getByText(tag)).toBeInTheDocument();
      });

      testTagsFalse.forEach((tag) => {
        expect(queryByText(tag)).not.toBeInTheDocument();
      });
    });

    test("should render unique string tags sorted alphabetically, followed by unique numeric tags in a descending order ", () => {
      const testCategory = "Video";
      const testTags = ["5", "iab", "éAb1", "bAb1", "bAb1", "1", "ùAb2", "aAb3", "ìab", "2", "1"];

      const { getAllByTestId } = renderWithProviders({}, {
        testRouter: [
          { path: "/", element:  <TagsContainer /> },
        ],
        preloadedState: {
          ...initialStateTest,
          posts: {
            ...initialStateTest.posts,
            currentCategory: testCategory,
          },
          tags: {
            ...initialStateTest.tags,
            categoryTags: {
              [testCategory]: testTags,
            },
          },
        },
      });

      const tags = getAllByTestId("tagTest").map(tag => tag.textContent)
      expect(tags).toEqual(["aAb3", "bAb1", "éAb1", "iab", "ìab", "ùAb2", "5", "2", "1",])
    });

    test("should render activeTag with class 'is-selected'", () => {
      const activeTag = "tagOn";
      const inactiveTag = "tagOff";
      const testCategory = "Video";
      const testTags = [activeTag, inactiveTag]

      const { getByText } = renderWithProviders({}, {
        testRouter: [
          { path: "/", element:  <TagsContainer activeTag={activeTag} /> },
        ],
        preloadedState: {
          ...initialStateTest,
          posts: {
            ...initialStateTest.posts,
            currentCategory: testCategory,
          },
          tags: {
            ...initialStateTest.tags,
            categoryTags: {
              [testCategory]: testTags,
            },
          },
        },
      });

      expect(getByText(activeTag)).toHaveClass("is-selected")
      expect(getByText(inactiveTag)).not.toHaveClass("is-selected")
    })
  })

  describe('Behavior', () => {
    test("should select the correct tag when user clicks it", async () => {
      const testCategory = "Video";
      const initialActiveTag = "";
      const tagToDispatch = "2007";
      const availableTestTags = ["palermo", tagToDispatch];

      const { store, getByText } = renderWithProviders({}, {
        testRouter: [
          { path: "/", element:  <TagsContainer activeTag="" handleSelectTag={() => dispatch(selectTag(tagToDispatch))} /> },
        ],
        preloadedState: {
          ...initialStateTest,
          posts: {
            ...initialStateTest.posts,
            currentCategory: testCategory,
          },
          tags: {
            ...initialStateTest.tags,
            activeTag: initialActiveTag,
            categoryTags: {
              [testCategory]: availableTestTags,
            },
          },
        },
      });

      const { dispatch } = store;
      const user = userEvent.setup();
      const tagToClick = getByText(new RegExp(tagToDispatch, "i"));
      expect(tagToClick).toBeInTheDocument();

      await user.click(tagToClick);
      const updatedStore = store.getState();
      expect(updatedStore.tags.activeTag).toBe(tagToDispatch);
    });

    test("should deselect the current active tag when user clicks it", async () => {
      const testCategory = "Video";
      const tagToDispatch = "2007";
      const initialActiveTag = "2007";
      const availableTestTags = ["palermo", tagToDispatch];

      const { store, getByText } = renderWithProviders({}, {
          testRouter: [
            { path: "/", element:  <TagsContainer activeTag={initialActiveTag} handleSelectTag={() => dispatch(selectTag(tagToDispatch))} /> },
          ],
          preloadedState: {
            ...initialStateTest,
            posts: {
              ...initialStateTest.posts,
              currentCategory: testCategory,
            },
            tags: {
              ...initialStateTest.tags,
              activeTag: initialActiveTag,
              categoryTags: {
                [testCategory]: availableTestTags,
              },
            },
          },
        }
      );

      const { dispatch } = store;
      const user = userEvent.setup();
      const tagToClick = getByText(new RegExp(tagToDispatch, "i"));
      expect(tagToClick).toBeInTheDocument();

      // Asserts that the correct tag is saved in the store as activeTag (does not check className)
      await user.click(tagToClick);
      const updatedStore = store.getState();
      expect(updatedStore.tags.activeTag).toBe("");
    });
  })
});
