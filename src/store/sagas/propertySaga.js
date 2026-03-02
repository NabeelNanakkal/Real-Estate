import { call, put, takeLatest } from 'redux-saga/effects';
import { propertyService } from '../../services/api';
import {
  fetchProperties, fetchPropertiesSuccess, fetchPropertiesFailure,
  fetchFeaturedProperties, fetchFeaturedPropertiesSuccess, fetchFeaturedPropertiesFailure,
  fetchDashboardStats, fetchDashboardStatsSuccess, fetchDashboardStatsFailure,
  createProperty, createPropertySuccess, createPropertyFailure,
  updateProperty, updatePropertySuccess, updatePropertyFailure,
  deleteProperty, deletePropertySuccess, deletePropertyFailure,
} from '../slices/propertySlice';

function* fetchPropertiesSaga({ payload = {} }) {
  try {
    const { data } = yield call(propertyService.getProperties, payload);
    if (data.success) {
      yield put(fetchPropertiesSuccess({
        data: data.data,
        pagination: data.pagination,
      }));
    }
  } catch (err) {
    yield put(fetchPropertiesFailure(err.message));
  }
}

function* fetchFeaturedPropertiesSaga() {
  try {
    const { data } = yield call(propertyService.getProperties, { featured: true });
    if (data.success && data.data.length > 0) {
      yield put(fetchFeaturedPropertiesSuccess(data.data.slice(0, 4)));
    } else {
      // Fallback to latest 4
      const { data: latestData } = yield call(propertyService.getProperties, {});
      if (latestData.success) {
        yield put(fetchFeaturedPropertiesSuccess(latestData.data.slice(0, 4)));
      }
    }
  } catch (err) {
    yield put(fetchFeaturedPropertiesFailure(err.message));
  }
}

function* fetchDashboardStatsSaga() {
  try {
    const { data } = yield call(propertyService.getDashboardStats);
    if (data.success) {
      yield put(fetchDashboardStatsSuccess(data.data));
    }
  } catch (err) {
    yield put(fetchDashboardStatsFailure(err.message));
  }
}

function* createPropertySaga({ payload }) {
  try {
    const { data } = yield call(propertyService.createProperty, payload);
    if (data.success) {
      yield put(createPropertySuccess());
    }
  } catch (err) {
    yield put(createPropertyFailure(err.response?.data?.message || err.message));
  }
}

function* updatePropertySaga({ payload: { id, data: formData } }) {
  try {
    const { data } = yield call(propertyService.updateProperty, id, formData);
    if (data.success) {
      yield put(updatePropertySuccess());
    }
  } catch (err) {
    yield put(updatePropertyFailure(err.response?.data?.message || err.message));
  }
}

function* deletePropertySaga({ payload }) {
  try {
    yield call(propertyService.deleteProperty, payload);
    yield put(deletePropertySuccess(payload));
  } catch (err) {
    yield put(deletePropertyFailure(err.response?.data?.message || err.message));
  }
}

export function* watchProperty() {
  yield takeLatest(fetchProperties.type, fetchPropertiesSaga);
  yield takeLatest(fetchFeaturedProperties.type, fetchFeaturedPropertiesSaga);
  yield takeLatest(fetchDashboardStats.type, fetchDashboardStatsSaga);
  yield takeLatest(createProperty.type, createPropertySaga);
  yield takeLatest(updateProperty.type, updatePropertySaga);
  yield takeLatest(deleteProperty.type, deletePropertySaga);
}
