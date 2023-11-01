import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  token: null,
  isModal: false,
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const login = createAsyncThunk("/auth/login", async (userData) => {
  const response = await api.login(userData)
  return response.data
})

export const logout = createAsyncThunk("/auth/logout", async (token) => {
  const response = await api.logout(token)
  return response.data
})

export const checkPath = createAsyncThunk("/auth/validate-path", async (path) => {
  const response = await api.checkPath(path)
  return response.data
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.isModal = action.payload
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
        state.error = action.error.message
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = ""
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = "401 Wrong username or password"
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.token = null
        state.status = "succeeded"
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      })
  }
})

export const { setModal } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectAuthStatus = (state) => state.auth.status
