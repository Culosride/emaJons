import React from "react";
import PostPreview from "../../src/components/post/PostPreview";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("PostPreview", () => {
  describe('Render', () => {
    test("should render an image preview if mediaType is image", async () => {
      const mediaTypeTest = "image";
      
      const { getByLabelText } = render(
        <BrowserRouter>
          <PostPreview mediaType={mediaTypeTest} />
        </BrowserRouter>
      );

      const image = getByLabelText(new RegExp(mediaTypeTest, "i"));
      expect(image).toBeInTheDocument();
    });

    test("should render a video preview if mediaType is video", async () => {
      const mediaTypeTest = "video";

      const { getByLabelText } = render(
        <BrowserRouter>
          <PostPreview mediaType={mediaTypeTest} />
        </BrowserRouter>
      );

      const element = getByLabelText(new RegExp(mediaTypeTest, "i"));
      expect(element).toBeInTheDocument();
    });
  })
});
