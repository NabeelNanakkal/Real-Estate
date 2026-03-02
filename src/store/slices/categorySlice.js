import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    list: [],
    loading: false,
    error: null,
    mutationLoading: false,
    mutationSuccess: false,
    mutationError: null,
  },
  reducers: {
    fetchCategories:        (state) => { state.loading = true; state.error = null; },
    fetchCategoriesSuccess: (state, { payload }) => { state.loading = false; state.list = payload; },
    fetchCategoriesFailure: (state, { payload }) => { state.loading = false; state.error = payload; },

    addCategory:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    addCategorySuccess: (state) => { state.mutationLoading = false; state.mutationSuccess = true; },
    addCategoryFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    updateCategory:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    updateCategorySuccess: (state) => { state.mutationLoading = false; state.mutationSuccess = true; },
    updateCategoryFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    deleteCategory:        (state) => { state.mutationLoading = true; state.mutationSuccess = false; state.mutationError = null; },
    deleteCategorySuccess: (state, { payload }) => {
      state.mutationLoading = false;
      state.mutationSuccess = true;
      state.list = state.list.filter(c => c._id !== payload);
    },
    deleteCategoryFailure: (state, { payload }) => { state.mutationLoading = false; state.mutationError = payload; },

    resetCategoryMutation: (state) => {
      state.mutationLoading = false;
      state.mutationSuccess = false;
      state.mutationError = null;
    },
  },
});

export const {
  fetchCategories, fetchCategoriesSuccess, fetchCategoriesFailure,
  addCategory, addCategorySuccess, addCategoryFailure,
  updateCategory, updateCategorySuccess, updateCategoryFailure,
  deleteCategory, deleteCategorySuccess, deleteCategoryFailure,
  resetCategoryMutation,
} = categorySlice.actions;

export default categorySlice.reducer;
