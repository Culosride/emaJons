import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from "../../API/index"

const initialState = {
  availableTags: [],
  selectedTags: [],
  status: 'idle' || 'loading' || 'succeeded' || 'failed',
  error: "" || null
}

export const addNewTag = createAsyncThunk("createTag", async (tag, { rejectWithValue }) => {
  try {
    const response = await api.addNewTag(tag)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
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


const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetTags: (state) => {
      state.selectedTags = []
      state.availableTags = []
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
            availableTags: [...filteredTags],
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
        return state = {
          ...state,
          availableTags: [...action.payload],
          status: 'succeeded',
        }
      })
      .addCase(fetchTags.rejected, (state) => {
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
        state.error = action.payload
      })
      .addCase(deleteTag.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteTag.fulfilled, (state, {payload}) => {
        const filteredTags = state.availableTags.filter(tag => tag !== payload.deletedTag)
        return state = {
          ...state,
          availableTags: [...filteredTags],
          status: 'succeeded',
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message
      })
  }
})

export const { } = categoriesSlice.actions


export default categoriesSlice.reducer
