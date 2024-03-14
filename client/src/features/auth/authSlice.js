import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  isLogged: false,
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const login = createAsyncThunk("/auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.login(userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
})

export const logout = createAsyncThunk("/auth/logout", async (token) => {
  const response = await api.logout(token)
  return response.data
})

export const checkPath = createAsyncThunk("/auth/validate-path", async (path, { rejectWithValue }) => {
  try {
    const response = await api.checkPath(path)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogged(state, action) {
      state.isLogged = action.payload
    },
    resetAuthStatus(state, action) {
      state.status = "idle"
      state.error = ""
    }
  },
  extraReducers(builder) {
    builder
      .addCase(checkPath.pending, (state) => {
        state.status = 'loading'
        state.error = ""
      })
      .addCase(checkPath.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = ""
      })
      .addCase(checkPath.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = ""
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isLogged = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.isLogged = false
        state.error = action.payload
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLogged = false
        state.status = "succeeded"
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      })
  }
})

export const { setIsLogged, resetAuthStatus } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectAuthStatus = (state) => state.auth.status
