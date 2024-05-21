import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const LanguageSelector = () => {
  const router = useRouter();

  useEffect(() => {
    let dir = router?.locale == "ar" ? "rtl" : "ltr";
    document.body.classList.add(dir);
    document.querySelector("body").setAttribute("class", dir);
    document.querySelector("html").setAttribute("lang", router?.locale);
  }, [router?.locale]);

  return (
    <div className="dropdown">
      <div
        className="lang-btn"
        role="button"
        id="dropdownMenuLink"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="curncy-text px-10">
          {router?.locale == "ar" ? "Ar" : "En"}
        </span>
          <MdKeyboardArrowDown fontSize={20} />
      </div>

      <div
        className="dropdown-menu"
        aria-labelledby="dropdownMenuLink"
        x-placement="bottom-start"
      >
        <Link href={router.asPath} locale="en" className="dropdown-item">
          English
        </Link>
        <Link href={router.asPath} locale="ar" className="dropdown-item">
          عربي
        </Link>
      </div>
    </div>
  );
};

export default LanguageSelector;
