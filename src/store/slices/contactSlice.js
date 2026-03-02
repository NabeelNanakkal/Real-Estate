import { createSlice } from '@reduxjs/toolkit';

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    content: null,
    loading: false,
    error: null,
    mutationLoading: false,
    mutationSuccess: false,
    mutationError: null,
  },
  reducers: {
    fetchContactContent:        (state) => { state.loading = true; state.error = null; },
    fetchContactContentSuccess: (state, { payload }) => { state.loading = false; state.content = payload; },
    fetchContactContentFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    updateContactContent:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    updateContactContentSuccess: (state, { payload }) => { state.mutationLoading = false; state.mutationSuccess = true; state.content = payload; },
    updateContactContentFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    resetContactMutation: (state) => {
      state.mutationLoading = false;
      state.mutationSuccess = false;
      state.mutationError = null;
    },
  },
});

export const {
  fetchContactContent, fetchContactContentSuccess, fetchContactContentFailure,
  updateContactContent, updateContactContentSuccess, updateContactContentFailure,
  resetContactMutation,
} = contactSlice.actions;

export default contactSlice.reducer;
