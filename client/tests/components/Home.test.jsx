import React from "react";
import { initialStateTest, renderWithProviders } from "../../src/config/test-utils";
import userEvent from "@testing-library/user-event";
import Home from "../../src/components/home/Home";
import About from "../../src/components/about/About";
import AllPosts from "../../src/components/allPosts/AllPosts";
import { CATEGORIES } from "../../src/config/categories";
import Contact from "../../src/components/contact/Contact";
import ErrorPage from "../../src/components/errorPage/ErrorPage";

describe("Home", () => {
  describe("Render", () => {
    test("should render the error page when path does not match", () => {
      const { getByText } = renderWithProviders(
        {},
        {
          preloadedState: initialStateTest,
          testRouter: [
            { path: "/", element: <Home />, errorElement: <ErrorPage /> },
          ],
          routes: ["/invalidPath"],
        }
      );

      const errorMsg = getByText(/404/);
      expect(errorMsg).toBeInTheDocument();
    });

    test("should render a heading", () => {
      const { getByRole } = renderWithProviders(
        {},
        {
          preloadedState: initialStateTest,
          testRouter: [{ path: "/", element: <Home /> }],
        }
      );

      expect(getByRole("heading")).toBeInTheDocument();
    });

    test("should render a list of category links", () => {
      const linkItems = CATEGORIES.concat(["About", "Contact"]);

      const { getAllByRole } = renderWithProviders(
        {},
        {
          preloadedState: initialStateTest,
          testRouter: [{ path: "/", element: <Home /> }],
        }
      );

      const categoryLinks = getAllByRole("link");

      // Asserts that every category (inc. About and Contact) is present in the rendered component as a link
      linkItems.forEach((item) => {
        expect(categoryLinks.some((link) => link.textContent === item)).toBe(
          true
        );
      });
    });
  });

  describe("Navigation", () => {
    test("should navigate to clicked category", async () => {
      // Mocks intersectionObserver, which isn't available in test environment
      const mockIntersectionObserver = vi.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
      });
      window.IntersectionObserver = mockIntersectionObserver;
      
      // Test a category containing only posts with images
      const testCategory = "Video";

      const { getByText, getAllByLabelText } = renderWithProviders(
        {},
        {
          preloadedState: initialStateTest,
          testRouter: [
            { path: "/", element: <Home /> },
            { path: "/:category", element: <AllPosts /> },
          ],
        }
      );

      const user = userEvent.setup();
      const link = getByText(testCategory);
      await user.click(link);

      // Change RegEx to /image-preview/i when checking for images
      const postsByCategory = getAllByLabelText(/video-preview/i);
      postsByCategory.forEach((post) => {
        expect(post).toBeInTheDocument();
      });
    });

    test("should navigate to the about page", async () => {
      const { getByText } = renderWithProviders(
        {},
        {
          preloadedState: initialStateTest,
          testRouter: [
            { path: "/", element: <Home /> },
            { path: "/About", element: <About /> },
          ],
        }
      );

      const user = userEvent.setup();
      const link = getByText(/about/i);
      await user.click(link);

      expect(getByText(/This is the about page/i)).toBeInTheDocument();
    });

    test("should navigate to the contact page", async () => {
      const { getByText } = renderWithProviders(
        {},
        {
          preloadedState: initialStateTest,
          testRouter: [
            { path: "/", element: <Home /> },
            { path: "/Contact", element: <Contact /> },
          ],
        }
      );

      const user = userEvent.setup();
      const link = getByText(/contact/i);

      await user.click(link);
      expect(getByText(/This is the contact page/i)).toBeInTheDocument();
    });
  });
});
