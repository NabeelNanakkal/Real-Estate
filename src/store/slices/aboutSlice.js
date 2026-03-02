import { createSlice } from '@reduxjs/toolkit';

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    content: null,
    loading: false,
    error: null,
    mutationLoading: false,
    mutationSuccess: false,
    mutationError: null,
  },
  reducers: {
    fetchAboutContent:        (state) => { state.loading = true; state.error = null; },
    fetchAboutContentSuccess: (state, { payload }) => { state.loading = false; state.content = payload; },
    fetchAboutContentFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    updateAboutContent:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    updateAboutContentSuccess: (state, { payload }) => { state.mutationLoading = false; state.mutationSuccess = true; state.content = payload; },
    updateAboutContentFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    resetAboutMutation: (state) => {
      state.mutationLoading = false;
      state.mutationSuccess = false;
      state.mutationError = null;
    },
  },
});

export const {
  fetchAboutContent, fetchAboutContentSuccess, fetchAboutContentFailure,
  updateAboutContent, updateAboutContentSuccess, updateAboutContentFailure,
  resetAboutMutation,
} = aboutSlice.actions;

export default aboutSlice.reducer;
