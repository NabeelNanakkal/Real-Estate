import { createSlice } from '@reduxjs/toolkit';

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState: {
    list: [],
    loading: false,
    error: null,
    mutationLoading: false,
    mutationError: null,
  },
  reducers: {
    fetchInquiries:        (state) => { state.loading = true; state.error = null; },
    fetchInquiriesSuccess: (state, { payload }) => { state.loading = false; state.list = payload; },
    fetchInquiriesFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    deleteInquiry:        (state) => { state.mutationLoading = true; state.mutationError = null; },
    deleteInquirySuccess: (state, { payload }) => {
      state.mutationLoading = false;
      state.list = state.list.filter(i => i._id !== payload);
    },
    deleteInquiryFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    updateInquiryStatus:        (state) => { state.mutationLoading = true; state.mutationError = null; },
    updateInquiryStatusSuccess: (state, { payload }) => {
      state.mutationLoading = false;
      state.list = state.list.map(i => i._id === payload._id ? payload : i);
    },
    updateInquiryStatusFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    retryInquirySync:        (state) => { state.mutationLoading = true; state.mutationError = null; },
    retryInquirySyncSuccess: (state, { payload }) => {
      state.mutationLoading = false;
      state.list = state.list.map(i => i._id === payload._id ? payload : i);
    },
    retryInquirySyncFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },
  },
});

export const {
  fetchInquiries, fetchInquiriesSuccess, fetchInquiriesFailure,
  deleteInquiry, deleteInquirySuccess, deleteInquiryFailure,
  updateInquiryStatus, updateInquiryStatusSuccess, updateInquiryStatusFailure,
  retryInquirySync, retryInquirySyncSuccess, retryInquirySyncFailure,
} = inquirySlice.actions;

export default inquirySlice.reducer;
