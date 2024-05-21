import CustomToastContainer from "@/components/common/CustomToastContainer";
import Ratings from "@/components/common/Ratings";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import { toastConfig } from "@/utils/toast.utils";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const ServiceDetail = () => {
  const { AuthId } = useSelector((state) => state.AuthData);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const {
    query: { serviceId },
    locale,
  } = useRouter();
  const [ServiceDetail, setServiceDetail] = useState({});

  const FetchServiceDetail = async () => {
    try {
      const docRef = doc(db, "Service", serviceId);
      setLoading(true);
      const querySnapshot = await getDoc(docRef);
      const docData = querySnapshot.data();
      if (docData?.celebrity_user) {
        docData.celebrity_user = (await getDoc(docData?.celebrity_user)).data();
      }
      if (docData?.category) {
        docData.category = (await getDoc(docData?.category)).data();
      }
      if (docData?.city) {
        docData.city = (await getDoc(docData?.city)).data();
      }

      const convertedImages = docData?.image?.map((imageUrl) => ({
        original: imageUrl,
        thumbnail: imageUrl,
      }));
      setServiceDetail({
        description: docData?.description,
        description_ar: docData?.description_ar,
        name: docData?.name,
        name_ar: docData?.name_ar,
        price: docData?.price,
        image: convertedImages,
        city: docData?.city,
        discount: docData?.discount,
        celebrity_user: {
          email: docData?.celebrity_user?.email,
          display_name: docData?.celebrity_user?.display_name,
          phone_number: docData?.celebrity_user?.phone_number,
          photo_url: docData?.celebrity_user?.photo_url,
          review: docData?.celebrity_user?.review,
        },
      });
      setLoading(false);
    } catch (error) {
      console.log("fetching Service detail", error);
    }
  };
  useEffect(() => {
    FetchServiceDetail();
  }, []);

  const copyToClipboard = () => {
    const fullUrl = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard
      .writeText(fullUrl)
      .then(() =>
        toast.success(`${t("Url Copied Successfully")}`, toastConfig.success)
      )
      .catch((error) =>
        toast.error(`${t("Url not copied")}`, toastConfig.error)
      );
  };

  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {loading ? (
              <Rings
                height="120"
                width="120"
                color="#C2C0D5"
                radius="6"
                wrapperStyle={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                wrapperClass=""
                visible={loading}
                ariaLabel="rings-loading"
              />
            ) : (
              <>
                <div className="service-det-cont">
                  <div className={locale == "en" ? "mr-3" : "ml-3"}>
                    {ServiceDetail.image ? (
                      <ImageGallery
                        items={ServiceDetail?.image}
                        showNav={false}
                        showThumbnails={true}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        className="prod-gallery-box position-relative"
                      />
                    ) : null}
                  </div>

                  <div className="podcast-service">
                    <div className="celeb-serv-det">
                      <div className="name-msg">
                        <div className="right-name">
                          <h2>
                            {locale == "en"
                              ? ServiceDetail.name
                              : ServiceDetail.name_ar}
                          </h2>
                          <p>
                            {t("Price")}:
                            {ServiceDetail?.discount > 0 ? (
                              <span className="price">
                                {ServiceDetail?.price -
                                  (ServiceDetail?.price *
                                    ServiceDetail?.discount) /
                                    100}
                                <span className="cutted">
                                  {ServiceDetail?.price}
                                </span>
                                {t("/hr")}
                              </span>
                            ) : (
                              <>
                                {ServiceDetail?.price > 0
                                  ? ServiceDetail?.price
                                  : `${t("Ask Price")}`}
                                <span className="back">
                                  {ServiceDetail?.price > 0
                                    ? `${t("/hr")}`
                                    : ""}
                                </span>
                              </>
                            )}
                          </p>
                          {ServiceDetail?.discount_percentage > 0 &&
                            ServiceDetail?.status ===
                              App.Constants.Status.APPROVED && (
                              <p>
                                {t("Offer Expiry Date")}:{" "}
                                <span className="date">
                                  {unixTODateformateForHuman(
                                    ServiceDetail?.offer_expiry_date
                                  )}
                                </span>
                              </p>
                            )}
                        </div>
                        <button
                          className="btn btn-primary msg-now-btn"
                          role="button"
                          id="sharedetails"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {t("Share")}
                        </button>
                        <div
                          className="dropdown-menu share-drop"
                          aria-labelledby="sharedetails"
                        >
                          <button type="button" className="btn service-url-btn">
                            {t("Service URL")}
                          </button>
                          <div className="cancel-copy">
                            <button type="button" className="btn cancel-btn">
                              {t("Cancel")}
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary copy-btn"
                              onClick={copyToClipboard}
                            >
                              {t("Copy Link")}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="service-detail-img">
                        <img
                          src={ServiceDetail?.celebrity_user?.photo_url}
                          alt="david-img"
                          className="davide-service-det"
                        />
                        <div className="right-service-detail">
                          <Ratings
                            total={ServiceDetail?.celebrity_user?.review}
                          />
                          <p className="c-name">
                            {ServiceDetail?.celebrity_user?.display_name}
                          </p>
                          <div className="contct">
                            <i className="fas fa-phone-alt f-icon "></i>
                            <p className="set-rtl">
                              <a href="tel:+2131233454365">
                                {ServiceDetail?.celebrity_user?.phone_number}
                              </a>
                            </p>
                          </div>
                          <div className="contct">
                            <i className="fas fa-envelope f-icon"></i>
                            <p className="mail">
                              <a href="mailto:brijesh.empiric@gmail.com">
                                {ServiceDetail?.celebrity_user?.email}
                              </a>
                            </p>
                          </div>
                          <div className="contct">
                            <i className="fas fa-map-marker-alt f-icon"></i>
                            <p>
                              <a
                                href="http://maps.google.com?q={{ $service?->celebrity?->latitude }},{{ $service?->celebrity?->longitude }}"
                                target="__blank"
                              >
                                {locale == "en"
                                  ? ServiceDetail?.city?.name
                                  : ServiceDetail?.city?.name_ar}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* if having price then */}
                    {ServiceDetail?.price ? (
                      <Link
                        href={
                          AuthId
                            ? `${`/booking-info/${serviceId}/booking`}`
                            : "/auth/login"
                        }
                        className="btn btn-primary schedule-btn"
                      >
                        {t("Schedule Booking")}
                      </Link>
                    ) : (
                      <Link
                        href={
                          AuthId
                            ? `/booking-info/${serviceId}/quotation`
                            : "/auth/login"
                        }
                        className="btn btn-primary schedule-btn"
                      >
                        {t("Quotation Request")}
                      </Link>
                    )}

                    {/* if not having price then */}
                  </div>
                </div>
                <div className="service-description">
                  <h2>{t("Description")}</h2>
                  <p>
                    {locale == "en"
                      ? ServiceDetail.description
                      : ServiceDetail.description_ar}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <CustomToastContainer />
    </section>
  );
};

export default ServiceDetail;
