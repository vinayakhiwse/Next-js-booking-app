import { SlotSettings } from "@/utils/slider_setting.utils";
import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useTranslation from "@/hooks/useTranslation";
import { Rings } from "react-loader-spinner";

const SlotsView = ({
  handleDateSelect,
  currentDaySlot,
  selectTimeSlot,
  formik,
  loading,
}) => {
  const SlotsliderRef = useRef(null);
  const { t } = useTranslation();
  let isDisabled;
  currentDaySlot?.times?.map((time, timeIndex) => {
    const isTimeSlotSelected = formik.values.bookingSlots.some(
      (slot) => slot.day === currentDaySlot.day && slot.times.includes(time)
    );
    isDisabled = isTimeSlotSelected ? "unavailable disabled" : "unavailable";
  });

  return (
    <div className="col-lg-6 mx-auto time-cont">
      <form onSubmit={formik.handleSubmit}>
        <div className="manage-visit-request-area-main">
          <div className="row">
            <div className="col-md-12">
              <div className="avail-tittle-tabs">
                {t("Select Date")}
                <span>*</span>
              </div>
              <div className="add-stadium-ma-area-tabs check-out-page-radio-main">
                <div className="days-slide-container">
                  {formik.errors.booking_Date &&
                    formik.touched.booking_Date && (
                      <span className="input-error mt-3">
                        {formik.errors.booking_Date}
                      </span>
                    )}
                  <Slider
                    {...SlotSettings(SlotsliderRef)}
                    ref={SlotsliderRef}
                    className="main-timing-schedule date-slider mb-3"
                  >
                    {[...Array(30)].map((_, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() + index);

                      return (
                        <>
                          <div
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            className="check-page-2-box slick-cloned"
                          >
                            <label className="container">
                              <input
                                type="radio"
                                name="booking_Date"
                                tabIndex="-1"
                              />
                              <span className="checkmark">
                                {date.toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </label>
                          </div>
                        </>
                      );
                    })}
                  </Slider>

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
                    <>
                      <div className="bottom-timimg-tabss-main">
                        <p className="slct">
                          {t("Select One Or More Consecutive Time Slots")}
                          <span>*</span>
                        </p>{" "}
                        {formik.errors.bookingSlots &&
                          formik.touched.bookingSlots && (
                            <span className="input-error mt-1">
                              {formik.errors.bookingSlots}
                            </span>
                          )}
                        {currentDaySlot?.times?.length ? (
                          <div style={{ display: "flex", flexWrap: "inherit" }}>
                            {currentDaySlot?.times?.map((time, timeIndex) => (
                              <label
                                className="container unavailable"
                                key={timeIndex}
                              >
                                <input
                                  type="checkbox"
                                  checked={formik.values.bookingSlots?.times?.includes(
                                    time
                                  )} // Check if the current time slot is included in the bookingSlots array
                                  onChange={() =>
                                    selectTimeSlot(currentDaySlot.day, time)
                                  }
                                  name="skills"
                                  value={time}
                                />
                                <span className="checkmark">{time}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="alert alert-danger">
                            {t("Slots are not available")}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-data">
          <div className="input-style mb-dropdown">
            <label htmlFor="about-box">
              {t("Booking Notes")} <span>*</span>
            </label>
            <textarea
              placeholder="Booking Notes"
              cols="30"
              rows="10"
              className="ctm-textarea"
              name="bookingNotes"
              value={formik.values.bookingNotes}
              onChange={formik.handleChange}
            ></textarea>
            {formik.errors.bookingNotes && formik.touched.bookingNotes && (
              <span className="input-error mt-3">
                {formik.errors.bookingNotes}
              </span>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100 check-btn">
          {t("Continue to Checkout")}
        </button>
      </form>
    </div>
  );
};

export default SlotsView;
