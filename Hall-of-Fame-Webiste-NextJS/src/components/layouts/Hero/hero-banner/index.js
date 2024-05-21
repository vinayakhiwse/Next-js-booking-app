import { PageNameAndRoute } from "@/constants/PageTitle";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const getTitle = (path) => {
  return PageNameAndRoute.find((value) => value.path == path);
};

const HeroBanner = () => {
  const { asPath, pathname, query } = useRouter();
  const { t } = useTranslation();
  let pagetitle;

  if (pathname == "/booking-info/[...id_type]") {
    if (query.id_type) {
      pagetitle = getTitle(query.id_type[1]);
    }
  } else {
    pagetitle = getTitle(pathname);
  }

  return pathname == "/" ? (
    <div className="row">
      <div className="col-lg-12">
        <div className="banner-text-content">
          <p className="banner-text">
            {t("Hire Bands, Dancers & Entertaining Acts For Your Event")}
          </p>
          <Link href="/services" className="btn btn-secondary banner-btn">
            {t("Book Now")}
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="row">
      <div className="col-lg-12">
        <div className="common-banner-content">
          <h1 className="banner-text">{t(pagetitle?.title)}</h1>
          <ul className="header-breadcrumbs">
            <li>
              <Link href="/">{t("Home")}</Link>
            </li>
            {pagetitle?.Parent ? (
              <li>
                <Link href={pagetitle.ParentPath}>{t(pagetitle.Parent)}</Link>
              </li>
            ) : null}
            <li>
              <Link href={asPath}>{t(pagetitle?.title)}</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
