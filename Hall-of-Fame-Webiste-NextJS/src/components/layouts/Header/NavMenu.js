import { LinkItem, SubLinkItem } from "@/components/common/LinkItem";
import useTranslation from "@/hooks/useTranslation";
import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const NavMenu = ({ nevigationItems }) => {
  const { t } = useTranslation();
  return (
    <div className="mob-menu" id="mobile-menu-mt">
      <div className="d-lg-none px-4 side-nav-head">
        <button className="close-menu-mt">
          <i className="fa fa-times"></i>
        </button>
        <div className="header-logo d-flex align-items-center justify-content-center">
          <img src="assets/img/icons/Icon ionic-ios-search.svg" alt="" />
        </div>
      </div>
      <ul className="navigation-list d-block d-lg-flex  align-items-center mb-0 ">
        {nevigationItems.map((value, i) =>
          !value.subNav ? (
            <LinkItem title={t(value.title)} url={value.path} key={i} />
          ) : (
            <li className="navigation-list-item more-dropdown" key={i}>
              <div
                href=""
                className="navigation-list-item-link "
                id="more-dropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t(value.title)}
                <MdKeyboardArrowDown fontSize={20} />
              </div>
              <div className="dropdown-menu" aria-labelledby="more-dropdown">
                {value.subNav.map((subValue, i) => (
                  <SubLinkItem
                    title={t(subValue.title)}
                    url={subValue.path}
                    key={i}
                  />
                ))}
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default NavMenu;
