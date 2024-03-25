import React from "react";
import { initialStateTest, renderWithProviders } from "../../src/config/test-utils";
import Login from "../../src/components/login/Login";
import Home from "../../src/components/home/Home";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import axios from "axios";
import { login } from "../../src/API";
import { act } from "react-dom/test-utils";

vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
        },
      },
    },
  };
});

describe("Login", () => {
  describe("Behavior", () => {
    test("should store correct value of username and password on user input", async () => {
      const { getByLabelText } = renderWithProviders(
        {},
        {
          testRouter: [
            { path: "/login", element: <Login /> },
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
      const userInputUsername = "usernameTest"
      const userInputPassword = "passwordTest"

      // Assert initial user input value to be an empty string
      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toHaveValue("");
      const passwordInput = getByLabelText(/password/i);
      expect(passwordInput).toHaveValue("");

      // Assert new typed input to be equal to the input value
      await user.type(usernameInput, userInputUsername);
      const newUsernameInput = getByLabelText(/username/i);
      expect(newUsernameInput).toHaveValue(userInputUsername);

      await user.type(passwordInput, userInputPassword);
      const newPasswordInput = getByLabelText(/password/i);
      expect(newPasswordInput).toHaveValue(userInputPassword);
    });
    // test("should display error message if username or password do not match", () => {

    // });

    test('should dispatch login action when form is submitted', async () => {
      const { store, getByRole, getByLabelText } = renderWithProviders(
        {},
        {
          testRouter: [
            { path: "/login", element: <Login /> },
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
      const userInputUsername = "admin"
      const userInputPassword = "123"

      const usernameInput = getByLabelText(/username/i);
      const passwordInput = getByLabelText(/password/i);

      await user.type(usernameInput, userInputUsername);
      await user.type(passwordInput, userInputPassword);

      act(() => {
        const signInButton = getByRole("button");
        user.click(signInButton);
      })

      vi.waitFor(() => {
        console.log(store.getState())
      })
      screen.debug()

      import React from "react";
import { initialStateTest, renderWithProviders } from "../../src/config/test-utils";
import Login from "../../src/components/login/Login";
import Home from "../../src/components/home/Home";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import axios from "axios";
import { login } from "../../src/API";
import { act } from "react-dom/test-utils";

vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
        },
      },
    },
  };
});

describe("Login", () => {
  describe("Behavior", () => {
    test("should store correct value of username and password on user input", async () => {
      const { getByLabelText } = renderWithProviders(
        {},
        {
          testRouter: [
            { path: "/login", element: <Login /> },
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
      const userInputUsername = "usernameTest"
      const userInputPassword = "passwordTest"

      // Assert initial user input value to be an empty string
      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toHaveValue("");
      const passwordInput = getByLabelText(/password/i);
      expect(passwordInput).toHaveValue("");

      // Assert new typed input to be equal to the input value
      await user.type(usernameInput, userInputUsername);
      const newUsernameInput = getByLabelText(/username/i);
      expect(newUsernameInput).toHaveValue(userInputUsername);

      await user.type(passwordInput, userInputPassword);
      const newPasswordInput = getByLabelText(/password/i);
      expect(newPasswordInput).toHaveValue(userInputPassword);
    });
    // test("should display error message if username or password do not match", () => {

    // });

    test('should dispatch login action when form is submitted', async () => {
      const { store, getByRole, getByLabelText } = renderWithProviders(
        {},
        {
          testRouter: [
            { path: "/login", element: <Login /> },
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
      const userInputUsername = "admin"
      const userInputPassword = "123"

      const usernameInput = getByLabelText(/username/i);
      const passwordInput = getByLabelText(/password/i);

      await user.type(usernameInput, userInputUsername);
      await user.type(passwordInput, userInputPassword);

      act(() => {
        const signInButton = getByRole("button");
        user.click(signInButton);
      })

      vi.waitFor(() => {
        console.log(store.getState())
      })
      screen.debug()

      // expect(store.dispatch).toHaveBeenCalled();
      // await act(async () => {
      //   await store.dispatch(login({username: "aaa", password: "bbb"}))
      // })

     })

    // test("should authenticate user if username and password match", async () => {
    //   // Mocks a resolved value for calling the login request in the component
    //   axios.post.mockResolvedValue(
    //     Promise.resolve({
    //       data: { accessToken: "mockAccessToken"}
    //     })
    //   )

    //   const { store, getByRole, getByLabelText } =
    //     renderWithProviders(
    //       {},
    //       {
    //         testRouter: [
    //           { path: "/login", element: <Login /> },
    //           { path: "/", element: <Home /> },
    //         ],
    //         preloadedState: {
    //           ...initialStateTest,
    //           auth: {
    //             ...initialStateTest.auth,
    //             isLogged: "false",
    //           },
    //         },
    //         routes: ["/login"],
    //       }
    //     );
    //   const user = userEvent.setup();

    //   // User input
    //   const usernameInput = getByLabelText(/username/i);
    //   expect(usernameInput).toBeInTheDocument();
    //   expect(usernameInput).toHaveValue("");

    //   await user.type(usernameInput, "admin");
    //   const updatedUsernameInput = getByLabelText(/username/i);
    //   expect(updatedUsernameInput).toHaveValue("admin");

    //   // Password input
    //   const passwordInput = getByLabelText(/password/i);
    //   expect(passwordInput).toBeInTheDocument();
    //   expect(passwordInput).toHaveValue("");

    //   await user.type(passwordInput, "00000");
    //   const updatedPasswordInput = getByLabelText(/password/i);
    //   expect(updatedPasswordInput).toHaveValue("00000");

    //   // Click sign in button
    //   const signInButton = getByRole("button");
    //   await user.click(signInButton);
    //   expect(axios.post).toHaveBeenCalled();

    //   // Assert the token has been set in localStorage and that redux state is correctly updated
    //   expect(localStorage.getItem('access-token')).toEqual('mockAccessToken');
    //   expect(store.getState().auth.isLogged).toBe(true)

    //   screen.debug()
    // });
  });
});

      // expect(store.dispatch).toHaveBeenCalled();
      // await act(async () => {
      //   await store.dispatch(login({username: "aaa", password: "bbb"}))
      // })

     })

    // test("should authenticate user if username and password match", async () => {
    //   // Mocks a resolved value for calling the login request in the component
    //   axios.post.mockResolvedValue(
    //     Promise.resolve({
    //       data: { accessToken: "mockAccessToken"}
    //     })
    //   )

    //   const { store, getByRole, getByLabelText } =
    //     renderWithProviders(
    //       {},
    //       {
    //         testRouter: [
    //           { path: "/login", element: <Login /> },
    //           { path: "/", element: <Home /> },
    //         ],
    //         preloadedState: {
    //           ...initialStateTest,
    //           auth: {
    //             ...initialStateTest.auth,
    //             isLogged: "false",
    //           },
    //         },
    //         routes: ["/login"],
    //       }
    //     );
    //   const user = userEvent.setup();

    //   // User input
    //   const usernameInput = getByLabelText(/username/i);
    //   expect(usernameInput).toBeInTheDocument();
    //   expect(usernameInput).toHaveValue("");

    //   await user.type(usernameInput, "admin");
    //   const updatedUsernameInput = getByLabelText(/username/i);
    //   expect(updatedUsernameInput).toHaveValue("admin");

    //   // Password input
    //   const passwordInput = getByLabelText(/password/i);
    //   expect(passwordInput).toBeInTheDocument();
    //   expect(passwordInput).toHaveValue("");

    //   await user.type(passwordInput, "00000");
    //   const updatedPasswordInput = getByLabelText(/password/i);
    //   expect(updatedPasswordInput).toHaveValue("00000");

    //   // Click sign in button
    //   const signInButton = getByRole("button");
    //   await user.click(signInButton);
    //   expect(axios.post).toHaveBeenCalled();

    //   // Assert the token has been set in localStorage and that redux state is correctly updated
    //   expect(localStorage.getItem('access-token')).toEqual('mockAccessToken');
    //   expect(store.getState().auth.isLogged).toBe(true)

    //   screen.debug()
    // });
  });
});
