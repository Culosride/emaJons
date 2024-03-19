import React from "react";
import TagsContainer from "../../src/components/tag/TagsContainer";
import { renderWithProviders } from "../../src/config/test-utils";
import { initalStateTest } from "../../src/config/test-utils";
import { selectTag } from "../../src/features/tags/tagsSlice";
import userEvent from "@testing-library/user-event";

describe("TagsContainer", () => {
  test("Should render tags by category", () => {
    const testCategory = "Video";
    // Tag that should be rendered
    const testTag = "palermo";
    // Tag that should NOT be rendered
    const testTagOut = "2020";

    const { getByText, queryByText } = renderWithProviders(
      <TagsContainer activeTag="" handleSelectTag={() => {}} />,
      {
        preloadedState: {
          ...initalStateTest,
          posts: {
            ...initalStateTest.posts,
            currentCategory: testCategory,
          },
          tags: {
            ...initalStateTest.tags,
            categoryTags: {
              Video: [testTag],
              Walls: [testTagOut],
            },
          },
        },
      }
    );
    expect(getByText(testTag)).toBeInTheDocument();
    expect(queryByText(testTagOut)).not.toBeInTheDocument();
  });

  test("Should select the correct tag when user clicks it", async () => {
    const testCategory = "Video";
    const initialActiveTag = "";
    const tagToDispatch = "2007";
    const availableTestTags = ["palermo", tagToDispatch];

    const { store, getByText } = renderWithProviders(
      <TagsContainer handleSelectTag={() => dispatch(selectTag(tagToDispatch))} />,
      {
        preloadedState: {
          ...initalStateTest,
          posts: {
            ...initalStateTest.posts,
            currentCategory: testCategory,
          },
          tags: {
            ...initalStateTest.tags,
            activeTag: initialActiveTag,          // ""
            categoryTags: {
              [testCategory]: availableTestTags,  // Video: ["palermo", "2007"]
            },
          },
        },
      }
    );

    const { dispatch } = store;
    const user = userEvent.setup();
    const tagToClick = getByText(new RegExp(tagToDispatch, "i"))
    expect(tagToClick).toBeInTheDocument();

    await user.click(tagToClick)
    const updatedStore = store.getState();
    expect(updatedStore.tags.activeTag).toBe(tagToDispatch);
  });

  test("Should deselect the current active tag when user clicks it", async () => {
    const testCategory = "Video";
    const tagToDispatch = "2007";
    const initialActiveTag = "2007";
    const availableTestTags = ["palermo", tagToDispatch];

    const { store, getByText } = renderWithProviders(
      <TagsContainer handleSelectTag={() => dispatch(selectTag(tagToDispatch))} />,
      {
        preloadedState: {
          ...initalStateTest,
          posts: {
            ...initalStateTest.posts,
            currentCategory: testCategory,
          },
          tags: {
            ...initalStateTest.tags,
            activeTag: initialActiveTag,
            categoryTags: {
              [testCategory]: availableTestTags,  // Video: ["palermo", "2007"]
            },
          },
        },
      }
    );

    const { dispatch } = store;
    const user = userEvent.setup();
    const tagToClick = getByText(new RegExp(tagToDispatch, "i"))
    expect(tagToClick).toBeInTheDocument();

    await user.click(tagToClick)
    const updatedStore = store.getState();
    expect(updatedStore.tags.activeTag).toBe("");
  });
});
