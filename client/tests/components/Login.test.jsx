import React from "react";
import { renderWithProviders } from "../../src/config/test-utils";
import Login from "../../src/components/login/Login";
import Home from "../../src/components/home/Home";
import userEvent from "@testing-library/user-event";
import axios from "axios";

let store, getByLabelText, getByRole, getByText, user, userInputUsername, userInputPassword;

beforeEach(() => {

  ({ store, getByLabelText, getByRole, getByText } = renderWithProviders(
    {},
    {
      testRouter: [
        { path: "/login", element: <Login /> },
        { path: "/", element: <Home /> }
      ],
      routes: ["/login", "/"],
    }
    ));

    localStorage.setItem("access-token", "mockAccessToken")

    user = userEvent.setup();
    userInputUsername = "usernameTest";
    userInputPassword = "passwordTest";
  })

describe("Login", () => {
  describe("Render", () => {
    test('should display login form: username and password inputs, sign in button', () => {
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

    test("should render error message when login request fails", async () => {
      // Mocks a rejected request as the server-side validation failed.
      axios.post.mockRejectedValue({ response: { data: { message: "Unauthorized." }}});

      // Mocks user input typing; needed because inputs have 'required=true' and (initial) 'value=""'
      const usernameInput = getByLabelText(/username/i);
      const passwordInput = getByLabelText(/password/i);
      await user.type(usernameInput, userInputUsername);
      await user.type(passwordInput, userInputPassword);

      // Mocks form submission
      const button = getByRole("button")
      await user.click(button)

      // Asserts that an error message is rendered in the UI
      const errMsg = getByLabelText("error message")
      expect(errMsg).toBeInTheDocument()
      expect(errMsg.textContent).toMatch(/unauthorized/i)
    });

    test("should hide error message when inputs change", async () => {
      // Mocks a rejected request as the server-side validation failed.
      axios.post.mockRejectedValue({ response: { data: { message: "Unauthorized." }}});

      // Mocks user input typing; needed because inputs have 'required=true' and (initial) 'value=""'
      const usernameInput = getByLabelText(/username/i);
      const passwordInput = getByLabelText(/password/i);
      await user.type(usernameInput, userInputUsername);
      await user.type(passwordInput, userInputPassword);

      // Mocks form submission
      const button = getByRole("button")
      await user.click(button)

      // Asserts that an error message is rendered in the UI
      const errMsg = getByLabelText("error message")
      expect(errMsg).toBeInTheDocument()
      expect(errMsg.textContent).toMatch(/unauthorized/i)

      // On input change, error message should disappear
      await user.type(usernameInput, "s");
      expect(errMsg).not.toBeInTheDocument()
    });
  });

  describe("Behavior", () => {
    test("should store correct value of username and password on user input", async () => {
      // Asserts that the initial user input value is an empty string
      const usernameInput = getByLabelText(/username/i);
      const passwordInput = getByLabelText(/password/i);
      expect(usernameInput).toHaveValue("");
      expect(passwordInput).toHaveValue("");

      // Mocks user input typing
      await user.type(usernameInput, userInputUsername);
      await user.type(passwordInput, userInputPassword);

      // Asserts that the new typed value equals the input's value
      const newUsernameInput = getByLabelText(/username/i);
      const newPasswordInput = getByLabelText(/password/i);
      expect(newUsernameInput).toHaveValue(userInputUsername);
      expect(newPasswordInput).toHaveValue(userInputPassword);
    });

    test("should dispatch login action with the correct arguments on submission", async () => {
      const usernameInput = getByLabelText(/username/i);
      const passwordInput = getByLabelText(/password/i);

      // Mocks user typing
      await user.type(usernameInput, userInputUsername);
      await user.type(passwordInput, userInputPassword);

      // Mocks form submission
      const signInButton = getByRole("button");
      await user.click(signInButton);

      // Asserts that the request has been called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith("/api/auth", {
        password: userInputPassword,
        username: userInputUsername,
      });
    });

    test("should authenticate user if username and password match", async () => {
      // Mocks a resolved value for calling the login request
      axios.post.mockReturnValue({ data: { accessToken: "mockAccessToken" } });

      // Asserts that initially 'isLogged=false' in redux state
      expect(store.getState().auth.isLogged).toBe(false);

      // User input
      const usernameInput = getByLabelText(/username/i);
      await user.type(usernameInput, userInputUsername);

      // Password input
      const passwordInput = getByLabelText(/password/i);
      await user.type(passwordInput, userInputPassword);

      // Click sign in button
      const signInButton = getByRole("button");
      await user.click(signInButton);

      // Assert the token has been set in localStorage and that redux state is correctly updated
      expect(localStorage.getItem("access-token")).toEqual("mockAccessToken");
      expect(store.getState().auth.isLogged).toBe(true);
    });
  });

  // describe('Navigation', () => {
  //   test('should redirect to home page if logged', async () => {

  //    })
  //  })
});
