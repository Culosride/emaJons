import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../API/index";

const initialState = {
  posts: [],
  currentCategory: "",
  currentPost: "",
  fullscreen: false,
  status: "idle" || "loading" || "succeeded" || "failed",
  error: "" || null,
};

export const createPost = createAsyncThunk("createPost", async (formData) => {
  const response = await api.createPost(formData);
  return response.data;
});

export const editPost = createAsyncThunk("updatePost", async (payload) => {
  const { formData, postId } = payload;
  const response = await api.editPost(formData, postId);
  return response.data;
});

export const deletePost = createAsyncThunk("deletePost", async ([postId, category]) => {
    const response = await api.deletePost([postId, category]);
    return response.data;
});

export const fetchPosts = createAsyncThunk("getPosts", async () => {
  const response = await api.fetchPosts();
  return response.data;
});

export const fetchPostsByCategory = createAsyncThunk("getPostsByCategory", async (category) => {
    const response = await api.fetchPostsByCategory(category);
    return response.data;
});

export const fetchPostById = createAsyncThunk("getPostById", async (postId) => {
  const response = await api.fetchPostById(postId);
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    toggleFullscreen(state, action) {
      state.fullscreen =
        action.payload !== undefined ? action.payload : !state.fullscreen;
    },
    setCurrentPost(state, action) {
      if (action.payload) {
        return state = {
          ...state,
          currentPost: action.payload,
          currentCategory: action.payload.category,
          fullscreen: false,
        };
      } else {
        return state = {
          ...state,
          fullscreen: false,
          currentPost: "",
          currentCategory: "",
        };
      }
    },
    setCurrentCategory(state, action) {
      state.status = "succeeded";
      state.error = null;
      state.currentCategory = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createPost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {

        return state = {
          ...state,
          status: "succeeded",
          currentPost: action.payload,
          posts: state.posts.concat(action.payload),
          error: "",
        };
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(editPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editPost.fulfilled, (state, action) => {
        let index;

        const filteredPosts = state.posts.filter((post, i) => {
          if (post._id === action.payload._id) index = i; // stores updated post previous index
          return post._id !== action.payload._id;
        });

        filteredPosts.splice(index, 0, action.payload);

        return state = {
          ...state,
          posts: [...filteredPosts],
          status: "succeeded",
          currentPost: action.payload,
          error: "",
        };
      })
      .addCase(editPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {

        return state = {
          ...state,
          status: "succeeded",
          posts: action.payload,
          error: null,
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export const {
  clearResults,
  setCurrentPost,
  setCurrentCategory,
  toggleFullscreen,
  setCurrentMedia,
} = postsSlice.actions;

export default postsSlice.reducer;
