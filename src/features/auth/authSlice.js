import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  token: null,
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const login = createAsyncThunk("/auth", async (userData) => {
  const response = await api.login(userData)
  console.log("res", response)
  return response.data
})

export const logout = createAsyncThunk("/auth/logout", async (token) => {
  const response = await api.logout(token)
  return response.data
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log("setting credentials")
      state.token = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = ""
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addCase(login.rejected, (state, action) => {
        console.log("error at login.rejected",action)
        state.status = "failed";
        console.log(action)
        state.error = "401 Wrong username or password"
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.token = null
        state.status = action.payload.message
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      })
  }
})

export const { setCredentials } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectAuthStatus = (state) => state.auth.status
