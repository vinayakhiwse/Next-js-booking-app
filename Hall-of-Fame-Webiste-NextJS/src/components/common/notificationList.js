import useTranslation from "@/hooks/useTranslation";
import moment from "moment";
import React from "react";
import { Rings } from "react-loader-spinner";

function NotificationList({
  notificationData,
  loading,
  handleNotificationType,
}) {
  const { t } = useTranslation();
  return (
    <>
      {loading ? (
        <Rings
          height="120"
          width="120"
          color="#C2C0D5"
          radius="6"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          wrapperClass=""
          visible={loading}
          ariaLabel="rings-loading"
        />
      ) : notificationData?.length > 0 ? (
        notificationData?.map((item, i) => (
          <div
            className="notificatopn-page"
            key={i}
            onClick={() => handleNotificationType(item?.type, item?.id)}
          >
            <div className="row">
              <div className="col-12">
                <div className="notify-cover">
                  <div className="notification-box">
                    <div className="d-flex w-100 d-flex align-items-center justify-content-between">
                      <div className="img-box">
                        <img
                          src={item?.image}
                          alt="img"
                          className="img-fluid"
                        />
                      </div>
                      <div className="text-content w-100">
                        <div className="order-no">
                          <span className="noti-book-tittke">
                            <span className="noti-book-tittke">
                              {item?.title}
                            </span>
                          </span>
                        </div>
                        <div className="text-right-absol">
                          <button className="time-del btn-style-none p-0">
                            <i className="fas fa-times notif-close"></i>
                          </button>
                          <div className="time-noti">
                            {moment.unix(item?.date_time?.seconds).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="celebrity">
                      {t("Service")}:<span> {item?.name}</span>
                    </p>

                    <div className="des">
                      <p className="mb-0">
                        {/* Your quotation <span>Quotation No- #670VF4</span>
                    has been been placed for adshoot with Brijesh */}
                        {item?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-danger" style={{ marginTop: "10px" }}>
          Notification not Found
        </div>
      )}
    </>
  );
}

export default NotificationList;
