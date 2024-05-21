import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staticdata: "",
  faqs: "",
  articles: "",
  images: "",
};

const StaticDataSlice = createSlice({
  name: "StaticData",
  initialState,
  reducers: {
    setStaticData: (state, action) => {
      state.staticdata = action.payload;
    },
    setFaqData: (state, action) => {
      state.faqs = action.payload;
    },
    setArticlesData: (state, action) => {
      state.articles = action.payload;
    },
    setImagesData: (state, action) => {
      state.images = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStaticData, setFaqData, setArticlesData, setImagesData } =
  StaticDataSlice.actions;

export default StaticDataSlice;
