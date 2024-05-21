import CommonPagination from "@/components/common/CommonPagination";
import useTranslation from "@/hooks/useTranslation";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const QuotationsTabPanelView = ({ items }) => {
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
        {currentItems?.map((quotation) => (
          <Link
            href={`/dashboard/quotations/${quotation.id}`}
            key={quotation.id}
          >
            <div className="order-list-box">
              <div className="quotation-container d-flex">
                <div className="booking-img d-flex justify-content-center align-items-center">
                  <img
                    src={quotation.serviceImage}
                    alt="service-img"
                    className="img-fluid"
                  />
                </div>
                <div className="order-detail d-flex justify-content-between w-100">
                  <div className="order-info-left w-100 position-relative">
                    <div className="order-top-title-price d-flex align-items-center margin-cus-bot justify-content-between">
                      <h5 className="tittle-order mb-0">
                        {t("Quotation Id")} -
                        <span className="ml-1">#{quotation.quotation_id}</span>
                      </h5>
                    </div>
                    <ul className="order-combination">
                      <li className="list">
                        {t("Service Name")}:
                        <span className="ml-1">{quotation.serviceName}</span>
                      </li>
                    </ul>
                    <ul className="order-combination">
                      <li className="list">
                        {t("Booked Date")} :
                        <span className="ml-1">
                          {moment(quotation.slot_date, "D/M/YYYY")
                            .format("MMM D, YYYY")
                            .toUpperCase()}
                        </span>
                      </li>
                    </ul>
                    <ul className="order-combination status-mt-s">
                      <li className="list mb-0">
                        {t("Booked Time")} :
                        <span className="ml-1">
                          {quotation.firstTime} - {quotation.lastTime}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="quotation-price-container d-flex justify-content-between">
                <p className="quot-price">
                  {quotation?.QuotedPrice > 0 && (
                    <>
                      {t("Quoted Price")} :{" "}
                      <span>SAR {quotation?.QuotedPrice}</span>
                    </>
                  )}
                </p>
                <p className="quot-status">
                  {t("Status")} : <span>{quotation.status}</span>
                </p>
              </div>
            </div>
          </Link>
        ))}

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

export default QuotationsTabPanelView;
