import AddressModal from "@/components/common/map-model";
import { PageNameAndRoute } from "@/constants/PageTitle";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImageUploader from "@/components/common/ImageUploader";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/common/CustomToastContainer";
import { toastConfig } from "@/utils/toast.utils";
import {
  GeoPoint,
  Timestamp,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { imageUploading } from "@/utils/firebaseutils";
import { setAuthData } from "@/redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import { ThreeDots } from "react-loader-spinner";
import useValidationSchemas from "../validation/FormValidation.utils";

const getTitle = (path) => {
  return PageNameAndRoute.find((value) => value.path == path);
};

const RegisterAsUser = () => {
  const { pathname } = useRouter();
  const pagetitle = getTitle(pathname);
  const [modalShow, setModalShow] = useState(false);
  const [showPass, setshowPass] = useState(false);
  const [showPassConfirm, setshowPassConfirm] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [clientOS, setClientOS] = useState("");
  const { RegistrationValidationSchema } = useValidationSchemas();
  const handleCheckboxChange = (event) => {
    formik.setFieldValue("isChecked", event.target.checked);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPass: "",
      cordinate: {
        lat: 31.47262121035523,
        lng: 74.27061450209968,
      },
      address: "",
      imageUrl: "",
      imageFile: "",
      isChecked: false,
      phoneCode: "+91",
      phoneNumber: "",
      otp: "",
    },
    validationSchema: RegistrationValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      if (values.password === values.confirmPass) {
        const otpRes = await EmailOtpValidation(values.email, values.name);
        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            const AddressRef = doc(collection(db, "User", user.uid, "Address")); //creating subcollection referance here.
            setDoc(AddressRef, {
              address: values.address,
              created_at: serverTimestamp(),
              isDefault: true,
              name: "home",
              phno: values.phoneCode + values.phoneNumber,
              geoLocation: new GeoPoint(
                values.cordinate.lat,
                values.cordinate.lng
              ),
            }).then(() => {
              const DefaultRef = doc(
                db,
                "User",
                user.uid,
                "Address",
                AddressRef.id
              );
              imageUploading(
                `user/${user.uid}/uploads/`,
                values.imageFile
              ).then(async (firebase_url) => {
                setDoc(doc(db, "User", user.uid), {
                  operating_system: clientOS,
                  email: values.email,
                  otp: otpRes,
                  defulat_address: DefaultRef,
                  display_name: values.name,
                  geoLocation: new GeoPoint(
                    values.cordinate.lat,
                    values.cordinate.lng
                  ),
                  address: values.address,
                  photo_url: firebase_url,
                  phone_number: values.phoneCode + values.phoneNumber,
                  review: Number(0),
                  user_types: "User",
                  uid: user.uid,
                  isEmailVerfied: false,
                  isActive: false,
                  created_time: serverTimestamp(),
                }).then(() => {
                  dispatch(
                    setAuthData({
                      userid: user.uid,
                      email: values.email,
                      name: values.name,
                      otp: otpRes,
                    })
                  );
                  setTimeout(() => {
                    router.push("/auth/verification", "/auth/verification", {
                      locale: router?.locale,
                    });
                  }, 1000);
                });
              });
            });
          })
          .catch((error) => {
            toast.error(
              `${t("This Email is Already exists")}`,
              toastConfig.error
            );
          });
        setLoading(false);
      } else {
        toast.error(`${t("Password Not Matched")}`, toastConfig.error);
        setLoading(false);
      }
    },
  });

  const EmailOtpValidation = async (email, name) => {
    const response = await fetch("/api/emailSend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        receiverName: name,
      }),
    });
    const res = await response.json();
    return res.code;
  };

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    let os = "";
    if (userAgent.includes("Win")) {
      os = "Windows";
    } else if (userAgent.includes("Mac")) {
      os = "MacOS";
    } else if (userAgent.includes("Linux")) {
      os = "Linux";
    } else if (userAgent.includes("armv81")) {
      os = "Android";
    } else if (userAgent.includes("iOS")) {
      os = "iOS";
    } else {
      os = "Unknown";
    }
    setClientOS(os);
  }, []);

  return (
    <>
      <section className="login-section sec-m-tb ">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="custom-title text-center">{pagetitle.title}</h2>
              <form id="registerForm" onSubmit={formik.handleSubmit}>
                <div className="row">
                  <div className="col-12 mb-25 p-0">
                    <div className="input-style">
                      <label htmlFor="first-box">
                        {t("Full Name")} <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="ctm-input"
                        placeholder="e.g John"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />
                      <span className="input-error mt-3">
                        {formik.errors.name}
                      </span>
                    </div>

                    <div className="input-style">
                      <label htmlFor="mail-box">
                        {t("Email")} <span>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="ctm-input"
                        placeholder="johndoe@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                      <span className="input-error mt-3">
                        {formik.errors.email}
                      </span>
                    </div>

                    <PhoneInput formik={formik} />

                    <div className="input-style mb-23">
                      {/* <label className="d-block">
                        {t("Address")} <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative adress-icon-mainn">
                        <div
                          className="address-icon-cus address"
                          onClick={() => setModalShow(true)}
                        >
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <input
                          type="text"
                          className="ctm-input address"
                          placeholder="e.g Al-Ain"
                          name="address"
                          id="address"
                          value={formik.values.address}
                          readOnly
                        />
                      </div>
                      <span className="input-error mt-3">
                        {formik.errors.address}
                      </span> */}
                      <AddressModal formik={formik} />
                    </div>

                    <div className="mb-15">
                      <div className="input-style">
                        <div className="type-pass">
                          <label htmlFor="pswd-box">
                            {t("Password")} <span>*</span>
                          </label>
                          <input
                            type={showPass ? "text" : "password"}
                            id="password"
                            name="password"
                            className="ctm-input"
                            placeholder="********"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                          />
                          <div
                            className="icon-eye d-flex align-items-center justify-content-center"
                            onClick={() => setshowPass(!showPass)}
                          >
                            <i className="fas fa-eye-slash"></i>
                          </div>
                          <span className="input-error mt-3">
                            {formik.errors.password}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-15">
                      <div className="input-style">
                        <div className="type-pass">
                          <label htmlFor="pswd-box">
                            {t("Confirm Password")} <span>*</span>
                          </label>
                          <input
                            type={showPassConfirm ? "text" : "password"}
                            id="confirmPass"
                            name="confirmPass"
                            className="ctm-input"
                            placeholder="********"
                            value={formik.values.confirmPass}
                            onChange={formik.handleChange}
                          />
                          <div
                            className="icon-eye d-flex align-items-center justify-content-center"
                            onClick={() => setshowPassConfirm(!showPassConfirm)}
                          >
                            <i className="fas fa-eye-slash"></i>
                          </div>
                          <span className="input-error mt-3">
                            {formik.errors.confirmPass}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ImageUploader
                      imageTitle="Attach Your Display Picture"
                      value={formik.values.imageUrl}
                      isProfile={false}
                      inputName="image"
                      formik={formik}
                    />
                    <span className="input-error mt-3">
                      {formik.errors.imageUrl}
                    </span>

                    <div className="col-md-12 px-0">
                      <div className="remember-me for-space-us-check">
                        <label className="custom-check">
                          <input
                            type="checkbox"
                            required
                            name="terms_conditions"
                            checked={formik.values.isChecked}
                            onChange={handleCheckboxChange}
                          />
                          <span className="checkmark rounded"></span>
                        </label>
                        <div className="prvc">
                          {t("By Signing up, I agree to")}
                          <Link
                            href="/infopages/terms-and-conditions"
                            className="txt-black"
                            target="__blank"
                          >
                            {t("Terms & Conditions")}
                          </Link>
                          {t("and")}
                          <Link
                            href="/infopages/privacy-policy"
                            className="txt-black privacy-text"
                            target="__blank"
                          >
                            {t("Privacy Policy")}.
                          </Link>
                        </div>
                      </div>
                      <div className="terms_error input-style mt-1"></div>
                    </div>
                    <span className="input-error mt-3">
                      {formik.errors.isChecked}
                    </span>
                    <div className="fot-btn-main w-100 p-0">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 "
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
                          `${t("Register")}`
                        )}
                      </button>

                      <p className="not-a-member-p reset-password-link text-center mt-18">
                        {t("Already have an account")}?
                        <Link className="txt-black" href="/auth/login">
                          {t("Login Here")}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* <AddressModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        formik={formik}
      /> */}
      <CustomToastContainer />
    </>
  );
};

export default RegisterAsUser;
