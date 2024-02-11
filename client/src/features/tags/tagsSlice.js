import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  availableTags: [],
  categoryTags: {},
  activeTag: "",
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const createTag = createAsyncThunk("createTag", async (tag) => {
    const response = await api.createTag(tag)
    return response.data
})

export const deleteTag = createAsyncThunk("deleteTag", async (tagToDelete, { rejectWithValue }) => {
  try {
    const response = await api.deleteTag(tagToDelete)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const fetchTags = createAsyncThunk("fetchTags", async () => {
  const response = await api.fetchTags()
  return response.data
})

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags: (state, action) => {
      const { availableTags, categoryTags } = action.payload
      state.categoryTags = categoryTags;
      state.availableTags = availableTags;
    },
    selectTag: (state, action) => {
      state.activeTag = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categoryTags = action.payload.categoryTags
        state.availableTags = action.payload.availableTags
        state.error = "";
      })
      .addCase(fetchTags.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createTag.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createTag.fulfilled, (state) => {
        state.status = 'succeeded';
        state.activeTag = "";
        state.error = "";
      })
      .addCase(createTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message
      })
      .addCase(deleteTag.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteTag.fulfilled, (state) => {
        state.activeTag = "";
        state.status = 'succeeded';
        state.error = "";
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message
      })
  }
})

export const { setTags, selectTag } = tagsSlice.actions

export default tagsSlice.reducer
