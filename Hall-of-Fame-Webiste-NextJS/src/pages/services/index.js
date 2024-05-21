import CommonPagination from "@/components/common/CommonPagination";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import ServiceCard from "@/views/cards/ServiceCard";
import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Rings } from "react-loader-spinner";

const Services = () => {
  const itemsPerPage = 6;
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [allService, setAllService] = useState([]);
  const [filteredService, setFilteredService] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    const queryMessages = query(
      collection(db, "Service"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, async (snapshot) => {
      const promises = snapshot.docs.map(async (doc) => {
        const docData = doc.data();
        if (docData.celebrity_user) {
          const celebrityUserDoc = await getDoc(docData.celebrity_user);
          docData.celebrity_user = celebrityUserDoc.data();
        }
        return {
          docId: doc.id,
          price: docData?.price,
          name: docData?.name,
          name_ar: docData?.name_ar,
          description_ar: docData?.description_ar,
          display_name: docData?.celebrity_user?.display_name,
          image: docData?.image,
          discount: docData?.discount,
        };
      });

      const messages = await Promise.all(promises);
      setAllService(messages);
      setFilteredService(messages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredService.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredService.length / itemsPerPage));
  }, [itemOffset, filteredService]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredService.length;
    setItemOffset(newOffset);
  };

  const formik = useFormik({
    initialValues: {
      celebrity: "",
      service: "",
      min_price: null,
      max_price: null,
    },
    onSubmit: async (values) => {
      filterData(values);
    },
  });

  const filterData = (values) => {
    const { celebrity, service, min_price, max_price } = values;
    let filteredData = [...allService];

    if (service) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(service.toLowerCase())
      );
    }

    if (celebrity) {
      filteredData = filteredData.filter((item) =>
        item.display_name.toLowerCase().includes(celebrity.toLowerCase())
      );
    }
    if (min_price) {
      filteredData = filteredData.filter((item) =>
        item.discount
          ? item.price - (item?.price * item?.discount) / 100 >=
            parseFloat(min_price)
          : item.price >= parseFloat(min_price)
      );
    }

    if (max_price) {
      filteredData = filteredData.filter((item) =>
        item.discount
          ? item.price - (item?.price * item?.discount) / 100 <=
            parseFloat(max_price)
          : item.price <= parseFloat(max_price)
      );
    }
    setFilteredService(filteredData);
  };

  // Function to reset the form and update the UI
  const resetFilter = () => {
    formik.resetForm();
    formik.setValues({
      celebrity: "",
      service: "",
      min_price: "",
      max_price: "",
    });
  };

  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row celebrities-container">
          <div className="col-lg-12">
            <p className="custom-title text-center">
              {t("Choose the service you are booking for")}
            </p>
          </div>

          {/* filter form */}
          <div className="col-md-5 col-lg-4 pr-3 mb-3 mb-md-0">
            <form id="filter-form" onSubmit={formik.handleSubmit}>
              <div className="filters service-filter">
                <h2> {t("Filters")}</h2>
                <div className="input-style">
                  <label htmlFor="first-box">{t("Celebrity")}</label>
                  <input
                    type="text"
                    className="ctm-input"
                    id="first-box"
                    name="celebrity"
                    placeholder={t("Celebrity Name")}
                    value={formik.values.celebrity}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="input-style">
                  <label htmlFor="service-box">{t("Service")}</label>
                  <input
                    type="text"
                    className="ctm-input"
                    id="service-box"
                    placeholder={t("Service Name")}
                    name="service"
                    value={formik.values.service}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="price-service">
                  <div className="input-style price-ctm">
                    <label htmlFor="service-box">{t("Price")}</label>
                    <input
                      type="number"
                      className="ctm-input"
                      name="min_price"
                      placeholder={t("Min Price")}
                      value={formik.values.min_price}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="input-style price-ctm1">
                    <label htmlFor="service-box"> </label>
                    <input
                      type="number"
                      className="ctm-input"
                      name="max_price"
                      placeholder={t("Max Price")}
                      value={formik.values.max_price}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="filters-btn">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    tabIndex="0"
                  >
                    {t("Apply Filters")}
                  </button>
                  <button
                    onClick={resetFilter}
                    className="btn btn-primary w-100"
                    tabIndex="0"
                    style={{ marginTop: "10px" }}
                  >
                    {t("Reset Filters")}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-8 col-md-7 px-0">
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
                <section className="">
                  <div className="row mx-0">
                    <div className="col-lg-12 services-container px-0">
                      {currentItems &&
                        currentItems.map((val, i) => (
                          <ServiceCard Serviceitem={val} key={i} />
                        ))}
                    </div>
                  </div>
                </section>
                {currentItems?.length === 0 && (
                  <div className="alert alert-danger">
                    {t("No record found")}
                  </div>
                )}
              </>
            )}

            {filteredService?.length > 5 && (
              <CommonPagination
                handlePageClick={handlePageClick}
                pageCount={pageCount}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
