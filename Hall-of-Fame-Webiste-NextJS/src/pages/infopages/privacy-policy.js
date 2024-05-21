import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

const PrivacyPolicy = () => {
  const { staticdata } = useSelector((state) => state.SiteData);
  const { locale } = useRouter();
  const { t } = useTranslation();
  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="custom-title text-center">{t("Privacy Policy")}</h2>
          </div>
          <div className="policy-cont">
            <p>
              <span
                style={{
                  color: "rgb(153, 153, 153)",
                  fontFamily: "Segoe UI",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                {staticdata.privacy_policy[locale]}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
