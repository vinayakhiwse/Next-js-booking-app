import useTranslation from "@/hooks/useTranslation";
import React from "react";

const Aboutus = ({ content, image }) => {
  const { t } = useTranslation();
  return (
    <div className="aboutus">
      <div className="about-cont">
        <h2>{t("About Us")}</h2>
        <p>{content}</p>
        <div className="about-imgs">
          <img
            src={image}
            alt="blake-img"
            width="262"
            height="262"
            className="blake-img"
          />
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
