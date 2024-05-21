import ImageUploader from "@/components/common/ImageUploader";
import PhoneInput from "@/components/common/PhoneInput";
import AddressModal from "@/components/common/map-model";
import useTranslation from "@/hooks/useTranslation";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

const UserProfileEdit = ({ formik, loading }) => {
  const { t } = useTranslation();
  return (
    <div className="col-lg-9 col-md-8">
      <form id="editProfileForm" onSubmit={formik.handleSubmit}>
        <div className="row profile-inputs ">
          <ImageUploader
            imageTitle="Update Your Display Picture"
            value={formik.values.imageUrl}
            isProfile={false}
            inputName="image"
            formik={formik}
          />
          <span className="input-error mt-3">{formik.errors.imageUrl}</span>

          <div className="col-12 mb-25">
            <div className="input-style">
              <label htmlFor="first-box">
                {t("Full Name")} <span>*</span>
              </label>
              <input
                type="text"
                className="ctm-input"
                id="name"
                placeholder="e.g John"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            <span className="input-error mt-3">{formik.errors.name}</span>
            <div className="input-style">
              <label htmlFor="mail-box">
                {t("Email")} <span>*</span>
              </label>
              <input
                type="email"
                className="ctm-input"
                name="email"
                id="email"
                placeholder="johndoe@example.com"
                readOnly
                value={formik.values.email}
              />
            </div>
            <span className="input-error mt-3">{formik.errors.email}</span>

            <PhoneInput formik={formik} />
            {/* <span className="input-error mt-3">
              {formik.errors.phoneNumber}
            </span> */}

            <div className="input-style mb-23">
              <AddressModal formik={formik} />
            </div>
            <button
              type="submit"
              className="btn btn-primary update-btn w-100"
              tabIndex="0"
            >
              {loading ? (
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
                `${t("Update Profile")}`
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileEdit;
