import CustomToastContainer from "@/components/common/CustomToastContainer";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { auth, db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import useValidationSchemas from "@/pages/validation/FormValidation.utils";
import { toastConfig } from "@/utils/toast.utils";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useFormik } from "formik";
import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const {ForgotPassValidationSchema} = useValidationSchemas();
  const [showPass, setshowPass] = useState(false);
  const [showPassConfirm, setshowPassConfirm] = useState(false);
  const [showNewPass, setshowNewPass] = useState(false);
  const { AuthId } = useSelector((state) => state.AuthData);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: ForgotPassValidationSchema,
    onSubmit: async (values) => {
      const userRef = doc(db, "User", AuthId);
      const data = await getDoc(userRef);
      if (values.password == values.confirmPassword) {
        setLoading(true);
        signInWithEmailAndPassword(auth, data.data().email, values.oldPassword)
          .then((userCredential) => {
            const user = userCredential.user;
            updatePassword(user, values.confirmPassword)
              .then(() => {
                toast.success(
                  `${t("Password updated successfully")}`,
                  toastConfig.success
                );
                setLoading(false);
                formik.setValues({
                  oldPassword: "",
                  password: "",
                  confirmPassword: "",
                });
              })
              .catch((error) => {
                toast.error(
                  `${t("Something Happend wrong please try after some type")}`,
                  toastConfig.error
                );
                setLoading(false);
              });
          })
          .catch((error) => {
            if (error.code == "auth/wrong-password") {
              toast.error(
                `${t("Please Enter valid Password")}`,
                toastConfig.error
              );
              setLoading(false);
            }
          });
      } else {
        toast.error(`${t("Password not matched.")}`, toastConfig.error);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <section className="add-address-cont">
        <form id="changePasswordForm" onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-12">
              <p className="change-pswd">{t("Reset Password")}</p>

              <div className="mb-15">
                <div className="input-style">
                  <div className="type-pass">
                    <label htmlFor="pswd-box">
                      {t("Old Password")} <span>*</span>
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      id="password"
                      name="oldPassword"
                      className="ctm-input"
                      placeholder="********"
                      value={formik.values.oldPassword}
                      onChange={formik.handleChange}
                    />
                    <div
                      className="icon-eye d-flex align-items-center justify-content-center"
                      onClick={() => setshowPass(!showPass)}
                    >
                      <i className="fas fa-eye-slash"></i>
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <span className="input-error mt-3">
                        {formik.errors.password}
                      </span>
                    )}
                  </div>
                </div>
                <div className="input-style">
                  <div className="type-pass">
                    <label htmlFor="pswd-box">
                      {t("New Password")} <span>*</span>
                    </label>
                    <input
                      type={showNewPass ? "text" : "password"}
                      id="password"
                      name="password"
                      className="ctm-input"
                      placeholder="********"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                    <div
                      className="icon-eye d-flex align-items-center justify-content-center"
                      onClick={() => setshowNewPass(!showNewPass)}
                    >
                      <i className="fas fa-eye-slash"></i>
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <span className="input-error mt-3">
                        {formik.errors.password}
                      </span>
                    )}
                  </div>
                </div>
                <div className="input-style">
                  <div className="type-pass">
                    <label htmlFor="pswd-box">
                      {t("Confirm Password")} <span>*</span>
                    </label>
                    <input
                      type={showPassConfirm ? "text" : "password"}
                      id="confirmPass"
                      name="confirmPassword"
                      className="ctm-input"
                      placeholder="********"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                    />
                    <div
                      className="icon-eye d-flex align-items-center justify-content-center"
                      onClick={() => setshowPassConfirm(!showPassConfirm)}
                    >
                      <i className="fas fa-eye-slash"></i>
                    </div>
                    <span className="input-error mt-3">
                      {formik.errors.confirmPassword}
                    </span>
                  </div>
                </div>
              </div>

              <div className="save-address-btn w-100">
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
            </div>
          </div>
        </form>
      </section>
      <CustomToastContainer />
    </>
  );
};

const ChangePasswordPage = () => (
  <DashboardLayout>
    <ChangePassword />
  </DashboardLayout>
);

export default ChangePasswordPage;
