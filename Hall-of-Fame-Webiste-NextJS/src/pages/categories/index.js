import CommonPagination from "@/components/common/CommonPagination";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import CategoryCard from "@/views/cards/CategoryCard";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";

const Categories = () => {
  const itemsPerPage = 4;
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [categoryData, setcategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const fetchData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Category"));
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      setcategoryData(data);
      setLoading(false);
    } catch (error) {
      console.log("category fetching", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(categoryData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(categoryData.length / itemsPerPage));
  }, [categoryData, itemOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

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
        <>
          {" "}
          <section className="sec-m-tb categories-cont">
            <div className="container">
              <div className="row category">
                <div className="col-lg-12">
                  <p className="custom-title text-center">
                    {t("Select the category you are booking for")}
                  </p>
                </div>

                {currentItems &&
                  currentItems.map((val, i) => (
                    <div className="col-lg-3 col-md-6 first-row-cat" key={i}>
                      <CategoryCard categoryItem={val} />
                    </div>
                  ))}
              </div>
              {categoryData?.length > 4 && (
                <CommonPagination
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                />
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Categories;
