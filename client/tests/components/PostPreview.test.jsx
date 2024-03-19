import React from "react";
import PostPreview from "../../src/components/post/PostPreview";
import { renderWithProviders } from "../../src/config/test-utils";

describe("PostPreview", () => {
  test("Should display an image preview if mediaType is image", async () => {
    const mediaTypeTest = "image";

    const { getByLabelText } = renderWithProviders(
      <PostPreview mediaType={mediaTypeTest} />,
      {
        routes: ["/Walls/w1"],
      }
    );

    const image = getByLabelText(new RegExp(mediaTypeTest, "i"));
    expect(image).toBeInTheDocument();
  });

  test("Should display a video preview if mediaType is video", async () => {
    const mediaTypeTest = "video";

    const { getByLabelText } = renderWithProviders(
      <PostPreview mediaType={mediaTypeTest} />,
      {
        routes: ["/Walls/w1"],
      }
    );

    const element = getByLabelText(new RegExp(mediaTypeTest, "i"));
    expect(element).toBeInTheDocument();
  });
});
