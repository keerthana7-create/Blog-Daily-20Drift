import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  state: "draft" | "published";
}

export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  author?: string;
}

interface PostsState {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  status: "idle" | "loading" | "failed";
  error?: string;
}

const initialState: PostsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 9,
  status: "idle",
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params: FetchParams | undefined) => {
    const { data } = await api.get("/posts", { params });
    return data as { items: Post[]; total: number; page: number; limit: number };
  }
);

export const fetchPostById = createAsyncThunk("posts/fetchPostById", async (id: string) => {
  const { data } = await api.get(`/posts/${id}`);
  return data as Post;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPage, setLimit } = postsSlice.actions;
export default postsSlice.reducer;
