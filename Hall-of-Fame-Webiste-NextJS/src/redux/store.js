import { combineReducers, configureStore } from "@reduxjs/toolkit";
import StaticDataSlice from "./reducers/staticData";
import AuthDataSlice from "./reducers/auth";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import expireReducer from "redux-persist-expire";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import BookingSlice from "./reducers/booking";
import CouponPriceSlice from "./reducers/Coupon";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["AuthData", "BookingDetails", "CouponValue"],
  transforms: [
    expireReducer("AuthData", {
      expireSeconds: 86400,
      expiredState: {
        AuthId: "",
      },
      autoExpire: true,
    }),
  ],
};

const rootReducer = combineReducers({
  SiteData: StaticDataSlice.reducer,
  AuthData: AuthDataSlice.reducer,
  BookingDetails: BookingSlice.reducer,
  CouponValue: CouponPriceSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
