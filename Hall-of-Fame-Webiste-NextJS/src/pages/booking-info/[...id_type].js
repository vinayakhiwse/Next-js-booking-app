import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CheckoutView from "@/components/Booking/Checkout";
import SlotsView from "@/components/Booking/Slots";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toast.utils";
import useTranslation from "@/hooks/useTranslation";
import CustomToastContainer from "@/components/common/CustomToastContainer";
import { useDispatch, useSelector } from "react-redux";
import { bookingState } from "@/redux/reducers/booking";
import useValidationSchemas from "../validation/FormValidation.utils";

const SlotBooking = () => {
  const router = useRouter();
  const [SlotData, setSlotData] = useState([]);
  const [timeSlot, setTimeSlot] = useState({});
  const [celebrityRef, setCelebrityRef] = useState({});
  const [NotifyCelebrity, setNotifyCelebrity] = useState({});
  const [QuotationData, setQuotationData] = useState([]);
  const [BookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState({});
  const { t } = useTranslation();
  const { SlotBookingValidation } = useValidationSchemas();
  const dispatch = useDispatch();
  const { AuthId } = useSelector((state) => state.AuthData);

  const fetchCelebritySlotDetails = async () => {
    const docRef = doc(db, "Service", router.query.id_type[0]);
    try {
      setLoading(true);
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        setCelebrityRef(data.celebrity_user);
        if (data.celebrity_user) {
          data.celebrity_user = (await getDoc(data.celebrity_user)).data();
        }
        setNotifyCelebrity({
          image: data?.image[0],
          uid: data?.celebrity_user?.uid,
          display_name: data?.celebrity_user?.display_name,
          name: data?.name,
          name_ar: data?.name_ar,
        });
        setCalculation({
          price: data?.price,
          discount: data?.discount,
        });
        try {
          const UserRef = collection(
            db,
            "User",
            data.celebrity_user.uid,
            "Slots"
          );
          const UserSnapshot = await getDocs(UserRef);
          UserSnapshot.docs.map(async (doc) => {
            const slotDetail = doc.data();
            if (slotDetail.user) {
              slotDetail.user = (await getDoc(slotDetail.user)).data();
            }

            setSlotData(slotDetail);
            const DaySlot = slotDetail?.slot?.find(
              (slot) => slot.day === currentDay
            );
            BookingData.map((item) => {
              if (item.slots[0].day == currentDay) {
                DaySlot.times = DaySlot.times.filter((time) => {
                  if (!item.slots[0].times.includes(time)) {
                    return time;
                  }
                });
              }
            });
            QuotationData.map((item) => {
              if (item.slots[0].day == currentDay) {
                DaySlot.times = DaySlot.times.filter((time) => {
                  if (!item.slots[0].times.includes(time)) {
                    return time;
                  }
                });
              }
            });

            setTimeSlot(DaySlot);
            setLoading(false);
          });
        } catch (error) {
          console.log("updating docs", error);
          setLoading(false);
        }
      } else {
        console.log("No such document!");
        setLoading(false);
      }
    } catch (error) {
      console.log("fetching celebrity slot", error);
      setLoading(false);
    }
  };

  const discountAmount = (calculation?.price * calculation?.discount) / 100; // Calculate the discount amount
  const updatedAmount = calculation?.price - discountAmount; // Calculate the updated amount

  const fetchQuotationData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Quotation"));
      querySnapshot.docs.map(async (doc) => {
        const dataDoc = doc.data();
        setQuotationData((prev) => [
          ...prev,
          {
            slot_date: dataDoc?.slot_date,
            slots: dataDoc?.slots,
          },
        ]);
        setLoading(false);
      });
    } catch (error) {
      console.log("fetchQuotationData", error);
      setLoading(false);
    }
  };

  const fetchBookingData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Booking"));
      querySnapshot.docs.map(async (doc) => {
        const dataDoc = doc.data();
        setBookingData((prev) => [
          ...prev,
          {
            slot_date: dataDoc?.slot_date,
            slots: dataDoc?.slots,
          },
        ]);
      });
    } catch (error) {
      console.log("fetchBookingData", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
    fetchQuotationData();
    fetchCelebritySlotDetails();
  }, []);

  let Booking_Id =
    Math.floor(Math.random() * (999999 - 100000 + 1) + 100000) + "";
  let quotation_Id =
    Math.floor(Math.random() * (999999 - 100000 + 1) + 100000) + "";

  const formik = useFormik({
    initialValues: {
      booking_Date: "",
      bookingSlots: [],
      bookingNotes: "",
    },
    validationSchema: SlotBookingValidation,
    onSubmit: async (values) => {
      const docRef = doc(db, "Service", router.query.id_type[0]);
      if (router.query.id_type[1] == "booking") {
        dispatch(
          bookingState({
            slot_date: moment(values.booking_Date).format("DD/MM/YYYY"),
            notes: values.bookingNotes,
            no_of_slot: values.bookingSlots[0].times.length,
            slots: values.bookingSlots,
            discountAmount: discountAmount,
            actualAmount: updatedAmount,
            booking_id: Booking_Id,
            discount: calculation?.discount,
          })
        );
        router.push(`${router.asPath}/checkout`);
      } else {
        try {
          addDoc(collection(db, "Quotation"), {
            booking_date: values.booking_Date,
            slots: values.bookingSlots,
            notes: values.bookingNotes,
            user: doc(db, "User", AuthId),
            service: docRef,
            celebrity: celebrityRef,
            status: "Pending",
            phno: SlotData?.user?.phone_number,
            email: SlotData?.user?.email,
            name: SlotData?.user?.display_name,
            no_of_slot: values.bookingSlots[0].times.length,
            slot_date: moment(values.booking_Date).format("DD/MM/YYYY"),
            quotation_id: quotation_Id,
          }).then(async (res) => {
            try {
              const NotifyRef = doc(collection(db, "Notification"));
              await setDoc(NotifyRef, {
                date_time: serverTimestamp(),
                booking_id: quotation_Id,
                description: `Your Quotations No - ${quotation_Id} has been requested for ${NotifyCelebrity.name} with ${NotifyCelebrity.display_name}`,
                isRead: false,
                status: "Pending",
                image: NotifyCelebrity.image,
                title: `You Have New Quotations Request of ${NotifyCelebrity.name}`,
                type: "Quotation",
                send_from: doc(db, "User", AuthId),
                send_to: doc(db, "User", NotifyCelebrity?.uid),
                quotation_ref: doc(db, "Quotation", res.id),
              });
            } catch (error) {
              console.log("Adding notification document", error);
            }
          });
          router.push("/dashboard/quotations", "/dashboard/quotations", {
            locale: router?.locale,
          });
        } catch (error) {
          console.log("Adding quatation document", error);
        }
      }
    },
  });

  // Get the current day dynamically
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  var currentDaySlot;
  const handleDateSelect = (date) => {
    const options = { weekday: "short" };
    const selectedDay = date.toLocaleDateString("en-US", options);
    formik.setFieldValue("bookingSlots", []);
    formik.setFieldValue("booking_Date", date);
    const selectedDate = moment(date).format("DD/MM/YYYY");
    let day = moment(date).format("ddd");

    currentDaySlot = SlotData?.slot?.find((slot) => slot.day === selectedDay);

    if (currentDaySlot) {
      QuotationData.map((item) => {
        if (item.slot_date == selectedDate) {
          currentDaySlot.times = currentDaySlot?.times.filter((time) => {
            if (!item.slots[0].times.includes(time)) {
              return time;
            }
          });
        }
      });
      BookingData.map((item) => {
        if (item.slot_date == selectedDate) {
          currentDaySlot.times = currentDaySlot.times.filter((time) => {
            if (!item.slots[0].times.includes(time)) {
              return time;
            }
          });
        }
      });
    }

    setTimeSlot(currentDaySlot);
  };

  // Function to handle selecting a time slot
  const selectTimeSlot = (day, time) => {
    const { bookingSlots } = formik.values;
    const updatedSlots = [...bookingSlots];
    const selectedDate = moment(formik.values.booking_Date).format(
      "DD/MM/YYYY"
    );

    let quotationSlot = QuotationData.find(
      (item) => item.slot_date === selectedDate
    );
    let BookingSlot = BookingData.find(
      (item) => item.slot_date === selectedDate
    );

    if (quotationSlot || BookingSlot) {
      const slots = quotationSlot?.slots;
      const BookingSlots = BookingSlot?.slots;
      const matchingSlot = slots?.find(
        (slot) => slot.day === day && slot.times.includes(time)
      );
      const matchingBookingSlot = BookingSlots?.find(
        (slot) => slot.day === day && slot.times.includes(time)
      );
      if (matchingSlot || matchingBookingSlot) {
        toast.error(
          `${t("Slot already booked. Please select another slot.")}`,
          toastConfig.error
        );
        return;
      } else if (
        updatedSlots.some(
          (slot) => slot.day === day && slot.times.includes(time)
        )
      ) {
        // Remove the time slot if already selected
        updatedSlots.forEach((slot) => {
          if (slot.day === day && slot.times.includes(time)) {
            slot.times.splice(slot.times.indexOf(time), 1);
          }
        });
      } else {
        // Add the time slot if not selected
        const existingSlotIndex = updatedSlots.findIndex(
          (slot) => slot.day === day
        );
        if (existingSlotIndex !== -1) {
          updatedSlots[existingSlotIndex].times.push(time);
        } else {
          updatedSlots.push({ day, times: [time] });
        }
      }
    } else {
      let isDayPresent = false;
      for (let i = 0; i < updatedSlots.length; i++) {
        if (updatedSlots[i].day === day) {
          // Day already exists, check for duplicate time slots
          if (updatedSlots[i].times.includes(time)) {
            updatedSlots[i].times = updatedSlots[i].times.filter(
              (t) => t !== time
            );
            return;
          }
          updatedSlots[i].times.push(time);
          isDayPresent = true;
          break;
        }
      }
      if (!isDayPresent) {
        // Day doesn't exist, create a new entry
        updatedSlots.push({ day, times: [time] });
      }
    }

    formik.setFieldValue("bookingSlots", updatedSlots);
  };

  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          {router.query?.id_type && !router.query?.id_type[2] && (
            <SlotsView
              handleDateSelect={handleDateSelect}
              currentDaySlot={timeSlot}
              selectTimeSlot={selectTimeSlot}
              formik={formik}
              loading={loading}
            />
          )}

          {router.query?.id_type && router.query?.id_type[2] == "checkout" && (
            <CheckoutView />
          )}
        </div>
      </div>
      <CustomToastContainer />
    </section>
  );
};

export default SlotBooking;
