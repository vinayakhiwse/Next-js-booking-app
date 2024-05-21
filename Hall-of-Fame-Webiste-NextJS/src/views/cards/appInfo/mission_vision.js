import useTranslation from "@/hooks/useTranslation";
import React from "react";

const MissionVision = ({ content, image }) => {
  const { t } = useTranslation();
  return (
    <div className="mission-vision">
      <div className="about-cont">
        <h2>
          {t("Mission")} &amp; {t("Vission")}
        </h2>
        <p>{content}</p>
        <div className="about-imgs">
          <img
            src={image}
            alt="elon-img"
            width="262"
            height="262"
            className="elon-img"
          />
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
