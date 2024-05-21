import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressListModel from "../common/AddressListModel";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toast.utils";
import CustomToastContainer from "../common/CustomToastContainer";
import { setCouponValue } from "@/redux/reducers/Coupon";
import { ThreeDots } from "react-loader-spinner";
import { RxCrossCircled } from "react-icons/rx";
import { Tooltip } from "react-tooltip";
const CheckoutView = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { booking_Detail } = useSelector((state) => state.BookingDetails);
  const [BookingData, setBookingData] = useState({});
  const { AuthId } = useSelector((state) => state.AuthData);
  const [modalShow, setModalShow] = useState(false);
  const [Total, setTotal] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const dispatch = useDispatch();
  const { CouponPrice } = useSelector((state) => state.CouponValue);
  const { vat } = useSelector((state) => state.SiteData.staticdata);
  const [loading, setLoading] = useState(false);
  const fetchCelebrityName = async () => {
    try {
      const docRef = doc(db, "Service", router.query.id_type[0]);
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        if (data.celebrity_user) {
          data.celebrity_user = (await getDoc(data?.celebrity_user)).data();
        }
        setBookingData({
          image: data?.image[0],
          uid: data?.celebrity_user?.uid,
          name: data?.name,
          display_name: data?.celebrity_user?.display_name,
          photo_url: data?.celebrity_user?.photo_url,
          price: data?.price,
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("fetching Celebrity name", error);
    }
  };

  const FetchAddressData = () => {
    try {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "User", AuthId, "Address"),
          where("isDefault", "==", true)
        ),
        (snapshot) => {
          snapshot.docs.map((doc) => {
            const dataDoc = doc.data();
            setDefaultAddress({
              id: doc.id,
              name: dataDoc?.name,
              address: dataDoc?.address,
              phno: dataDoc?.phno,
            });
          });
        }
      );
      // Remember to return the unsubscribe function if you need to stop listening for changes.
      return unsubscribe;
    } catch (error) {
      console.log("fetching default address data", error);
    }
  };

  const fetchUser = async () => {
    try {
      const docRef = doc(db, "User", AuthId);
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        setUserDetail({ email: data?.email, display_name: data?.display_name });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("fetching UserDefault address", error);
    }
  };
  var no_of_slot = parseInt(booking_Detail.no_of_slot);
  var price = parseFloat(booking_Detail.actualAmount);
  var total = no_of_slot * price;
  var tax = (Number(vat) / 100) * total;

  useEffect(() => {
    if (booking_Detail && BookingData) {
      setTotal(total + tax);
    }
  }, [booking_Detail, BookingData]);

  const handleDeleteAddress = async (id) => {
    try {
      const AddressRef = collection(db, "User", AuthId, "Address");
      await deleteDoc(doc(AddressRef, id)).then(() => {
        toast.success(`${t("Address Deleted SuccessFully!")}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCelebrityName();
    FetchAddressData();
  }, []);

  const firstTime = booking_Detail?.slots[0]?.times[0];
  const lastTime =
    booking_Detail?.slots[0]?.times?.[booking_Detail.slots[0].times.length - 1];

  const handleEditAddress = () => {
    router.push("/dashboard/addresses");
  };

  const formik = useFormik({
    initialValues: {
      couponCode: "",
    },
    onSubmit: async (value) => {
      const enteredCouponCode = value.couponCode;

      const querySnapshot = await getDocs(collection(db, "Coupons"));
      const coupons = querySnapshot.docs.map((doc) => {
        const dataDoc = doc.data();
        return {
          docId: doc.id,
          couponCode: dataDoc?.couponCode,
          couponType: dataDoc?.couponType,
          expiryDate: dataDoc?.expiryDate,
          discount: dataDoc?.discount,
        };
      });

      const matchedCoupon = coupons.find(
        (coupon) => coupon.couponCode === enteredCouponCode
      );
      if (matchedCoupon) {
        const currentDate = moment().unix();
        if (matchedCoupon.expiryDate.seconds < currentDate) {
          toast.error(`${t("Coupon has expired.")}`, toastConfig.error);
          return;
        } else {
          if (matchedCoupon.discount) {
            let ActualCouponAmount =
              (total * Number(matchedCoupon.discount)) / 100;
            setTotal(
              tax + total - (total * Number(matchedCoupon.discount)) / 100
            );
            formik.setFieldValue("couponCode", "");
            dispatch(
              setCouponValue({
                Couponprice: matchedCoupon.discount,
                CouponAmount: ActualCouponAmount,
              })
            );

            toast.success(
              `${t("Offer applied successfully.")}`,
              toastConfig.success
            );
            return;
          }
        }
      } else {
        toast.error(`${t("Invalid coupon code.")}`, toastConfig.error);
        return;
      }
    },
  });

  const handleBookingDetails = async () => {
    try {
      setLoading(true);
      const UserRef = doc(db, "User", AuthId);
      const BookingRef = doc(db, "User", AuthId, "Address", defaultAddress?.id);
      const docRef = doc(db, "Service", router.query.id_type[0]);
      const CelebrityRef = doc(db, "User", BookingData.uid);
      addDoc(collection(db, "Booking"), {
        booking_date: serverTimestamp(),
        slots: booking_Detail?.slots,
        notes: booking_Detail?.notes,
        user: UserRef,
        booking_address: BookingRef,
        service: docRef,
        celebrity: CelebrityRef,
        booking_id: booking_Detail?.booking_id,
        status: "Pending",
        phno: defaultAddress?.phno,
        email: userDetail?.email,
        name: userDetail?.display_name,
        total_price: Total,
        payment_method: "Paypal",
        no_of_slot: booking_Detail?.no_of_slot,
        slot_date: booking_Detail?.slot_date,
        vat: vat,
        discount: CouponPrice?.Couponprice ? CouponPrice?.Couponprice : "",
        discountAmount: CouponPrice?.CouponAmount
          ? CouponPrice?.CouponAmount
          : "",
        ServiceTotal: total,
      }).then(async (res) => {
        try {
          const NotifyRef = doc(collection(db, "Notification"));
          await setDoc(NotifyRef, {
            date_time: serverTimestamp(),
            booking_id: booking_Detail?.booking_id,
            description: `Your Booking No - ${booking_Detail?.booking_id} has been requested for ${BookingData?.name} with ${BookingData?.display_name}`,
            isRead: false,
            image: BookingData?.image,
            status: "Pending",
            title: `You Have New Booking Request of ${BookingData?.name}`,
            type: "Booking",
            send_from: doc(db, "User", AuthId),
            send_to: doc(db, "User", BookingData.uid),
            booking_Ref: doc(db, "Booking", res.id),
          });
        } catch (error) {
          console.log("Adding notification document", error);
        }
      });
      setTimeout(() => {
        setLoading(false);
        dispatch(setCouponValue(""));
        router.push("/dashboard/bookings", "/dashboard/bookings", {
          locale: router?.locale,
        });
      }, 1000);
    } catch (error) {
      console.log("Adding document", error);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(setCouponValue(""));
    setTotal(tax + total);
  };

  return (
    <>
      <div className="checkout-container">
        <div className="address-checkout">
          <div className="add-address">
            <h3>{t("Address")}</h3>
            <a
              id="show-listing"
              onClick={() => setModalShow(true)}
              style={{ cursor: "pointer" }}
            >
              {t("Select Address")}
            </a>
          </div>
          <img src="assets/loading.gif" alt="" className="loading-gif d-none" />
          <div id="default-address-container">
            <div className="home-add">
              <label className="custom-radio home-cr">
                {defaultAddress?.name}
                <br />
                <p className="address">{defaultAddress?.address}</p>
                <span className="add-num">
                  {defaultAddress?.phno}
                  <span>
                    <span
                      id="delete-address"
                      className="delete-link"
                      onClick={() => handleDeleteAddress(defaultAddress?.id)}
                    >
                      {t("Delete")}
                    </span>
                    |
                    <span
                      className="edit-link"
                      id="edit-address"
                      onClick={handleEditAddress}
                    >
                      {t("Edit")}
                    </span>
                  </span>
                </span>
                <input
                  type="radio"
                  name="make-default"
                  value="1"
                  checked={true}
                />
                <span className="checkmark home-checkmark"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="payment-checkout">
          <div className="add-payment">
            <h3>{t("Payment Method")}</h3>
          </div>
          <div className="credit-add">
            <label className="custom-radio credit-cr">
              {t("Credit Card")}
              <input
                name="payment_method"
                className="payment_method"
                type="radio"
                value="credit_card"
                checked={true}
              />
              <span className="checkmark credit-checkmark"></span>
            </label>
          </div>
        </div>

        <div className="date-checkout">
          <div className="add-date">
            <h3>{t("Date & Time")}</h3>
          </div>
          <p className="date">
            {t("Booked Date")}:<span>{booking_Detail?.slot_date}</span>
          </p>
          <p className="date">
            {t("Booked Time")}:
            <span>
              {firstTime}-{lastTime}
            </span>
          </p>
        </div>

        <div className="service-checkout">
          <div className="add-service">
            <h3>{t("Booked Service")}</h3>
          </div>
          <div className="qservices">
            <div className="service-imgs">
              <img src={BookingData.photo_url} alt="service-img" />
            </div>

            <div className="service-details">
              <p className="service-name">
                {t("Celebrity Name")}:<span> {BookingData?.display_name}</span>
              </p>
              <p className="podcast">
                {t("Service Name")}:<span> {BookingData?.name}</span>
              </p>
              <p className="price">
                {t("Price")}:
                <span>
                  {" "}
                  SAR{booking_Detail?.actualAmount}
                  <span>/hr</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="note-checkout">
          <div className="add-note">
            <h3>{t("Booking Note")}</h3>
          </div>
          <p className="note">{booking_Detail?.notes}</p>
        </div>

        <div className="summary-checkout">
          <div className="add-summary">
            <h3>{t("Booking Summary")}</h3>
          </div>
          <div className="summaries">
            <p className="summ">
              {t("Booking Fee")}:<span>SAR {no_of_slot * price}</span>
            </p>
            <p className="summ" id="vat-t">
              {t("VAT")}:{" "}
              <span>
                {Number(vat)}% (
                {(
                  Number(no_of_slot) *
                  Number(price) *
                  (Number(vat) / 100)
                ).toFixed(2)}{" "}
                SAR)
              </span>
            </p>

            <form id="coupon-form" onSubmit={formik.handleSubmit}>
              {CouponPrice?.Couponprice ? (
                <p className="summ" id="vat-t">
                  {t("Coupon Price")}:{" "}
                  <span style={{ color: "green" }}>
                    {CouponPrice?.Couponprice}% ({CouponPrice?.CouponAmount}{" "}
                    SAR){" "}
                    <span
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Remove Coupon"
                      style={{ marginLeft: "2px" }}
                    >
                      <RxCrossCircled onClick={handleRemoveCoupon} />
                    </span>
                  </span>
                </p>
              ) : null}
              {CouponPrice?.Couponprice ? null : (
                <div className="input-style coupon-code">
                  <label htmlFor="first-box">{t("Coupon Code")}</label>
                  <div className="apply-code">
                    <input
                      type="text"
                      className="ctm-input"
                      id="coupon-code"
                      name="couponCode"
                      placeholder={t("Code")}
                      required
                      onChange={formik.handleChange}
                      value={formik.values.couponCode}
                    />
                    <button
                      type="submit"
                      id="apply-coupon"
                      className="btn btn-primary w-100 apply-btn"
                      tabIndex="0"
                    >
                      {/* <span id="loading">
                            <i className="fa fa-spinner fa-spin"></i>
                          </span> */}
                      {t("Apply")}
                    </button>
                  </div>
                  {/* <div
                  id="coupon-code-error"
                  className="error"
                  htmlFor="coupon-code"
                >
                  This field is required.
                </div> */}
                </div>
              )}
            </form>
          </div>
          <p className="total">
            {t("Total")}
            <span>
              SAR <span id="booking-totl">{Total}</span>
            </span>
          </p>
        </div>
        <button
          onClick={handleBookingDetails}
          className="btn btn-primary pay-btn w-100"
          tabIndex="0"
          disabled={loading}
        >
          {loading ? (
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
            `${t("Pay Now")}`
          )}
        </button>
      </div>
      <AddressListModel
        show={modalShow}
        setAddress={setDefaultAddress}
        onHide={() => setModalShow(false)}
      />
      <CustomToastContainer />
      <Tooltip id="my-tooltip" style={{ fontSize: "12px" }} />;
    </>
  );
};

export default CheckoutView;
