import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import propertyReducer    from './slices/propertySlice';
import testimonialReducer from './slices/testimonialSlice';
import partnerReducer     from './slices/partnerSlice';
import categoryReducer    from './slices/categorySlice';
import aboutReducer       from './slices/aboutSlice';
import contactReducer     from './slices/contactSlice';
import inquiryReducer     from './slices/inquirySlice';
import rootSaga           from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    property:    propertyReducer,
    testimonial: testimonialReducer,
    partner:     partnerReducer,
    category:    categoryReducer,
    about:       aboutReducer,
    contact:     contactReducer,
    inquiry:     inquiryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
