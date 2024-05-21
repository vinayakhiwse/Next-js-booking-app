import CustomToastContainer from "@/components/common/CustomToastContainer";
import Ratings from "@/components/common/Ratings";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import { toastConfig } from "@/utils/toast.utils";
import CancelModel from "@/views/models/CancelModel";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const QuotationDetail = () => {
  const {
    query: { quotationId },
  } = useRouter();
  const [QuotationInfo, setQuotationInfo] = useState();
  const [CancelModelView, setCancelModelView] = useState({
    show: false,
    id: null,
    type: null,
  });
  const { t } = useTranslation();
  const handleCancelOrder = () => {
    const QuotationDocRef = doc(db, "Quotation", quotationId);
    updateDoc(QuotationDocRef, {
      status: "Cancelled",
    }).then(() => {
      toast.success(
        `${t("Your Quotation Cancelled Successfully")}`,
        toastConfig.success
      );
      setCancelModelView({
        show: false,
        id: null,
        type: null,
      });
    });
  };

  const fetchQuotationDetail = async () => {
    const QuotationDocRef = doc(db, "Quotation", quotationId);
    const QuotationData = (await getDoc(QuotationDocRef)).data();

    if (QuotationData.celebrity) {
      const celebrityInfo = (await getDoc(QuotationData.celebrity)).data();
      if (celebrityInfo.category) {
        celebrityInfo.category = (
          await getDoc(celebrityInfo.category)
        ).data().name;
      }
      QuotationData.celebrity = celebrityInfo;
    }
    if (QuotationData.service) {
      QuotationData.service = (await getDoc(QuotationData.service)).data();
    }
    setQuotationInfo(QuotationData);
  };

  useEffect(() => {
    fetchQuotationDetail();
  }, [quotationId, CancelModelView.show]);

  return (
    QuotationInfo && (
      <>
        <div className="order-page-tabs">
          <div className="col-lg-9 col-md-8 px-0">
            <div className="order-detail-main-area quote-detail-container">
              <div className="booking-det">
                <div className="celeb-number">
                  <div className="inner-wrapper-order-dt d-flex flex-column flex-lg-row justify-content-between">
                    <div className="top-tittle-area-dt w-100">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <h2 className="oder-dt-cus-head mb-1">
                          {t("Quotation ID")} -{" "}
                          <span>#{QuotationInfo.quotation_id}</span>
                        </h2>
                        {QuotationInfo.QuotedPrice > 0 && (
                          <p
                            className="quot-price"
                            style={{
                              color: "#999999",
                              fontSize: "1.6rem",
                              marginBottom: "0.6rem",
                            }}
                          >
                            {t("Quoted Price")}:
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                color: "#000000",
                                fontWeight: 600,
                              }}
                            >
                              SAR{QuotationInfo?.QuotedPrice}
                            </span>
                          </p>
                        )}
                      </div>
                      <h2 className="oder-dt-cus-head-2 mb-1">
                        {t("Status")}:
                        <span className="span-time-head-2">
                          {QuotationInfo.status}
                        </span>
                      </h2>
                      <h2 className="oder-dt-cus-head-2 mb-1">
                        {t("Booked Date")}:
                        <span className="span-time-head-2">
                          {moment(QuotationInfo.slot_date, "D/M/YYYY")
                            .format("MMM D, YYYY")
                            .toUpperCase()}
                        </span>
                      </h2>
                      <h2 className="oder-dt-cus-head-2 mb-1">
                        {t("Booked Time")}:
                        <span className="span-time-head-2">
                          {QuotationInfo.slots[0].times.at(0)} -{" "}
                          {QuotationInfo.slots[0].times.at(-1)}
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div className="custom-class-for-space-dt">
                    <div className="quote-about">
                      <h2>{t("About Celebrity")}</h2>
                      <div className="about-detail">
                        <img
                          src={QuotationInfo.celebrity.photo_url}
                          alt="celeb-img"
                        />
                        <div className="celeb-ratings">
                          <div className="star-rating-area">
                            <Ratings total={QuotationInfo.celebrity.review} />
                          </div>
                          <h3>{QuotationInfo.celebrity.display_name}</h3>
                          <p>{QuotationInfo.celebrity.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="service-bookings">
                <div className="add-service">
                  <h2>{t("Service Detail")}</h2>
                </div>
                <div className="qservices">
                  <img src={QuotationInfo.service.image[0]} alt="service-img" />
                  <div className="service-details">
                    <p className="podcast quote-podcast">
                      {t("Service Name")}:
                      <span>{QuotationInfo.service.name}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="note-checkout">
                <div className="add-note">
                  <h2>{t("Quotation Note")}</h2>
                </div>
                <p className="note">{QuotationInfo.notes}</p>
              </div>

              {QuotationInfo.status == "Accepted" && (
                <>
                  <a
                    href="/payment"
                    className="btn btn-primary pay-btn w-100"
                    tabIndex={0}
                  >
                    {t("Pay Now")}
                  </a>
                  <div
                    className="btn cancel-btn"
                    onClick={() => {
                      setCancelModelView({
                        show: true,
                        id: QuotationInfo.quotation_id,
                        type: "Quotation",
                      });
                    }}
                  >
                    {t("Cancel")}
                  </div>
                </>
              )}

              {QuotationInfo.status === "Pending" && (
                <>
                  <div
                    className="btn cancel-btn"
                    onClick={() => {
                      setCancelModelView({
                        show: true,
                        id: QuotationInfo.quotation_id,
                        type: "Quotation",
                      });
                    }}
                  >
                    {t("Cancel")}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <CancelModel
          CancelModelView={CancelModelView}
          setCancelModelView={setCancelModelView}
          handleCancelOrder={handleCancelOrder}
        />

        <CustomToastContainer />
      </>
    )
  );
};

const QuotationDetailPage = () => (
  <DashboardLayout>
    <QuotationDetail />
  </DashboardLayout>
);

export default QuotationDetailPage;
