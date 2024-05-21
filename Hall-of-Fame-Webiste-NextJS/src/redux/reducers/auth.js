import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  AuthId: "",
  UserType: "",
};

const AuthDataSlice = createSlice({
  name: "AuthData",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.AuthId = action.payload;
    },
    setUserType: (state, action) => {
      state.UserType = action.payload;
    },
    resetState: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { setAuthData, resetState, setUserType } = AuthDataSlice.actions;

export default AuthDataSlice;
