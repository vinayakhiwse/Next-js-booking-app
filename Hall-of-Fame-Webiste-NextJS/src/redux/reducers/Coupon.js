import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  CouponPrice: "",
};

const CouponPriceSlice = createSlice({
  name: "Coupon",
  initialState,
  reducers: {
    setCouponValue: (state, action) => {
      state.CouponPrice = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCouponValue } = CouponPriceSlice.actions;

export default CouponPriceSlice;
