import { call, put, takeLatest } from 'redux-saga/effects';
import { partnerService } from '../../services/api';
import {
  fetchPartners, fetchPartnersSuccess, fetchPartnersFailure,
  addPartner, addPartnerSuccess, addPartnerFailure,
  deletePartner, deletePartnerSuccess, deletePartnerFailure,
} from '../slices/partnerSlice';

function* fetchPartnersSaga() {
  try {
    const { data } = yield call(partnerService.getPartners);
    if (data.success) {
      yield put(fetchPartnersSuccess(data.data));
    }
  } catch (err) {
    yield put(fetchPartnersFailure(err.message));
  }
}

function* addPartnerSaga({ payload }) {
  try {
    const { data } = yield call(partnerService.addPartner, payload);
    if (data.success) {
      yield put(addPartnerSuccess());
      yield put(fetchPartners());
    }
  } catch (err) {
    yield put(addPartnerFailure(err.response?.data?.message || err.message));
  }
}

function* deletePartnerSaga({ payload }) {
  try {
    yield call(partnerService.deletePartner, payload);
    yield put(deletePartnerSuccess(payload));
  } catch (err) {
    yield put(deletePartnerFailure(err.response?.data?.message || err.message));
  }
}

export function* watchPartner() {
  yield takeLatest(fetchPartners.type, fetchPartnersSaga);
  yield takeLatest(addPartner.type, addPartnerSaga);
  yield takeLatest(deletePartner.type, deletePartnerSaga);
}
