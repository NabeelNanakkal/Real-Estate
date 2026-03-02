import { call, put, takeLatest } from 'redux-saga/effects';
import { contactService } from '../../services/api';
import {
  fetchContactContent, fetchContactContentSuccess, fetchContactContentFailure,
  updateContactContent, updateContactContentSuccess, updateContactContentFailure,
} from '../slices/contactSlice';

function* fetchContactContentSaga() {
  try {
    const { data } = yield call(contactService.getContactContent);
    if (data.success && data.data) {
      yield put(fetchContactContentSuccess(data.data));
    }
  } catch (err) {
    yield put(fetchContactContentFailure(err.message));
  }
}

function* updateContactContentSaga({ payload }) {
  try {
    const { data } = yield call(contactService.updateContactContent, payload);
    if (data.success) {
      yield put(updateContactContentSuccess(data.data));
    }
  } catch (err) {
    yield put(updateContactContentFailure(err.response?.data?.message || err.message));
  }
}

export function* watchContact() {
  yield takeLatest(fetchContactContent.type, fetchContactContentSaga);
  yield takeLatest(updateContactContent.type, updateContactContentSaga);
}
