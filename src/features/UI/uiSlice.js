import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  screenSize: "",
  scrollPosition: 0,
  isFullscreen: false,
  modals: {},
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

const uiSlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setScreenSize(state, action) {
      state.screenSize = action.payload;
    },
    setScrollPosition(state, action) {
      state.scrollPosition = action.payload;
    },
    toggleFullscreen(state, action) {
      state.isFullscreen = action.payload !== undefined ? action.payload : !state.isFullscreen;
    },
    setModal: (state, action) => {
      state.modals[action.payload.key] = action.payload.state
    }
  }
})

export const {
  setScreenSize,
  setScrollPosition,
  toggleFullscreen,
  setModal
} = uiSlice.actions

export default uiSlice.reducer
