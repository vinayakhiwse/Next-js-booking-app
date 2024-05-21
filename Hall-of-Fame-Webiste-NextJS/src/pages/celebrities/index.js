import CommonPagination from "@/components/common/CommonPagination";
import CelebritiesCard from "@/views/cards/CelebritiesCard";
import React, { useEffect, useRef, useState } from "react";
import DropdownIcon from "../../../public/assets/img/icons/DropdownIcon.svg";
import Script from "next/script";
import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useFormik } from "formik";
import useTranslation from "@/hooks/useTranslation";
import { Rings } from "react-loader-spinner";
import { useRouter } from "next/router";

const Celebrities = () => {
  const itemsPerPage = 6;
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [Celebritydata, setCelebritydata] = useState([]);
  const [categoryItemlist, setcategoryItemlist] = useState([]);
  const [CityList, setCityList] = useState([]);
  const [subCategorylist, setSubCategorylist] = useState([]);
  const selectRefs = useRefArray(3); // Create an array of 3 refs
  const [CelebrityDisplay, setCelebrityDisplay] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { locale } = useRouter();
  // Helper function to create an array of refs
  function useRefArray(length) {
    const refs = [];

    for (let i = 0; i < length; i++) {
      refs[i] = useRef(null);
    }

    return refs;
  }
  useEffect(() => {
    FetchCategoryList();
    FetchCityList();
  }, []);

  useEffect(() => {
    setLoading(true);
    const querySnapshot = query(
      collection(db, "User"),
      where("user_types", "==", "Celebrity")
    );
    const unsubscribe = onSnapshot(querySnapshot, async (snapshot) => {
      const promises = snapshot.docs.map(async (doc) => {
        const docData = doc.data();
        if (docData.category) {
          docData.category = (await getDoc(docData?.category)).data();
        }
        if (docData.city) {
          docData.city = (await getDoc(docData?.city)).data();
        }
        if (docData.subcategory) {
          docData.subcategory = (await getDoc(docData?.subcategory)).data();
        }

        return {
          id: docData?.uid,
          display_name: docData?.display_name,
          city: docData?.city,
          photo_url: docData?.photo_url,
          category: docData?.category,
          review: docData?.review,
          name: docData?.subcategory?.name,
        };
      });

      const messages = await Promise.all(promises);
      setCelebritydata(messages);
      setCelebrityDisplay(messages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      subcategory: "",
      city: "",
    },
    onSubmit: async (values) => {
      DisplayFilterData(values);
    },
  });

  const DisplayFilterData = async (values) => {
    const { name, category, subcategory, city } = values;
    let filteredData = [...Celebritydata];

    if (name) {
      filteredData = filteredData.filter((item) =>
        item.display_name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (category?.name) {
      filteredData = filteredData.filter((item) =>
        item.category.name.toLowerCase().includes(category.name.toLowerCase())
      );
    }

    if (category.name && subcategory) {
      filteredData = filteredData.filter(
        (item) => item.name?.toLowerCase() == subcategory.toLowerCase()
      );
    }

    if (city) {
      filteredData = filteredData.filter((item) =>
        item.city.name.toLowerCase().includes(city.toLowerCase())
      );
    }
    setCelebrityDisplay(filteredData);
  };

  const fetchsubcategoryData = async () => {
    if (formik.values.category?.id) {
      const querySnapshot = await getDocs(
        collection(db, "Category", formik.values?.category?.id, "Subcategory")
      );
      const subcategories = querySnapshot.docs.map((doc) => {
        const SubCategoryData = doc.data();
        return {
          name: SubCategoryData?.name,
          name_ar: SubCategoryData?.name_ar,
        };
      });
      setSubCategorylist([...subcategories]);
    }
  };
  useEffect(() => {
    fetchsubcategoryData();
  }, [formik.values.category]);

  //fetching category type here..
  const FetchCategoryList = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.docs.map(async (doc) => {
      const docData = doc.data();
      setcategoryItemlist((prev) => [
        ...prev,
        { id: doc.id, name: docData?.name, name_ar: docData?.name_ar },
      ]);
    });
  };

  //fetching city list here..
  const FetchCityList = async () => {
    const querySnapshot = await getDocs(collection(db, "Cities"));
    querySnapshot.docs.map(async (doc) => {
      const docData = doc.data();
      setCityList((prev) => [
        ...prev,
        { id: doc.id, name: docData?.name, name_ar: docData?.name_ar },
      ]);
    });
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(CelebrityDisplay.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(CelebrityDisplay.length / itemsPerPage));
  }, [itemOffset, CelebrityDisplay]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % CelebrityDisplay.length;
    setItemOffset(newOffset);
  };
  useEffect(() => {
    selectRefs.forEach((ref, index) => {
      $(ref.current).select2({
        placeholder: $(ref.current).data("placeholder"),
      });

      $(ref.current).on("select2:select", function (e) {
        const selectedValue = e.params.data;
        let fieldName;
        switch (index) {
          case 0:
            fieldName = "category";
            break;
          case 1:
            fieldName = "subcategory";
            break;
          case 2:
            fieldName = "city";
            break;
          default:
            fieldName = "";
        }
        if (fieldName === "category") {
          formik.setFieldValue(fieldName, {
            id: selectedValue.id,
            name: selectedValue.text,
          });
        } else if (fieldName) {
          formik.setFieldValue(fieldName, selectedValue.id);
        }
      });
    });
  }, []);

  const resetFilter = () => {
    formik.resetForm();
    formik.setValues({
      name: "",
      category: "",
      subcategory: "",
      city: "",
    });
    // Manually reset the select tags using Select2's 'val' method
    selectRefs.forEach((ref) => {
      $(ref.current).val("").trigger("change.select2");
    });
  };

  return (
    <>
      <section className="sec-m-tb">
        <div className="container">
          <div className="row celebrities-container">
            <div className="col-lg-12">
              <p className="custom-title text-center">
                {t("Book celebrities for your events")}
              </p>
            </div>

            <div className="col-md-4 col-lg-3 pr-3 mb-3 mb-md-0">
              <div className="filters">
                <form id="filter-form" onSubmit={formik.handleSubmit}>
                  <h2>{t("Filters")}</h2>
                  <div className="input-style">
                    <label htmlFor="first-box">{t("Celebrity")}</label>
                    <input
                      type="text"
                      className="ctm-input"
                      id="first-box"
                      name="name"
                      placeholder={t("Celebrity Name")}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="input-style mb-dropdown">
                    <label htmlFor="category-box">{t("Category")}</label>
                    <div className="custom-selct-icons-arow position-relative">
                      <img
                        src={DropdownIcon.src}
                        className="img-fluid arrow-abs"
                      />
                      <select
                        className="js-example-basic-single ctm-input"
                        name="category"
                        id="category"
                        placeholder={t("Select Category")}
                        ref={selectRefs[0]}
                        value={formik.values.category}
                      >
                        <option value="">{t("Select Category")}</option>
                        {categoryItemlist?.map((item, i) => (
                          <option key={i} value={item?.id}>
                            {locale == "en" ? item?.name : item?.name_ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    className="input-style mb-dropdown"
                    id="subcat-dropdown"
                    style={{ display: "none !important" }}
                  >
                    <label htmlFor="sub-box">{t("SubCategory")}</label>
                    <div className="custom-selct-icons-arow position-relative">
                      <img
                        src={DropdownIcon.src}
                        className="img-fluid arrow-abs"
                      />
                      <select
                        className="js-example-basic-single ctm-input"
                        name="subcategory_id"
                        id="subCategory "
                        placeholder={t("Select SubCategory")}
                        ref={selectRefs[1]}
                        value={formik.values.subcategory}
                      >
                        <option value="">{t("Select SubCategory")}</option>
                        {subCategorylist?.map((item, i) => (
                          <option key={i} value={item?.name}>
                            {locale == "en" ? item?.name : item?.name_ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="input-style mb-dropdown">
                    <label htmlFor="city-box">{t("City")}</label>
                    <div className="custom-selct-icons-arow position-relative">
                      <img
                        src={DropdownIcon.src}
                        className="img-fluid arrow-abs"
                      />
                      <select
                        className="js-example-basic-single ctm-input"
                        name="city_id"
                        data-placeholder={t("Select City")}
                        id="city-box"
                        ref={selectRefs[2]}
                        value={formik.values.city}
                      >
                        <option value="">{t("Select City")}</option>
                        {CityList?.map((item, i) => (
                          <option key={i} value={item?.name}>
                            {locale == "en" ? item?.name : item?.name_ar}
                          </option>
                        ))}
                      </select>
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
                      style={{ marginTop: "5px" }}
                    >
                      {t("Reset Filters")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 px-0">
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
                  <section className="bookings">
                    <div className="row mx-0">
                      <div className="col-lg-12 book-cards px-0">
                        {currentItems &&
                          currentItems.map((val, i) => (
                            <CelebritiesCard CelebrityItem={val} key={i} />
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

              {CelebrityDisplay?.length > 5 && (
                <CommonPagination
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <Script>
        {`$('.js-example-basic-single').select2({
            placeholder: $(this).data('placeholder'),
        })`}
      </Script>
    </>
  );
};

export default Celebrities;

