import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const { staticdata } = useSelector((state) => state.SiteData);

  return (
    staticdata && (
      <>
        <Header />
        {children}
        <Footer />
      </>
    )
  );
};

export default Layout;
