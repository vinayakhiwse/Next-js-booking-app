import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const CategoryCard = ({ type, categoryItem }) => {
  const { locale } = useRouter();
  return (
    <Link
      href={
        type == "subCategory"
          ? `/celebrities`
          : `/categories/sub-categories/${categoryItem?.docId}`
      }
    >
      <div className="category-card-main">
        <div className="cat-card-img d-flex align-items-center justify-content-center">
          <img
            src={categoryItem?.category_img || categoryItem?.image}
            alt=""
            className="img-fluid"
            loading="lazy"
          />
        </div>
        <div className="cat-card-textbox text-center">
          <p className="cat-title">
            {locale == "en" ? categoryItem?.name : categoryItem?.name_ar}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
