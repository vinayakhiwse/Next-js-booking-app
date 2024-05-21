import useTranslation from "@/hooks/useTranslation";
import React from "react";

const UserDetail = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div className="user-profile-iyt d-flex flex-column flex-md-row">
      <div className="profile-img-mt d-flex align-items-center justify-content-center">
        <div className="profiles">
          <img src={data?.photo_url} className="img-fluid" alt="" />
        </div>
      </div>
      <div className="user-profile-detail-mt">
        <div className="top-pro-tittlee d-flex align-items-center justify-content-between">
          <h3 className="title">{data?.display_name}</h3>
        </div>
        <span className="line-sep-pro"></span>
        <div className="two-wraper-div mt-1 ">
          <div className="inner-wrap-2">
            <p className="addres">
              <i className="fas fa-phone-alt"></i>
              <span className="use-widt-pro">{t("Phone")}:</span>
              <a href={`tel:${data?.phone_number}`} dir="ltr">
                {data?.phone_number}
              </a>
            </p>
          </div>
          <div className="inner-wrap">
            <h6 className="pro-email">
              <i className="fas fa-envelope"></i>
              <span className="use-widt-pro">{t("Email")}:</span>
              <a href={`mailto:${data?.email}`}>{data?.email}</a>
            </h6>
          </div>
          <div className="inner-wrap">
            <h6 className="pro-email">
              <i className="fas fa-map-marker-alt"></i>
              <span className="use-widt-pro">{t("Address")}:</span>
              <a>{data?.address}</a>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
