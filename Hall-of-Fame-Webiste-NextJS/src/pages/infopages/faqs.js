import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

const FAQS = () => {
  const { faqs } = useSelector((state) => state.SiteData);
  const { t } = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <section className="sec-m-tb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="custom-title-faq text-center">{t("FAQs")}</h2>
              <div className="faq-accordion-content-main">
                {faqs.length > 0 ? (
                  faqs?.map((val, i) => {
                    return (
                      <div id={`accordion-${i}`}>
                        <div className="card">
                          <div id="headingOne" className="card-header">
                            <h5 className="mb-0">
                              <button
                                data-toggle="collapse"
                                data-target={`#collapseOne-${i}`}
                                aria-expanded="false"
                                aria-controls={`collapseOne-${i}`}
                                className="btn btn-link collapsed"
                              >
                                {val.question[locale]}
                                <i className="fas fa-plus"></i>
                                <i className="fas fa-minus"></i>
                              </button>
                            </h5>
                          </div>
                          <div
                            id={`collapseOne-${i}`}
                            aria-labelledby="headingOne"
                            data-parent={`#accordion-${i}`}
                            className="collapse"
                          >
                            <div className="card-body">
                              {val.anwser[locale]}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="alert alert-danger">
                    {t("No record found")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQS;
