import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  availableTags: [],
  selectedTags: [],
  categoryTags: {},
  activeTag: "",
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const addNewTag = createAsyncThunk("createTag", async (tag) => {
    const response = await api.addNewTag(tag)
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
    resetTags: (state) => {
      state.availableTags = [...state.availableTags, ...state.selectedTags]
      state.selectedTags = []
    },
    selectTag: (state, action) => {
      state.activeTag = action.payload
    },
    toggleTag: (state, action) => {
      if(state.selectedTags.includes(action.payload)) {
        const filteredTags = state.selectedTags.filter(tag => tag !== action.payload)
          return state = {
            ...state,
            selectedTags: [...filteredTags],
            availableTags: state.availableTags.concat(action.payload),
          }
      } else {
        const filteredTags = state.availableTags.filter(tag => tag !== action.payload)
          return state = {
            ...state,
            availableTags: filteredTags,
            selectedTags: state.selectedTags.concat(action.payload),
          }
      }
    }
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
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(addNewTag.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addNewTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTags = state.selectedTags.concat(action.payload)
      })
      .addCase(addNewTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message
      })
      .addCase(deleteTag.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteTag.fulfilled, (state, { payload }) => {
        const filteredTags = state.availableTags.filter(tag => tag !== payload.deletedTag)
        return state = {
          ...state,
          availableTags: filteredTags,
          status: 'succeeded',
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message
      })
  }
})

export const { toggleTag, selectTag, resetTags } = tagsSlice.actions

export default tagsSlice.reducer
