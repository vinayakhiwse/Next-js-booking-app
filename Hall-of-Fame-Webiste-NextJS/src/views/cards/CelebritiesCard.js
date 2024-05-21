import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const CelebritiesCard = ({ CelebrityItem }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  return (
    <Link
      href={`/celebrities/${CelebrityItem?.id}`}
      className="booking-card-link booking-row1"
    >
      <div className="booking-card-main">
        <div className="booking-card-detail">
          <div className="star-ratings">
            <img src="/assets/Star.svg" alt="star-svg" loading="lazy" />
            <span>{CelebrityItem?.review}</span>
          </div>
          <p className="booking-subtitle">
            {locale == "en"
              ? CelebrityItem?.category.name
              : CelebrityItem?.category.name_ar}
          </p>
          <p className="booking-title">{CelebrityItem?.display_name}</p>
          <p className="booking-city">
            {locale == "en"
              ? CelebrityItem?.city.name
              : CelebrityItem?.city?.name_ar}
          </p>
          <div className="booking-card-badge d-flex align-items-center justify-content-center">
            <p className="badge-text">{t("view services")}</p>
          </div>
        </div>
        <div className="booking-card-img d-flex align-items-center justify-content-center">
          <img
            src={CelebrityItem?.photo_url}
            alt=""
            className="img-fluid"
            loading="lazy"
          />
        </div>
      </div>
    </Link>
  );
};

export default CelebritiesCard;
