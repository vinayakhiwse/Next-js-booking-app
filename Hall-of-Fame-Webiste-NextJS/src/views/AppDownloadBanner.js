import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const AppDownloadBanner = () => {
  const { android_app, ios_app } = useSelector(
    (state) => state.SiteData.staticdata
  );
  const { t } = useTranslation();

  return (
    <section className="mobile-app sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="app-main d-flex align-items-center justify-content-center">
              <div className="app-img">
                <img
                  src="https://alpha3.mytechnology.ae/hall-of-fame//images/timthumb.php?src=uploads/admin/app-mob-1655810976.png&w=403&h=469&zc=1&q=95&s=0"
                  alt=""
                  className="img-fluid"
                />
              </div>
              <div className="app-content">
                <div className="app-title">{t("Home Downloads Section")}</div>
                <div className="app-desc">
                  <p className="desc-fix">
                    {t(
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                    )}
                  </p>
                </div>
                <div className="app-btns d-flex align-items-center justify-content-center">
                  <Link href={android_app}>
                    <img
                      src="/assets/google-btn.jpg"
                      alt=""
                      className="img-fluid gog-btn"
                    />
                  </Link>
                  <Link href={ios_app}>
                    <img
                      src="/assets/ios-btn.jpg"
                      alt=""
                      className="img-fluid ios-btn"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadBanner;
