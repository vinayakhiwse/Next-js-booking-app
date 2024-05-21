import CommonPagination from "@/components/common/CommonPagination";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import CategoryCard from "@/views/cards/CategoryCard";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";

const SubCategories = () => {
  const {
    query: { categoryId },
  } = useRouter();
  const { t } = useTranslation();

  const itemsPerPage = 4;
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [displayData, SetDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [SearchItem, setSearchItem] = useState("");

  const docRef = collection(db, "Category", categoryId, "Subcategory");
  const FetchSubCategory = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(docRef);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      setSubcategoryData(data);
      setLoading(false);
      filterData(data);
    } catch (error) {
      console.log("Subcategory fetching", error);
    }
  };
  const filterData = (data) => {
    const filteredData = data.filter((item) => {
      const itemName = item.name.toLowerCase();
      return itemName.includes(SearchItem);
    });
    SetDisplayData(filteredData);
  };

  useEffect(() => {
    FetchSubCategory();
  }, [SearchItem]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(displayData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(displayData.length / itemsPerPage));
  }, [itemOffset, subcategoryData]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % displayData.length;
    setItemOffset(newOffset);
  };

  const handleChange = (e) => {
    setSearchItem(e.target.value.toLowerCase());
    filterData(subcategoryData);
  };

  return (
    <section className="sec-m-tb categories-cont">
      <div className="container">
        <form id="cat-search">
          <div className="row">
            <div className="col-12 mb-15 p-0">
              <div className="input-style">
                <div className="type-pass">
                  <input
                    type="search"
                    className="ctm-input"
                    placeholder={t("search")}
                    name="q"
                    value={SearchItem}
                    onChange={handleChange}
                  />
                  <div
                    className="icon-eye d-flex align-items-center justify-content-center"
                    style={{ top: "-0.2rem" }}
                  >
                    <i className="fas fa-search"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="row category">
          <div className="col-lg-12">
            <p className="custom-title text-center">
              {t("Select the sub category you are booking for")}
            </p>
          </div>
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
            currentItems &&
            currentItems.map((val, i) => (
              <div className="col-lg-3 col-md-6 first-row-cat" key={i}>
                <CategoryCard type="subCategory" categoryItem={val} />
              </div>
            ))
          )}
          {currentItems?.length === 0 && !loading && (
            <div className="alert alert-danger">{t("No record found")}</div>
          )}
        </div>
        {displayData?.length > 3 && (
          <CommonPagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
          />
        )}
      </div>
    </section>
  );
};

export default SubCategories;
