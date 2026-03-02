import { all } from 'redux-saga/effects';
import { watchProperty }    from './sagas/propertySaga';
import { watchTestimonial } from './sagas/testimonialSaga';
import { watchPartner }     from './sagas/partnerSaga';
import { watchCategory }    from './sagas/categorySaga';
import { watchAbout }       from './sagas/aboutSaga';
import { watchContact }     from './sagas/contactSaga';
import { watchInquiry }     from './sagas/inquirySaga';

export default function* rootSaga() {
  yield all([
    watchProperty(),
    watchTestimonial(),
    watchPartner(),
    watchCategory(),
    watchAbout(),
    watchContact(),
    watchInquiry(),
  ]);
}
