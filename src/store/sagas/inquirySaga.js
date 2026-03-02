import { call, put, takeLatest } from 'redux-saga/effects';
import { inquiryService } from '../../services/api';
import {
  fetchInquiries, fetchInquiriesSuccess, fetchInquiriesFailure,
  deleteInquiry, deleteInquirySuccess, deleteInquiryFailure,
  updateInquiryStatus, updateInquiryStatusSuccess, updateInquiryStatusFailure,
  retryInquirySync, retryInquirySyncSuccess, retryInquirySyncFailure,
} from '../slices/inquirySlice';

function* fetchInquiriesSaga() {
  try {
    const { data } = yield call(inquiryService.getInquiries);
    if (data.success) {
      yield put(fetchInquiriesSuccess(data.data));
    }
  } catch (err) {
    yield put(fetchInquiriesFailure(err.message));
  }
}

function* deleteInquirySaga({ payload }) {
  try {
    yield call(inquiryService.deleteInquiry, payload);
    yield put(deleteInquirySuccess(payload));
  } catch (err) {
    yield put(deleteInquiryFailure(err.response?.data?.message || err.message));
  }
}

function* updateInquiryStatusSaga({ payload: { id, status } }) {
  try {
    const { data } = yield call(inquiryService.updateInquiryStatus, id, status);
    if (data.success) {
      yield put(updateInquiryStatusSuccess(data.data));
    }
  } catch (err) {
    yield put(updateInquiryStatusFailure(err.response?.data?.message || err.message));
  }
}

function* retryInquirySyncSaga({ payload }) {
  try {
    const { data } = yield call(inquiryService.retrySync, payload);
    if (data.success) {
      yield put(retryInquirySyncSuccess(data.data));
    }
  } catch (err) {
    yield put(retryInquirySyncFailure(err.response?.data?.message || err.message));
  }
}

export function* watchInquiry() {
  yield takeLatest(fetchInquiries.type, fetchInquiriesSaga);
  yield takeLatest(deleteInquiry.type, deleteInquirySaga);
  yield takeLatest(updateInquiryStatus.type, updateInquiryStatusSaga);
  yield takeLatest(retryInquirySync.type, retryInquirySyncSaga);
}
