import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const LinkItem = ({ className, title, url }) => {
  return (
    <li className="navigation-list-item">
      <Link className={`navigation-list-item-link ${className}`} href={url}>
        {title}
      </Link>
    </li>
  );
};

export const SubLinkItem = ({ title, url }) => {
  return (
    <Link className="dropdown-item" href={url}>
      {title}
    </Link>
  );
};

export const FooterLinkItem = ({ title, url }) => {
  return (
    <li className="footer-nav-item">
      <Link className="footer-nav-link" href={url}>
        {title}
      </Link>
    </li>
  );
};

export const SocialLinkItem = ({ className, url }) => {
  return (
    <Link href={url} target="_blank">
      <i
        className={`${className} d-flex align-items-center justify-content-center`}
      ></i>
    </Link>
  );
};

export const SideNavItem = ({ classname, url, title }) => {
  return (
    <li
      className={`nav-item ${
        classname
      }`}
    >
      <Link href={url} className="nav-link">
        {title}
      </Link>
    </li>
  );
};
