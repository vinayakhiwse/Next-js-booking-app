import useTranslation from "@/hooks/useTranslation";
import React from "react";

const Subscriptions = () => {
  const { t } = useTranslation();
  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="custom-title-forget text-center">
              {t("Subscription Package")}
              <p>{t("Please subscribe to a subscription package")}</p>
            </h2>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="subs-main">
                  <div className="row">
                    <div className="col-md-6 col-lg-4">
                      <form>
                        <div className="sub-box-1">
                          <div className="inner-sub-1">
                            <p className="titlte-basics">{t("Basic")}</p>
                            <p className="tittle-month-pack">1 Year Package</p>
                          </div>
                          <div className="dec-main-pack">
                            <p className="dec-p">
                              Lorem ipsum dolor, sit amet consectetur
                              adipisicing elit. Blanditiis exercitationem vitae
                              dolor fugit mollitia aspernatur suscipit facere,
                              corporis laudantium repellat laborum illum!
                              Corrupti excepturi itaque provident eos quasi
                              laudantium nostrum in quas, harum molestiae
                              molestias!
                            </p>
                            <h3 className="tittle-price">$ 500</h3>
                          </div>
                          <div className="subcrip-button">
                            <button
                              className="btn btn-primary"
                              data-toggle="modal"
                              data-target="#buysubscription"
                            >
                              {t("Buy")}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscriptions;
