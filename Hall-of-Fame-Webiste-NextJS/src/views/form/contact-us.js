import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import DropdownIcon from "../../../public/assets/img/icons/DropdownIcon.svg";
import useTranslation from "@/hooks/useTranslation";
import { useFormik } from "formik";

import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import useValidationSchemas from "@/pages/validation/FormValidation.utils";
import CustomToastContainer from "@/components/common/CustomToastContainer";
import { toast } from "react-toastify";

const ContactUsForm = () => {
  const { validationSchemaContactUs } = useValidationSchemas();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { staticdata } = useSelector((state) => state.SiteData);
  const selectRefs = useRef(null);

  const formik = useFormik({
    initialValues: {
      option: "",
      name: "",
      email: "",
      comment: "",
    },
    validationSchema: validationSchemaContactUs,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/contactEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            comment: values.comment,
            subject: values.option,
            footer_phone: staticdata.phno,
            footer_email: staticdata.email,
          }),
        });
        const data = await response.json();
        setIsLoading(false);
        if (data?.error) {
          setIsLoading(false);
          return toast.error(data?.error);
        } else {
          toast.success(t("Contact Email Sent Successfully"));
          formik.resetForm();
          setIsLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    $(selectRefs.current).select2({
      placeholder: $(selectRefs.current).data("placeholder"),
    });

    $(".js-example-basic-single").on("select2:select", function (e) {
      const selectedValue = e.params.data.id;
      formik.setFieldValue("option", selectedValue);
    });
  }, [formik.values]);

  return (
    <>
      <div className="contact-form">
        <h2>{t("Contact Us")}</h2>
        <form id="contact-form" onSubmit={formik.handleSubmit}>
          <div className="form">
            <div className="input-style mb-dropdown">
              <label htmlFor="category-box">
                {t("Subject")} <span>*</span>
              </label>
              <div className="custom-selct-icons-arow position-relative">
                <img src={DropdownIcon.src} className="img-fluid arrow-abs" />
                <select
                  className="js-example-basic-single ctm-input"
                  name="option"
                  id="category-box"
                  defaultValue=""
                  onBlur={formik.handleBlur}
                  ref={selectRefs}
                  value={formik.values.option}
                >
                  <option value="" disabled>
                    {t("Select Subject")}
                  </option>
                  <option value="feedback">Feedback</option>
                  <option value="suggestions">Suggestions</option>
                  <option value="complaints">Complaints</option>
                  <option value="inquiries">Inquiries</option>
                </select>
              </div>
              <span className="input-error mt-3">{formik.errors.option}</span>
            </div>
            <div className="input-style">
              <label htmlFor="mail-box">
                {t("Email")} <span>*</span>
              </label>
              <input
                type="email"
                className="ctm-input"
                id="mail-box"
                placeholder="e.g example@mail.com"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <span className="input-error mt-0">{formik.errors.email}</span>
            </div>
            <div className="input-style">
              <label htmlFor="first-box">
                {t("Name")}
                <span>*</span>
              </label>
              <input
                type="text"
                className="ctm-input"
                name="name"
                id="first-box"
                placeholder="e.g John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              <span className="input-error mt-0">{formik.errors.name}</span>
            </div>
            <div className="input-style">
              <label htmlFor="about-box">
                {t("Your Message")} <span>*</span>
              </label>
              <textarea
                name="comment"
                className="ctm-textarea"
                placeholder="Enter you message ..."
                id="about-box"
                cols="30"
                rows="10"
                aria-required="false"
                value={formik.values.comment}
                onChange={formik.handleChange}
              ></textarea>
              <span className="input-error mt-3">{formik.errors.comment}</span>
            </div>
            <div className="send-btn">
              <button
                type="submit"
                className="btn btn-primary w-100"
                tabIndex="0"
              >
                {isLoading ? (
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="white"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  `${t("Send Message")}`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <CustomToastContainer />
      <Script>{`$('.js-example-basic-single').select2({
            placeholder: $(this).data('placeholder'),
        })`}</Script>
    </>
  );
};

export default ContactUsForm;
