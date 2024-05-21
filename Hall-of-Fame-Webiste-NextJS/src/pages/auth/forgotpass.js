import CustomToastContainer from "@/components/common/CustomToastContainer";
import { auth } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import { toastConfig } from "@/utils/toast.utils";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";


const forgotpass = () => {
  const { ForgotPassValidationSchema } = useValidationSchemas();
  const router = useRouter();
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPassValidationSchema,
    onSubmit: (values) => {
      fetchSignInMethodsForEmail(auth, values.email).then((method) => {
        if (method.length) {
          sendPasswordResetEmail(auth, values.email)
            .then(() => {
              toast.success(
                `${t("Forgot password link send successfully")}`,
                toastConfig.success
              );
              setTimeout(() => {
                router.push("/auth/login", "/auth/login", {
                  locale: router?.locale,
                });
              }, 2000);
            })
            .catch((e) => {
              toast.error(
                `${t("Something Happend wrong please try after some type")}`,
                toastConfig.error
              );
            });
        } else {
          toast.error(
            `${t("This email id is not exist plaese check emaill id")}`,
            toastConfig.error
          );
        }
      });
    },
  });

  return (
    <>
      <section className="login-section sec-m-tb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="custom-title-forget text-center">
                {t("Forgot Password")}
                <p>{t("Enter your email address to recover password")}</p>
              </h2>
            </div>
            <form
              id="forgotForm"
              className="w-100"
              onSubmit={formik.handleSubmit}
            >
              <div className="row w-100">
                <div className="col-12 mb-25">
                  <div className="input-style">
                    <label htmlFor="mail-box">
                      {t("Email")} <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="ctm-input"
                      id="email"
                      placeholder="johndoe@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.email && formik.touched.email && (
                      <span className="input-error mt-3">
                        {formik.errors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-12 mb-2">
                  <div className="add-basket-button">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      tabIndex="0"
                    >
                      {t("Submit")}
                    </button>
                  </div>
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

export default forgotpass;
