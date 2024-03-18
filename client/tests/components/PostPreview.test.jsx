import React from "react";
import PostPreview from "../../src/components/post/PostPreview";
import { renderWithProviders } from "../../src/config/test-utils";

describe("PostPreview", () => {
  test("Should display an image preview if mediaType is image", async () => {
    const { getByLabelText } = renderWithProviders(
      <PostPreview mediaType="image" />,
      {
        routes: ["/Walls/w1"],
      }
    );

    const image = getByLabelText(/image-preview/i);
    expect(image).toBeInTheDocument()
  });

  test("Should display a video preview if mediaType is video", async () => {
    const { getByLabelText } = renderWithProviders(
      <PostPreview mediaType="video" />,
      {
        routes: ["/Walls/w1"],
      }
    );
    const video = getByLabelText(/video-preview/i);
    expect(video).toBeInTheDocument()
  });
});
