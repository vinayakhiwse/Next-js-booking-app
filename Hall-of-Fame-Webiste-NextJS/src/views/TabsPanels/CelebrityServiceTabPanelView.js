import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const CelebrityServiceTabPanelView = ({ CelebrityServiceItem }) => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const discountAmount =
    (CelebrityServiceItem?.price * CelebrityServiceItem?.discount) / 100; // Calculate the discount amount
  const updatedAmount = CelebrityServiceItem?.price - discountAmount; // Calculate the updated amount
  return (
    <div className="row mx-0">
      <div className="col-lg-12 services-container manage-contain px-0">
        {/* loop */}
        <Link
          href={`/services/${CelebrityServiceItem?.id}`}
          className="service-card-link bhs"
        >
          <div className="service-card-main rights">
            <div className="service-card-img d-flex align-items-center justify-content-center">
              {/* Show if discount price is avaliable */}
              {CelebrityServiceItem?.discount > 0 && (
                <span className="sale-badge">
                  {CelebrityServiceItem?.discount}
                  {t("%off")}
                </span>
              )}
              {/* {service.default_attachment_type === "video" ? (
                <video
                  muted
                  preload="metadata"
                  width="360"
                  height="211"
                  controls
                >
                  <source src={service.default_image} type="video/mp4" />
                </video>
              ) : ( */}
              <img
                src={CelebrityServiceItem.image[0]}
                alt=""
                className="img-fluid"
              />
              {/* )} */}
            </div>
            <div className="service-card-detail">
              <p className="service-subtitle text-truncate">
                {CelebrityServiceItem.display_name}{" "}
              </p>
              <p className="service-title text-truncate">
                {locale == "en"
                  ? CelebrityServiceItem.name
                  : CelebrityServiceItem.name_ar}
              </p>
              {CelebrityServiceItem.price > 0 ? (
                <p className="service-price">
                  {CelebrityServiceItem.discount > 0 ? (
                    <>
                      SAR{updatedAmount}
                      <span>
                        <span className="lined-span">
                          {CelebrityServiceItem?.price}
                        </span>
                        {t("/hr")}
                      </span>
                    </>
                  ) : (
                    <>
                      SAR {CelebrityServiceItem?.price}
                      {t("/hr")}
                    </>
                  )}
                </p>
              ) : (
                <p className="service-price">{t("Ask Price")}</p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CelebrityServiceTabPanelView;
