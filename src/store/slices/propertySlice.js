import { createSlice } from '@reduxjs/toolkit';

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    list: [],
    featured: [],
    dashboardStats: null,
    loading: false,
    featuredLoading: false,
    statsLoading: false,
    error: null,
    pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
    mutationLoading: false,
    mutationSuccess: false,
    mutationError: null,
  },
  reducers: {
    // Fetch list
    fetchProperties:        (state) => { state.loading = true; state.error = null; },
    fetchPropertiesSuccess: (state, { payload }) => {
      state.loading = false;
      state.list = payload.data;
      if (payload.pagination) {
        state.pagination = payload.pagination;
      }
    },
    fetchPropertiesFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    // Fetch featured
    fetchFeaturedProperties:        (state) => { state.featuredLoading = true; state.error = null; },
    fetchFeaturedPropertiesSuccess: (state, { payload }) => { state.featuredLoading = false; state.featured = payload; },
    fetchFeaturedPropertiesFailure: (state, { payload }) => { state.featuredLoading = false; state.error = payload; },

    // Dashboard stats
    fetchDashboardStats:        (state) => { state.statsLoading = true; },
    fetchDashboardStatsSuccess: (state, { payload }) => { state.statsLoading = false; state.dashboardStats = payload; },
    fetchDashboardStatsFailure: (state, { payload }) => { state.statsLoading = false; state.error = payload; },

    // Mutations
    createProperty:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    createPropertySuccess: (state) => { state.mutationLoading = false; state.mutationSuccess = true; },
    createPropertyFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    updateProperty:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    updatePropertySuccess: (state) => { state.mutationLoading = false; state.mutationSuccess = true; },
    updatePropertyFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    deleteProperty:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    deletePropertySuccess: (state, { payload }) => {
      state.mutationLoading = false;
      state.mutationSuccess = true;
      state.list = state.list.filter(p => p._id !== payload);
    },
    deletePropertyFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    resetPropertyMutation: (state) => {
      state.mutationLoading = false;
      state.mutationSuccess = false;
      state.mutationError = null;
    },
  },
});

export const {
  fetchProperties, fetchPropertiesSuccess, fetchPropertiesFailure,
  fetchFeaturedProperties, fetchFeaturedPropertiesSuccess, fetchFeaturedPropertiesFailure,
  fetchDashboardStats, fetchDashboardStatsSuccess, fetchDashboardStatsFailure,
  createProperty, createPropertySuccess, createPropertyFailure,
  updateProperty, updatePropertySuccess, updatePropertyFailure,
  deleteProperty, deletePropertySuccess, deletePropertyFailure,
  resetPropertyMutation,
} = propertySlice.actions;

export default propertySlice.reducer;
