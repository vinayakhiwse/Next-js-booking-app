import React from "react";
import SideNavigation from "../common/SideNavigation";

const DashboardLayout = ({ children }) => {
  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <SideNavigation />
          <div className="col-lg-9 col-md-8">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
