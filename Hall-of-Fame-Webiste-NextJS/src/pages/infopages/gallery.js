import CommonPagination from "@/components/common/CommonPagination";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ImageGallery = () => {
  const { images } = useSelector((state) => state.SiteData);
  const { t } = useTranslation();
  const itemsPerPage = 8;
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(images.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(images.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, images]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % images.length;
    setItemOffset(newOffset);
  };

  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 image-gallery">
            <h2 className="gallery-title">{t("Image Gallery")}</h2>
            <div className="gallery-container mb-3">
              {currentItems && currentItems?.length > 0 ? (
                currentItems.map((val, i) => (
                  <img src={val} alt="gallery-img" key={i} />
                ))
              ) : (
                <div className="alert alert-danger">{t("No record found")}</div>
              )}
            </div>
          </div>
        </div>
        {images.length > itemsPerPage && (
          <CommonPagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
          />
        )}
      </div>
    </section>
  );
};

export default ImageGallery;
