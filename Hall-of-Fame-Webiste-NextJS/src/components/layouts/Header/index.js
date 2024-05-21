import LanguageSelector from "@/components/common/LanguageSelector";
import { HeaderNavigation } from "@/navigations";
import Link from "next/link";
import React from "react";
import NavMenu from "./NavMenu";
import HeroSlider from "../Hero/hero-slider";
import HeroBanner from "../Hero/hero-banner";
import { useRouter } from "next/router";
import logo from "../../../../public/assets/img/logos/logo.png";
import Notifications from "./Notification";
import { UserNavMenu } from "./AuthNavMenu";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import useTranslation from "@/hooks/useTranslation";
const Header = () => {
  const { pathname } = useRouter();
  const { AuthId } = useSelector((state) => state.AuthData);
  const { t } = useTranslation();
  return (
    <>
      <header className="header-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigation-main d-flex align-items-center">
                <Link href="/">
                  <div className="header-logo d-flex align-items-center justify-content-center">
                    <img src={logo.src} alt="" />
                  </div>
                </Link>
                <button
                  className="hamburger d-block d-lg-none"
                  data-toggle="collapse"
                >
                  <i className="fas fa-bars"></i>
                </button>

                <NavMenu nevigationItems={HeaderNavigation()} />

                {/* Search section */}
                <div className="header-buttons d-flex align-items-center">
                  <div className="search-cont position-relative">
                    <div
                      className="icon-btn d-flex align-items-center justify-content-center"
                      id="btn-search-toggle"
                    >
                      <i className="fas fa-search"></i>
                    </div>

                    <div className="form-search-outer">
                      <form className="form-search-wrap">
                        <input
                          type="text"
                          placeholder={t("Search")}
                          id="search-input"
                          name="celebrity"
                        />
                        <button className="btn-search btn-submit" type="submit">
                          <img
                            src="assets/img/icons/Icon ionic-ios-search.svg"
                            alt=""
                          />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Notification ball icon if user is login */}
                  {AuthId && <Notifications />}

                  {/* Login/Registration if user not login and if user login then the dropdown based on the user type */}
                  {AuthId ? (
                    <div className="profile-dropdn">
                      <button
                        className="btn btn-primary"
                        type="button"
                        id="profile-drop"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {t("Profile")}
                        <MdKeyboardArrowDown fontSize={25} />
                      </button>
                      <UserNavMenu />
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="btn btn-primary login-btn"
                    >
                      {t("Login/Sign up")}
                    </Link>
                  )}

                  {/* language Selector */}
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
          <HeroBanner />
        </div>
      </header>
      {pathname == "/" && <HeroSlider />}
    </>
  );
};

export default Header;
