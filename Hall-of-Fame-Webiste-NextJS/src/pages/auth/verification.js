import CustomToastContainer from "@/components/common/CustomToastContainer";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import { setAuthData } from "@/redux/reducers/auth";
import { toastConfig } from "@/utils/toast.utils";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useValidationSchemas from "../validation/FormValidation.utils";

const Verification = () => {
  const { AuthId } = useSelector((state) => state.AuthData);
  const { t } = useTranslation();
  const { OtpValidationSchema } = useValidationSchemas();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: OtpValidationSchema,
    onSubmit: async (value) => {
      setLoading(true);
      const userRef = doc(db, "User", AuthId.userid);
      if (AuthId.otp == value.otp) {
        updateDoc(userRef, {
          isEmailVerfied: true,
          isActive: true,
          otp: deleteField(),
        }).then(() => {
          dispatch(setAuthData(AuthId.userid));
          toast.success(
            `${t("Registration Successfully")}`,
            toastConfig.success
          );
          setTimeout(() => {
            router.push("/dashboard/profile", "/dashboard/profile", {
              locale: router?.locale,
            });
          }, 2000);
        });
      } else {
        toast.error(`${t("Invalid Otp")}`, toastConfig.error);
        setLoading(false);
      }
    },
  });

  const handleReset = async () => {
    const response = await fetch("/api/emailSend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: AuthId.email,
        receiverName: AuthId.name,
      }),
    });
    const res = await response.json();
    if (res.status == 200) {
      const userRef = doc(db, "User", AuthId.userid);
      updateDoc(userRef, {
        otp: res.code,
      }).then(() => {
        dispatch(
          setAuthData({
            ...AuthId,
            otp: res.code,
          })
        );
        toast.success(`${t("Otp send Successfully")}`, toastConfig.success);
      });
    } else {
      toast.error(`${t("Invalid Otp sending")}`, toastConfig.error);
    }
  };

  return (
    <>
      <section className="login-section sec-m-tb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="custom-title-forget text-center">
                {t("Enter Verification Code")}
                <p>
                  {t("Please enter the verification code you received at")}
                  <br />
                  {AuthId?.email}
                </p>
              </h2>
            </div>
            <form
              id="verificationForm"
              className="set-pad"
              onSubmit={formik.handleSubmit}
            >
              <div className="row w-100">
                <div className="col-12 mb-25">
                  <div className="input-style">
                    <label htmlFor="mail-box">
                      {t("Code")} <span>*</span>
                    </label>
                    <input
                      type="text"
                      className="ctm-input"
                      name="otp"
                      id="otp"
                      value={formik.values.otp}
                      onChange={formik.handleChange}
                      placeholder="12345"
                    />
                  </div>
                  {formik.errors.otp && formik.touched.otp && (
                    <span className="input-error mt-3">
                      {formik.errors.otp}
                    </span>
                  )}
                </div>

                <div className="col-12 mb-2">
                  <div className="add-basket-button">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
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
                        `${t("Submit")}`
                      )}
                    </button>
                  </div>
                  <p className="resend-link verify-btn-resend">
                    {t("Did not receive the code")}?
                    <span
                      style={{ color: "black", fontWeight: 600 }}
                      onClick={handleReset}
                    >
                      {t("Resent")}
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <CustomToastContainer />
    </>
  );
};

export default Verification;
