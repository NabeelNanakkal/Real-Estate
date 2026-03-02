import { createSlice } from '@reduxjs/toolkit';

const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    list: [],
    loading: false,
    error: null,
    mutationLoading: false,
    mutationSuccess: false,
    mutationError: null,
  },
  reducers: {
    fetchPartners:        (state) => { state.loading = true; state.error = null; },
    fetchPartnersSuccess: (state, { payload }) => { state.loading = false; state.list = payload; },
    fetchPartnersFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    addPartner:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    addPartnerSuccess: (state) => { state.mutationLoading = false; state.mutationSuccess = true; },
    addPartnerFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    deletePartner:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    deletePartnerSuccess: (state, { payload }) => {
      state.mutationLoading = false;
      state.mutationSuccess = true;
      state.list = state.list.filter(p => p._id !== payload);
    },
    deletePartnerFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    resetPartnerMutation: (state) => {
      state.mutationLoading = false;
      state.mutationSuccess = false;
      state.mutationError = null;
    },
  },
});

export const {
  fetchPartners, fetchPartnersSuccess, fetchPartnersFailure,
  addPartner, addPartnerSuccess, addPartnerFailure,
  deletePartner, deletePartnerSuccess, deletePartnerFailure,
  resetPartnerMutation,
} = partnerSlice.actions;

export default partnerSlice.reducer;
