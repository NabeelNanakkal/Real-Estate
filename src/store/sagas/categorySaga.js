import { call, put, takeLatest } from 'redux-saga/effects';
import { categoryService } from '../../services/api';
import {
  fetchCategories, fetchCategoriesSuccess, fetchCategoriesFailure,
  addCategory, addCategorySuccess, addCategoryFailure,
  updateCategory, updateCategorySuccess, updateCategoryFailure,
  deleteCategory, deleteCategorySuccess, deleteCategoryFailure,
} from '../slices/categorySlice';

function* fetchCategoriesSaga() {
  try {
    const { data } = yield call(categoryService.getCategories);
    if (data.success) {
      yield put(fetchCategoriesSuccess(data.data));
    }
  } catch (err) {
    yield put(fetchCategoriesFailure(err.message));
  }
}

function* addCategorySaga({ payload }) {
  try {
    const { data } = yield call(categoryService.addCategory, payload);
    if (data.success) {
      yield put(addCategorySuccess());
      yield put(fetchCategories());
    }
  } catch (err) {
    yield put(addCategoryFailure(err.response?.data?.message || err.message));
  }
}

function* updateCategorySaga({ payload: { id, data: formData } }) {
  try {
    const { data } = yield call(categoryService.updateCategory, id, formData);
    if (data.success) {
      yield put(updateCategorySuccess());
      yield put(fetchCategories());
    }
  } catch (err) {
    yield put(updateCategoryFailure(err.response?.data?.message || err.message));
  }
}

function* deleteCategorySaga({ payload }) {
  try {
    yield call(categoryService.deleteCategory, payload);
    yield put(deleteCategorySuccess(payload));
  } catch (err) {
    yield put(deleteCategoryFailure(err.response?.data?.message || err.message));
  }
}

export function* watchCategory() {
  yield takeLatest(fetchCategories.type, fetchCategoriesSaga);
  yield takeLatest(addCategory.type, addCategorySaga);
  yield takeLatest(updateCategory.type, updateCategorySaga);
  yield takeLatest(deleteCategory.type, deleteCategorySaga);
}
