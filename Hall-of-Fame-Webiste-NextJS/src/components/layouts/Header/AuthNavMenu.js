import { SubLinkItem } from "@/components/common/LinkItem";
import useTranslation from "@/hooks/useTranslation";
import { UserNavigation } from "@/navigations";
import React from "react";

export const UserNavMenu = () => {
  const { t } = useTranslation();
  return (
    <div
      className="dropdown-menu profile-dropdown"
      aria-labelledby="profile-drop"
    >
      {UserNavigation().map((value, i) => (
        <SubLinkItem title={t(value.title)} url={value.path} key={i} />
      ))}
    </div>
  );
};
