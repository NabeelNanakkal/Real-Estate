import { call, put, takeLatest } from 'redux-saga/effects';
import { testimonialService } from '../../services/api';
import {
  fetchTestimonials, fetchTestimonialsSuccess, fetchTestimonialsFailure,
  addTestimonial, addTestimonialSuccess, addTestimonialFailure,
  updateTestimonial, updateTestimonialSuccess, updateTestimonialFailure,
  deleteTestimonial, deleteTestimonialSuccess, deleteTestimonialFailure,
} from '../slices/testimonialSlice';

function* fetchTestimonialsSaga({ payload = {} }) {
  try {
    const { data } = yield call(testimonialService.getTestimonials, payload.all || false);
    if (data.success) {
      yield put(fetchTestimonialsSuccess(data.data));
    }
  } catch (err) {
    yield put(fetchTestimonialsFailure(err.message));
  }
}

function* addTestimonialSaga({ payload }) {
  try {
    const { data } = yield call(testimonialService.addTestimonial, payload);
    if (data.success) {
      yield put(addTestimonialSuccess());
      // Refresh list (all=true for admin context)
      yield put(fetchTestimonials({ all: true }));
    }
  } catch (err) {
    yield put(addTestimonialFailure(err.response?.data?.message || err.message));
  }
}

function* updateTestimonialSaga({ payload: { id, data: formData } }) {
  try {
    const { data } = yield call(testimonialService.updateTestimonial, id, formData);
    if (data.success) {
      yield put(updateTestimonialSuccess());
      yield put(fetchTestimonials({ all: true }));
    }
  } catch (err) {
    yield put(updateTestimonialFailure(err.response?.data?.message || err.message));
  }
}

function* deleteTestimonialSaga({ payload }) {
  try {
    yield call(testimonialService.deleteTestimonial, payload);
    yield put(deleteTestimonialSuccess(payload));
  } catch (err) {
    yield put(deleteTestimonialFailure(err.response?.data?.message || err.message));
  }
}

export function* watchTestimonial() {
  yield takeLatest(fetchTestimonials.type, fetchTestimonialsSaga);
  yield takeLatest(addTestimonial.type, addTestimonialSaga);
  yield takeLatest(updateTestimonial.type, updateTestimonialSaga);
  yield takeLatest(deleteTestimonial.type, deleteTestimonialSaga);
}
