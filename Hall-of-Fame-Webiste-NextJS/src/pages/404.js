import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import React from "react";

const Error404 = () => {
  const { t } = useTranslation();
  return (
    <div className="notfound-container">
      <img src="/assets/oops.png" alt="not-found-img" className="oops-img" />
      <h1>
        {t("You're looking for something that doesn't actually exist...")}
      </h1>
      <Link href="/" className="btn backto-btn">
        {t("Back to homepage")}
      </Link>
    </div>
  );
};

Error404.getLayout = (page) => page;

export default Error404;
