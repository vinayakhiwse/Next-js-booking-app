import CommonPagination from "@/components/common/CommonPagination";
import useTranslation from "@/hooks/useTranslation";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BookingTabPanelView = ({ items, loading }) => {
  const itemsPerPage = 5;
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const { t } = useTranslation();
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  return (
    <div className="my-ordemt-a">
      <div className="row">
        {currentItems?.map((booking) => (
          <Link href={`/dashboard/bookings/${booking.id}`} key={booking.id}>
            <div className="order-list-box">
              <div className="quotation-container d-flex">
                <div className="booking-img d-flex justify-content-center align-items-center">
                  <img
                    src={booking.serviceImage}
                    alt="service-img"
                    className="img-fluid"
                  />
                </div>
                <div className="order-detail d-flex justify-content-between w-100">
                  <div className="order-info-left w-100 position-relative">
                    <div className="order-top-title-price d-flex align-items-center margin-cus-bot justify-content-between">
                      <h5 className="tittle-order mb-0">
                        {t("Booking No -")} <span>#{booking.booking_id}</span>
                      </h5>
                    </div>

                    <ul className="order-combination">
                      <li className="list">
                        {t("Celebrity Name")}: <span>{booking.celebrity}</span>
                      </li>
                    </ul>

                    <ul className="order-combination">
                      <li className="list">
                        {t("Service Name")}: <span>{booking.serviceName}</span>
                      </li>
                    </ul>
                    <ul className="order-combination">
                      <li className="list">
                        {t("Booked Date")}:{" "}
                        <span>
                          {moment(booking.slot_date, "D/M/YYYY")
                            .format("MMM D, YYYY")
                            .toUpperCase()}
                        </span>
                      </li>
                    </ul>
                    <ul className="order-combination status-mt-s">
                      <li className="list mb-0">
                        {t("Booked Time")} :
                        <span>
                          {booking.firstTime} - {booking.lastTime}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="quotation-price-container d-flex justify-content-between">
                <p className="quot-price">
                  {t("Total Amount")}: <span>SAR{booking.total_price}</span>
                </p>
                <p className="quot-status">
                  {t("Status")}:<span>{booking.status}</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
        {currentItems?.length === 0 && !loading && (
          <div className="alert alert-danger">{t("No record found")}</div>
        )}
        {currentItems?.length > 5 && (
          <CommonPagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
};

export default BookingTabPanelView;
