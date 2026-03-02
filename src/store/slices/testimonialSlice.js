import { createSlice } from '@reduxjs/toolkit';

const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState: {
    list: [],
    loading: false,
    error: null,
    mutationLoading: false,
    mutationSuccess: false,
    mutationError: null,
  },
  reducers: {
    fetchTestimonials:        (state) => { state.loading = true; state.error = null; },
    fetchTestimonialsSuccess: (state, { payload }) => { state.loading = false; state.list = payload; },
    fetchTestimonialsFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    addTestimonial:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    addTestimonialSuccess: (state) => { state.mutationLoading = false; state.mutationSuccess = true; },
    addTestimonialFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    updateTestimonial:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    updateTestimonialSuccess: (state) => { state.mutationLoading = false; state.mutationSuccess = true; },
    updateTestimonialFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    deleteTestimonial:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    deleteTestimonialSuccess: (state, { payload }) => {
      state.mutationLoading = false;
      state.mutationSuccess = true;
      state.list = state.list.filter(t => t._id !== payload);
    },
    deleteTestimonialFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    resetTestimonialMutation: (state) => {
      state.mutationLoading = false;
      state.mutationSuccess = false;
      state.mutationError = null;
    },
  },
});

export const {
  fetchTestimonials, fetchTestimonialsSuccess, fetchTestimonialsFailure,
  addTestimonial, addTestimonialSuccess, addTestimonialFailure,
  updateTestimonial, updateTestimonialSuccess, updateTestimonialFailure,
  deleteTestimonial, deleteTestimonialSuccess, deleteTestimonialFailure,
  resetTestimonialMutation,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;
