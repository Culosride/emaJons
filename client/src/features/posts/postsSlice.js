import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../API/index";

const initialState = {
  posts: [],
  currentCategory: "",
  currentPost: "",
  loadMore: {
    Walls: true,
    Paintings: true,
    Sketchbooks: true,
    Video: true,
    Sculptures: true
  },
  status: "idle" || "loading" || "succeeded" || "failed",
  error: "",
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

export const deletePost = createAsyncThunk("deletePost", async (args) => {
    const response = await api.deletePost(args);
    return response.data;
});

export const fetchPosts = createAsyncThunk("getPosts", async () => {
  const response = await api.fetchPosts();
  return response.data;
});

export const fetchPostsByCategory = createAsyncThunk("getPostsByCategory", async (args) => {
    const response = await api.fetchPostsByCategory(args);
    return response.data;
});

export const fetchPostById = createAsyncThunk("getPostById", async (args) => {
  const response = await api.fetchPostById(args);
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload
    },
    setCurrentPost(state, action) {
      if (action.payload) {
        return state = {
          ...state,
          currentPost: action.payload,
          currentCategory: action.payload.category,
        };
      } else {
        return state = {
          ...state,
          currentPost: "",
        };
      }
    },
    setCurrentCategory(state, action) {
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
          // Stores updated post previous index
          if (post._id === action.payload._id) index = i;

          return post._id !== action.payload._id;
        });

        // Injects the updated post at the original position (index)
        filteredPosts.splice(index, 0, action.payload);

        // const updatedPosts = filteredPosts.length === 1 ? [] : filteredPosts

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
        const currentCategory = action.meta.arg.category

        state.status = "succeeded";
        state.error = "";
        state.loadMore = {
          ...state.loadMore,
          [currentCategory]: true
        }
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
          error: "",
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPostsByCategory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {

        const filterPosts = (array1, array2, property) => {
          const ids = new Set(array1.map(item => item[property]));
          const uniquePosts = array2.filter(item => !ids.has(item[property]));
          return uniquePosts;
        }

        const oldPosts = state.posts;
        const newPosts = action.payload.posts
        const filteredPosts = filterPosts(oldPosts, newPosts, '_id');
        const currentCategory = action.meta.arg.category

        return state = {
          ...state,
          posts: [...state.posts, ...filteredPosts],
          status: "succeeded",
          loadMore: {
            ...state.loadMore,
            [currentCategory]: action.payload.moreData
          }
        }
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        return state = {
          ...state,
          status: 'succeeded',
          currentCategory: action.payload.category,
          currentPost: action.payload
       }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
});

export const {
  clearResults,
  setCurrentPost,
  setCurrentCategory,
  setCurrentMedia,
  setPosts,
} = postsSlice.actions;

export const selectPostsByCategory = (state, category) => {
  return state.posts.posts.filter(post => post.category === category);
};

export default postsSlice.reducer;
