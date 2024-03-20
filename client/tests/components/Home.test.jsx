import React from "react";
import { initialStateTest, renderWithProviders } from "../../src/config/test-utils";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import Home from "../../src/components/home/Home"
import About from "../../src/components/about/About"
import { screen } from "@testing-library/react";
import AllPosts from "../../src/components/allPosts/AllPosts";

describe("Home", () => {
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

  test("should navigate to about page", async () => {
    const { getByText } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
      </Routes>,
      {
        preloadedState: initialStateTest,
      }
    );

    const user = userEvent.setup();
    const link = getByText(/about/i);

    await user.click(link);
    expect(getByText(/This is the about page/i)).toBeInTheDocument();
  });

  test('should navigate to clicked category', async () => {
    const testCategory = "Walls";

    const { store, getByText } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:category" element={<AllPosts />} />
      </Routes>,
      {
        preloadedState: initialStateTest,
      }
    );

    const user = userEvent.setup();
    const link = getByText(testCategory);

    await user.click(link);
    expect(store.getState().posts.currentCategory).toBe(testCategory);
  })
});
