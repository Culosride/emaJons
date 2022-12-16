import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  token: null,
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const login = createAsyncThunk("/auth", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.login(userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const logout = createAsyncThunk("/auth/logout", async (token) => {
    const response = await api.logout(token)
    return response.data
})

export const refresh = createAsyncThunk("/auth/refresh", async ({ rejectWithValue }) => {
  try {
    const response = await api.refresh()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken } = action.payload
        state.token = accessToken
        state.status = 'succeeded'
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.token = null
        state.status = action.payload.statusText || "succeeded"
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      })
  }
})

// export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
