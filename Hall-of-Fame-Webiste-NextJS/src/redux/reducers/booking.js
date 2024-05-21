const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  booking_Detail: "",
};

const BookingSlice = createSlice({
  name: "BookingData",
  initialState,
  reducers: {
    bookingState: (state, action) => {
      state.booking_Detail = action.payload;
    },
  },
});

export const { bookingState } = BookingSlice.actions;
export default BookingSlice;
