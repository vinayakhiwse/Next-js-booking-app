import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ServiceCard = ({ Serviceitem }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const discountAmount = (Serviceitem?.price * Serviceitem?.discount) / 100; // Calculate the discount amount
  const updatedAmount = Serviceitem?.price - discountAmount; // Calculate the updated amount
  return (
    <div className="service-card-main">
      <Link
        href={`/services/${Serviceitem?.docId}`}
        className="service-card-link"
      >
        <div className="service-card-img d-flex align-items-center justify-content-center">
          {Serviceitem?.discount && (
            <span className="sale-badge">
              {Serviceitem.discount} {t("%off")}{" "}
            </span>
          )}

          {/* <video
                        muted
                        preload="metadata"
                        width="350"
                        height="211"
                        controls
                      >
                        <source
                          src="{{ $service->default_image }}"
                          type="video/mp4"
                        />
                      </video> */}

          <img src={Serviceitem?.image[0]} alt="" className="img-fluid" />
        </div>
        <div className="service-card-detail">
          <p className="service-subtitle">
            {locale == "en" ? Serviceitem?.name : Serviceitem?.name_ar}
          </p>
          <p className="service-title">{Serviceitem?.display_name}</p>
          {/* check the service price */}
          {Serviceitem?.price ? (
            <p className="service-price">
              SAR {Serviceitem?.discount ? updatedAmount : Serviceitem?.price}
              <span>
                <span className="lined-span">{Serviceitem?.price}</span>{" "}
                {t("/hr")}
              </span>
            </p>
          ) : (
            <p className="service-price">{t("Ask Price")}</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard;
