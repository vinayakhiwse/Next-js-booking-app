import CommonPagination from "@/components/common/CommonPagination";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Articles = () => {
  const { articles } = useSelector((state) => state.SiteData);
  const { locale } = useRouter();
  const { t } = useTranslation();
  const itemsPerPage = 6;
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(articles.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(articles.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, articles]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % articles.length;
    setItemOffset(newOffset);
  };

  
  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="custom-title text-center">{t("Articles")}</h2>
            {currentItems?.length > 0 ? (
              currentItems.map((val, i) => (
                <Link href={`/infopages/articles/${val.docid}`} key={i}>
                  <div className="blog-container">
                    <img src={val.image} alt="blog-img" />
                    <div className="blog-data">
                      <h2>{val.name[locale]}</h2>
                      <p>{val.description[locale]}</p>
                      <div className="blog-details">
                        <p>
                          <span className="date">
                            <i className="far fa-calendar-alt"></i>
                            {val.date}
                          </span>
                          <span className="comments">
                            <i className="far fa-comment"></i>
                            {val.comments} {t("Comments")}
                          </span>
                          <span className="written">
                            <i className="far fa-user"></i>
                            {t("Written by")}{" "}
                            <span>{val.authorName[locale]}</span>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="alert alert-danger">{t("No record found")}</div>
            )}
          </div>
          {articles.length > itemsPerPage && (
            <CommonPagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Articles;
