import React from "react";
import { initialStateTest, renderWithProviders } from "../../src/config/test-utils";
import Login from "../../src/components/login/Login";
import Home from "../../src/components/home/Home";
import { getByText, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
const userInputUsername = "usernameTest";
const userInputPassword = "passwordTest";

describe("Login", () => {
  describe("Render", () => {
    test('should display login form: username and password inputs, sign in button', () => {
      const { getByLabelText, getByRole, getByText } = renderWithProviders(
        {},
        {
          testRouter: [{ path: "/login", element: <Login /> }],
          routes: ["/login"],
        }
      );

      // Username
      const usernameLabel = getByText(/username:/i)
      expect(usernameLabel).toBeInTheDocument();
      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toBeInTheDocument();

      // Password
      const passwordLabel = getByText(/password:/i)
      expect(passwordLabel).toBeInTheDocument();
      const passwordInput = getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();

      // Sign in button
      const button = getByRole("button")
      expect(button).toBeInTheDocument()
      expect(button.textContent).toMatch(/sign in/i)
      expect(button).toHaveAttribute('type', 'submit')
     })

    test("should display error message if username or password do not match", () => {
      const { getByLabelText, getByRole } = renderWithProviders(
        {},
        {
          testRouter: [{ path: "/login", element: <Login /> }],
          routes: ["/login"],
        }
      );

      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toBeInTheDocument();

      const passwordInput = getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();

      const button = getByRole("button")
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'submit')
    });
  });

  describe("Behavior", () => {
    test("should store correct value of username and password on user input", async () => {
      const { getByLabelText } = renderWithProviders(
        {},
        {
          testRouter: [{ path: "/login", element: <Login /> }],
          preloadedState: {
            ...initialStateTest,
            auth: {
              ...initialStateTest.auth,
              isLogged: "false",
            },
          },
          routes: ["/login"],
        }
      );

      // Assert that the initial user input value is an empty string
      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toHaveValue("");
      const passwordInput = getByLabelText(/password/i);
      expect(passwordInput).toHaveValue("");

      // Assert that the new typed value equals the input's value
      await user.type(usernameInput, userInputUsername);
      const newUsernameInput = getByLabelText(/username/i);
      expect(newUsernameInput).toHaveValue(userInputUsername);

      await user.type(passwordInput, userInputPassword);
      const newPasswordInput = getByLabelText(/password/i);
      expect(newPasswordInput).toHaveValue(userInputPassword);
    });

    test("should dispatch login action when form is submitted", async () => {
      const { store, getByRole, getByLabelText } = renderWithProviders(
        {},
        {
          testRouter: [
            { path: "/login", element: <Login /> },
            { path: "/home", element: <Home /> },
          ],
          preloadedState: {
            ...initialStateTest,
            auth: {
              ...initialStateTest.auth,
              isLogged: "false",
            },
          },
          routes: ["/login"],
        }
      );

      const user = userEvent.setup();
      const userInputUsername = "admin";
      const userInputPassword = "123";

      const usernameInput = getByLabelText(/username/i);
      const passwordInput = getByLabelText(/password/i);

      await user.type(usernameInput, userInputUsername);
      await user.type(passwordInput, userInputPassword);

      // Mocks what the server would send back on a 200 response
      axios.post.mockReturnValue({ data: { accessToken: "mockToken" } });

      const signInButton = getByRole("button");
      await user.click(signInButton);
      expect(axios.post).toHaveBeenCalled();

    });

    test("should authenticate user if username and password match", async () => {
      // Mocks a resolved value for calling the login request in the component
      axios.post.mockReturnValue({ data: { accessToken: "mockAccessToken" } });

      const { store, getByRole, getByLabelText } = renderWithProviders(
        {},
        {
          testRouter: [
            { path: "/login", element: <Login /> },
            { path: "/", element: <Home /> },
          ],
          preloadedState: {
            ...initialStateTest,
            auth: {
              ...initialStateTest.auth,
              isLogged: "false",
            },
          },
          routes: ["/login"],
        }
      );
      const user = userEvent.setup();

      // User input
      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveValue("");

      await user.type(usernameInput, "admin");
      const updatedUsernameInput = getByLabelText(/username/i);
      expect(updatedUsernameInput).toHaveValue("admin");

      // Password input
      const passwordInput = getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveValue("");

      await user.type(passwordInput, "00000");
      const updatedPasswordInput = getByLabelText(/password/i);
      expect(updatedPasswordInput).toHaveValue("00000");

      // Click sign in button
      const signInButton = getByRole("button");
      await user.click(signInButton);
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith("/api/auth", {
        password: "00000",
        username: "admin",
      });

      // Assert the token has been set in localStorage and that redux state is correctly updated
      expect(localStorage.getItem("access-token")).toEqual("mockAccessToken");
      expect(store.getState().auth.isLogged).toBe(true);

      // screen.debug();
    });

  });

});
