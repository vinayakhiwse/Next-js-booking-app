import { FooterLinkItem, SocialLinkItem } from "@/components/common/LinkItem";
import useTranslation from "@/hooks/useTranslation";
import { FooterNavigation } from "@/navigations";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { staticdata } = useSelector((state) => state.SiteData);
  const { t } = useTranslation();
  return (
    <footer className="footer pt-4 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="footer-main d-flex align-items-center justify-content-center">
              <Link href="/">
                <div className="footer-logo d-flex align-items-center justify-content-center">
                  <img src="/assets/img/logos/logo.png" alt="" />
                </div>
              </Link>

              <span className="footer-logo-partation"></span>

              <div className="footer-navigation-main">
                <ul className="footer-nav d-flex align-items-center">
                  {FooterNavigation().map((item, i) => (
                    <FooterLinkItem
                      title={t(item.title)}
                      url={item.path}
                      key={i}
                    />
                  ))}
                </ul>
                <p className="footer-copyright">
                  <Link href="/" className="footer-home-link">
                    {t("Hall of Fame")}
                  </Link>{" "}
                  &copy; {t("Copyright 2023 - All Rights Reserved")}
                </p>
              </div>

              <div className="footer-social">
                <div className="social-logo d-flex">
                  <SocialLinkItem
                    className="fa fa-facebook-f f-icon"
                    url={staticdata?.facebook}
                  />
                  <SocialLinkItem
                    className="fab fa-twitter f-icon"
                    url={staticdata?.twitter}
                  />
                  <SocialLinkItem
                    className="fab fa-pinterest-p f-icon"
                    url={staticdata?.pinterest}
                  />
                  <SocialLinkItem
                    className="fab fa-instagram f-icon"
                    url={staticdata?.instagram}
                  />
                </div>
                <p className="support-email">
                  {t("Support")}: <span>{staticdata?.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
