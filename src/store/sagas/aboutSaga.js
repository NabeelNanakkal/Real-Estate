import { call, put, takeLatest } from 'redux-saga/effects';
import { aboutService } from '../../services/api';
import {
  fetchAboutContent, fetchAboutContentSuccess, fetchAboutContentFailure,
  updateAboutContent, updateAboutContentSuccess, updateAboutContentFailure,
} from '../slices/aboutSlice';

function* fetchAboutContentSaga() {
  try {
    const { data } = yield call(aboutService.getAboutContent);
    if (data.success) {
      yield put(fetchAboutContentSuccess(data.data));
    }
  } catch (err) {
    yield put(fetchAboutContentFailure(err.message));
  }
}

function* updateAboutContentSaga({ payload }) {
  try {
    const { data } = yield call(aboutService.updateAboutContent, payload);
    if (data.success) {
      yield put(updateAboutContentSuccess(data.data));
    }
  } catch (err) {
    yield put(updateAboutContentFailure(err.response?.data?.message || err.message));
  }
}

export function* watchAbout() {
  yield takeLatest(fetchAboutContent.type, fetchAboutContentSaga);
  yield takeLatest(updateAboutContent.type, updateAboutContentSaga);
}
