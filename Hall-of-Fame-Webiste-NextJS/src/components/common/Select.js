import Script from "next/script";
import React from "react";

const Select = ({ lable, options, id, name }) => {
  return (
    <>
      <div className="input-style mb-dropdown">
        <label for={id}>
          {lable} <span>*</span>
        </label>
        <div className="custom-selct-icons-arow position-relative">
          <img
            src="/assets/img/icons/DropdownIcon.svg"
            className="img-fluid arrow-abs"
          />
          <select className="js-example-basic-single ctm-input" name={name} id={id}>
            <option value=""></option>
            <option>Surat</option>
          </select>
        </div>
        {/* error */}
      </div>

      <Script>
        {`
            $('.js-example-basic-single').select2({
                placeholder: $(this).data('placeholder'),
            })
            $('#category-box').select2({
                placeholder: "Select Category",
            })
            $('#sub-box').select2({
                placeholder: "Select Subcategory",
            })
            $('#city-box').select2({
                placeholder: "Select City",
            })
        `}
      </Script>
    </>
  );
};

export default Select;
