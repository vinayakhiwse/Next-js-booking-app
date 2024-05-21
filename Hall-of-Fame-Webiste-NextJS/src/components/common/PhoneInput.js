import { PhoneCodes } from "@/constants/PhoneCode";
import useTranslation from "@/hooks/useTranslation";
import Script from "next/script";
import React, { useEffect, useRef } from "react";

const PhoneInput = ({ formik }) => {
  const selectRef = useRef(null);
  const { t } = useTranslation();
  useEffect(() => {
    $(selectRef.current).select2({
      placeholder: $(selectRef.current).data("placeholder"),
    });

    $(".js-example-basic-single").on("select2:select", function (e) {
      const selectedValue = e.params.data.id;
      formik.setFieldValue("phoneCode", selectedValue);
    });
  }, [formik.values]);

  return (
    <>
      <div className="input-style mb-23 phone-mar w-100">
        <label className="d-block">
          {t("Phone number")}
          <span className="text-danger">*</span>
        </label>
        <div className="phone-input-select-main">
          <div className="custom-selct-icons-arow position-relative">
            <img
              src="/assets/img/icons/dropdown.png"
              className="img-fluid arrow-abs"
            />
            <select
              className="js-example-basic-single"
              name="phoneCode"
              id="phoneCode"
              ref={selectRef}
              value={formik.values.phoneCode} // Set initial value from formik values
              // value={formik.values.phoneCode}
            >
              {PhoneCodes.map((code, i) => (
                <option value={code} key={i}>
                  ({code})
                </option>
              ))}
            </select>
          </div>
          <div className="input-style1 w-100">
            <input
              type="tel"
              minLength="9"
              maxLength="12"
              dir="ltr"
              name="phoneNumber"
              placeholder="895632542"
              className="form-control login-inputs"
              id="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
          </div>
        </div>
        <span className="input-error mt-3">{formik.errors.phoneNumber}</span>
      </div>

      <Script>
        {`
          $(document).ready(function() {
            $('.js-example-basic-single').select2({
              placeholder: $(this).data('placeholder'),
            });
          });
        `}
      </Script>
    </>
  );
};

export default PhoneInput;
