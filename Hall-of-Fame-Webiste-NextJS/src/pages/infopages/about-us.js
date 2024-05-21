import useTranslation from "@/hooks/useTranslation";
import Aboutus from "@/views/cards/appInfo/aboutus";
import MissionVision from "@/views/cards/appInfo/mission_vision";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

const AboutUspage = () => {
  const { staticdata } = useSelector((state) => state.SiteData);
  const { locale } = useRouter();
  const { t } = useTranslation();
  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {staticdata?.about ? (
              <>
                <Aboutus
                  content={staticdata?.about[locale]}
                  image={staticdata?.about.image}
                />
                <MissionVision
                  content={staticdata?.mission_vision[locale]}
                  image={staticdata?.mission_vision.image}
                />
              </>
            ) : (
              <div className="alert alert-danger">{t("No record found")}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUspage;
