import CustomToastContainer from "@/components/common/CustomToastContainer";
import Ratings from "@/components/common/Ratings";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import { toastConfig } from "@/utils/toast.utils";
import CancelModel from "@/views/models/CancelModel";
import CelebrityRatingModel from "@/views/models/CelebrityRatingModel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import generateInvoice from "../../../../public/invoiceTemplate/invoice";
import { useSelector } from "react-redux";
import { Rings, ThreeDots } from "react-loader-spinner";
const BookingDetail = () => {
  const {
    query: { bookingId },
  } = useRouter();
  const [BookingInfo, setBookingInfo] = useState();
  const [CancelModelView, setCancelModelView] = useState({
    show: false,
    id: null,
    type: null,
  });
  const { AuthId } = useSelector((state) => state.AuthData);
  const [RatingModel, setRatingModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [UserBookinginfo, setUserBookinginfo] = useState({});
  const { booking_Detail } = useSelector((state) => state.BookingDetails);
  const fetchUserBookingDetail = async () => {
    try {
      const UserBookingDocRef = doc(db, "User", AuthId);
      const UserBookingData = (await getDoc(UserBookingDocRef)).data();
      //console.log("UserBookingData", UserBookingData);
      setUserBookinginfo(UserBookingData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const BookingDocRef = doc(db, "Booking", bookingId);
      const BookingData = (await getDoc(BookingDocRef)).data();

      if (BookingData.celebrity) {
        const celebrityInfo = (await getDoc(BookingData.celebrity)).data();
        if (celebrityInfo.category) {
          celebrityInfo.category = (
            await getDoc(celebrityInfo.category)
          ).data().name;
        }
        BookingData.celebrity = celebrityInfo;
      }
      if (BookingData.service) {
        BookingData.service = (await getDoc(BookingData.service)).data();
      }
      if (BookingData.booking_address) {
        BookingData.booking_address = (
          await getDoc(BookingData.booking_address)
        ).data();
      }

      setBookingInfo(BookingData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelOrder = () => {
    const BookingDocRef = doc(db, "Booking", bookingId);
    updateDoc(BookingDocRef, {
      status: "Cancelled",
    }).then(() => {
      toast.success(
        `${t("Your Booking Cancelled Successfully")}`,
        toastConfig.success
      );
      setCancelModelView({
        show: false,
        id: null,
        type: null,
      });
    });
  };

  useEffect(() => {
    fetchBookingDetail();
    fetchUserBookingDetail();
  }, [bookingId, CancelModelView.show]);

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
      ) : (
        BookingInfo && (
          <>
            <div className="order-detail-main-area">
              <div className="booking-det">
                <div className="celeb-number">
                  <div className="inner-wrapper-order-dt d-flex flex-column flex-lg-row justify-content-between">
                    <div className="top-tittle-area-dt">
                      <h2 className="oder-dt-cus-head">
                        {t("Booking No")} -
                        <span>#{BookingInfo.booking_id}</span>
                      </h2>
                      <h2 className="oder-dt-cus-head-2">
                        {t("Status")}:{" "}
                        <span className="span-time-head-2">
                          {BookingInfo.status}
                        </span>
                      </h2>
                      <h2 className="oder-dt-cus-head-2">
                        {t("Booked Date")}:{" "}
                        <span className="span-time-head-2">
                          {moment(BookingInfo.slot_date, "D/M/YYYY")
                            .format("MMM D, YYYY")
                            .toUpperCase()}
                        </span>
                      </h2>
                      <h2 className="oder-dt-cus-head-2">
                        {t("Booked Time")}:{" "}
                        <span className="span-time-head-2">
                          {BookingInfo.slots[0].times.at(0)} -{" "}
                          {BookingInfo.slots[0].times.at(-1)}
                        </span>
                      </h2>
                    </div>
                  </div>

                  {/* Show If Loged in user is User */}
                  <div className="custom-class-for-space-dt">
                    <div className="quote-about">
                      <h2>{t("About Celebrity")}</h2>
                      <div className="about-detail">
                        <img
                          src={BookingInfo.celebrity.photo_url}
                          alt="celeb-img"
                        />
                        <div className="celeb-ratings">
                          <Ratings total={BookingInfo.celebrity.review} />
                          <h3>
                            {BookingInfo.celebrity.display_name}{" "}
                        
                          </h3>
                          <p>{BookingInfo.celebrity.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="custom-class-for-space-dt">
                    <h2 className="dt-sub-tittle-head">
                      {t("Payment Method")}
                    </h2>
                    <h4 className="cash-delivey-pay-dt ">
                      {BookingInfo.payment_method}
                    </h4>
                  </div>

                  <div className="custom-class-for-space-dt mw-100">
                    <h2 className="dt-sub-tittle-head">{t("Address")}</h2>
                    <h4 className="cash-delivey-pay-dt">
                      {BookingInfo.booking_address.address}
                    </h4>
                    <p className="addnumber">
                      {BookingInfo.booking_address.phno}
                    </p>
                  </div>

                  <div className="service-bookings">
                    <div className="add-service">
                      <h2>{t("Service Detail")}</h2>
                    </div>
                    <div className="qservices">
                      <img
                        src={BookingInfo.service?.image[0]}
                        alt="service-img"
                      />

                      <div className="service-details">
                        <p className="podcast">
                          {t("Service Name")}:
                          <span>{BookingInfo?.service?.name}</span>
                        </p>
                        <p className="price">
                          {t("Price")}:
                          {BookingInfo?.service?.price > 0 ? (
                            <span>
                              SAR
                              {BookingInfo?.ServiceTotal /
                                BookingInfo.no_of_slot}
                              <span> {t("/ hr")}</span>
                            </span>
                          ) : (
                            <span>{t("Quotations")}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="note-checkout">
                    <div className="add-note">
                      <h2>{t("Booking Note")}</h2>
                    </div>
                    <p className="note">{BookingInfo.notes}</p>
                  </div>
                </div>

                {/* pust confition at true for check the user is user or not */}
                <div className="booking-sum">
                  <div className="book-summary">
                    <h2>{t("Booking Summary")}</h2>
                    <div className="fee">
                      <p>
                        {t("Booking Fee")}
                        <span>SAR {BookingInfo?.ServiceTotal}</span>
                      </p>
                      <p>
                        {t("No Of Slots")}{" "}
                        <span>{BookingInfo?.no_of_slot}</span>
                      </p>
                      <p>
                        {t("VAT")} <span>{BookingInfo.vat}%</span>
                      </p>
                      {/* if ($booking->discount > 0) */}
                      {BookingInfo.discount ? (
                        <p>
                          {t("Coupon Applied")}
                          <span>
                            <i className="far fa-check-circle"></i>
                            {BookingInfo?.discount}
                            {t("% Discount at SAR")} (
                            {BookingInfo?.discountAmount})
                          </span>
                        </p>
                      ) : null}

                      {/* @endif */}
                    </div>
                    <div className="total">
                      <p>
                        {t("Total")} <span>SAR {BookingInfo.total_price}</span>
                      </p>
                    </div>
                  </div>

                  {BookingInfo.status == "Pending" && (
                    <button
                      className="btn rate-btn"
                      onClick={() => {
                        setCancelModelView({
                          show: true,
                          id: BookingInfo.booking_id,
                          type: "Booking",
                        });
                      }}
                    >
                      {t("Cancel")}
                    </button>
                  )}

                  {BookingInfo.status == "Completed" && (
                    <button
                      className="btn rate-btn"
                      onClick={() => setRatingModel(true)}
                    >
                      {t("Rate Celebrity")}
                    </button>
                  )}
                  {/* <div className="invoice-dropdown"> */}
                  <button
                    className="btn rate-btn"
                    style={{ backgroundColor: "#000" }}
                  >
                    <PDFDownloadLink
                      document={generateInvoice({
                        booking_number: BookingInfo.booking_id,
                        celebrity_name: BookingInfo.celebrity.display_name,
                        subtotal:
                          BookingInfo?.ServiceTotal / BookingInfo.no_of_slot,
                        total: BookingInfo.total_price,
                        service_name: BookingInfo.service.name,
                        total_booked_slots: BookingInfo.no_of_slot,
                        booked_Time: BookingInfo.slots,
                        booked_Date: moment(BookingInfo.slot_date, "D/M/YYYY")
                          .format("MMM D, YYYY")
                          .toUpperCase(),
                        payment: BookingInfo.payment_method,
                        discount: BookingInfo.discount
                          ? BookingInfo.discount
                          : "Offer Not Applied",
                        vat: BookingInfo.vat,
                        booking_address: BookingInfo.booking_address,
                        user_name: UserBookinginfo.display_name,
                        user_email: UserBookinginfo.email,
                        user_phone_number: UserBookinginfo.phone_number
                          ? UserBookinginfo.phone_number
                          : BookingInfo.phno,
                      })}
                      fileName={`Hall_Of_Fame_${BookingInfo.booking_id}.pdf`}
                      style={{ color: "#FFF" }}
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? (
                          <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="white"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                          />
                        ) : (
                          `${t("Invoice")}`
                        )
                      }
                    </PDFDownloadLink>
                  </button>
                  {/* <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <button
                    className="dropdown-item invoice-data"
                    data-name="view_invoice"
                  >
                    <PDFViewer>
                      <generateInvoice />
                      {t("View Invoice")}
                    </PDFViewer>
                  </button>
                  <button
                    className="dropdown-item invoice-data"
                    data-name="send_invoice"
                  ></button>
                </div> */}
                </div>
              </div>
            </div>
            {/* </div> */}

            <CancelModel
              setCancelModelView={setCancelModelView}
              CancelModelView={CancelModelView}
              handleCancelOrder={handleCancelOrder}
            />

            <CelebrityRatingModel
              setRatingModel={setRatingModel}
              RatingModel={RatingModel}
              celebrityId={BookingInfo.celebrity.uid}
            />

            <CustomToastContainer />
          </>
        )
      )}
    </>
  );
};

const BookingDetailPage = () => (
  <DashboardLayout>
    <BookingDetail />
  </DashboardLayout>
);

export default BookingDetailPage;
