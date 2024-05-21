import React from "react";
import { UserNavigation } from "@/navigations";
import { SideNavItem } from "./LinkItem";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

const SideNavigation = () => {
  const { pathname } = useRouter();
  const { t } = useTranslation();
  return (
    <div className="col-md-4 col-lg-3 pr-3 mb-3 mb-md-0">
      <ul className="nav-left-mt-a nav flex-column pb-2 dashboard-adjust">
        {UserNavigation().map((value, i) => (
          <SideNavItem
            title={t(value.title)}
            url={value.path}
            key={i}
            classname={
              (pathname == value.path || pathname == value.subpath) && "active"
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default SideNavigation;
