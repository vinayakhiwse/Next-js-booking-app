import useTranslation from "@/hooks/useTranslation";
import ContactUsForm from "@/views/form/contact-us";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const ContactUs = () => {
  const { staticdata } = useSelector((state) => state.SiteData);
  const { t } = useTranslation();
  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="contact-container">
              <h2>{t("Lets get in touch!")}</h2>
              <div className="contact-details">
                <div className="phone">
                  <Link href={`tel:${staticdata.phno}`}>
                    <i className="fas fa-phone-alt f-icon d-flex align-items-center justify-content-center"></i>
                  </Link>
                  <p>
                    {t("Phone")}:{" "}
                    <Link href={`tel:${staticdata.phno}`}>
                      {staticdata.phno}
                    </Link>
                  </p>
                </div>
                <div className="mail">
                  <Link href={`mailto:${staticdata?.email}`}>
                    <i className="fas fa-envelope f-icon d-flex align-items-center justify-content-center"></i>
                  </Link>
                  <p>
                    {t("Email")}:{" "}
                    <Link href={`mailto:${staticdata?.email}`}>
                      {staticdata?.email}
                    </Link>
                  </p>
                </div>
                <div className="address">
                  <Link
                    href={`https://www.google.com/maps/dir//${staticdata?.latitude},${staticdata?.longitude}/@%20${staticdata?.latitude},${staticdata?.longitude},12z`}
                    target="__blank"
                  >
                    <i className="fas fa-map-marker-alt f-icon d-flex align-items-center justify-content-center"></i>
                  </Link>
                  <p>
                    {t("Address")}:{" "}
                    <Link
                      target="__blank"
                      href={`https://www.google.com/maps/dir//${staticdata?.latitude},${staticdata?.longitude}/@%20${staticdata?.latitude},${staticdata?.longitude},12z`}
                    >
                      {staticdata?.address}
                    </Link>
                  </p>
                </div>
              </div>

              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232920.73294410174!2d55.60678267613093!3d24.19324132119459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8ab145cbd5a049%3A0xf56f8cea5bf29f7f!2sAl%20Ain%20-%20Abu%20Dhabi%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1649742381868!5m2!1sen!2s"
                  style={{ border: 0 }}
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <ContactUsForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
