import Link from "next/link";
import React, { useState } from "react";
import fbimage from "../../../public/assets/img/icons/FB.svg";
import GoogleIcon from "../../../public/assets/img/icons/GoogleIcon.svg";
import { useFormik } from "formik";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import CustomToastContainer from "@/components/common/CustomToastContainer";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toast.utils";
import { useDispatch } from "react-redux";
import { setAuthData, setUserType } from "@/redux/reducers/auth";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import { ThreeDots } from "react-loader-spinner";
import useValidationSchemas from "../validation/FormValidation.utils";

const Login = () => {
  const router = useRouter();
  const [showPass, setshowPass] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { LoginValidationSchema } = useValidationSchemas();
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      const useRef = query(
        collection(db, "User"),
        where("uid", "==", result.user.uid)
      );
      try {
        const querySnapshot = await getDocs(useRef);
        if (querySnapshot.empty) {
          const UserRef = doc(db, "User", result.user.uid);
          await setDoc(UserRef, {
            uid: result.user.uid,
            email: result.user.email,
            isEmailVerfied: true,
            isActive: true,
            user_types: "User",
            photo_url: result.user.photoURL,
            display_name: result.user.displayName,
            phone_number: result.user.phoneNumber,
          });
          dispatch(setAuthData(result.user.uid));
          dispatch(setUserType("User"));
          toast.success(`${t("Login Successfully")}`, toastConfig.success);
          setTimeout(() => {
            router.push("/dashboard/profile", "/dashboard/profile", {
              locale: router?.locale,
            });
          }, 2000);
        } else {
          dispatch(setAuthData(result.user.uid));
          dispatch(setUserType("User"));
          toast.success(`${t("Login Successfully")}`, toastConfig.success);
          setTimeout(() => {
            router.push("/dashboard/profile", "/dashboard/profile", {
              locale: router?.locale,
            });
          }, 2000);
        }
      } catch (error) {
        toast.error(`${t(error.message)}`);
      }
    });
  };

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        //console.log("result=====>", result.user.uid);
        dispatch(setAuthData(result.user.uid));
        toast.success(`${t("Login Successfully")}`, toastConfig.success);
        setTimeout(() => {
          router.push("/dashboard/profile", "/dashboard/profile", {
            locale: router?.locale,
          });
        }, 3000);
      })
      .catch((err) => {
        toast.error(`${t(err.message)}`);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginValidationSchema,
    onSubmit: (values) => {
      setLoading(true);
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userresult) => {
          const userdocRef = doc(db, "User", userresult.user.uid);
          const userdocSnap = await getDoc(userdocRef);
          if (userdocSnap.exists()) {
            const userdata = userdocSnap.data();
            if (userdata.user_types == "User") {
              if (userdata.isActive && userdata.isEmailVerfied) {
                dispatch(setAuthData(userresult.user.uid));
                dispatch(setUserType(userdata.user_types));
                toast.success(
                  `${t("Login Successfully")}`,
                  toastConfig.success
                );
                setTimeout(() => {
                  router.push("/dashboard/profile", "/dashboard/profile", {
                    locale: router?.locale,
                  });
                }, 2000);
              } else {
                console.log(error);
                toast.error(
                  `${t(
                    "Your Account will be Not Verify please verify your account"
                  )}`,
                  toastConfig.error
                );
                setLoading(false);
              }
            } else {
              console.log(error);
              toast.error(
                `${t("Please Login with User Login Credentials")}`,
                toastConfig.error
              );
              setLoading(false);
            }
          } else {
            toast.error(
              `${t("Please Enter valid email and Password")}`,
              toastConfig.error
            );
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.code == "auth/wrong-password") {
            toast.error(
              `${t("Please Enter valid Password")}`,
              toastConfig.error
            );
            setLoading(false);
          } else {
            console.log(error);
            toast.error(`${t("Please Enter valid email")}`, toastConfig.error);
            setLoading(false);
          }
        });
    },
  });

  return (
    <>
      <section className="login-section  sec-m-tb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="custom-title text-center">{t("Login")}</h2>
            </div>

            <form id="loginForm" onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-12 mb-25 p-0">
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
                    {formik.errors.email && formik.touched.email && (
                      <span className="input-error mt-3">
                        {formik.errors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-12 mb-15 p-0">
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
                      {formik.errors.password && formik.touched.password && (
                        <span className="input-error mt-3">
                          {formik.errors.password}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-2 p-0">
                  <div className="add-basket-button">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
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
                        `${t("login")}`
                      )}
                    </button>
                  </div>
                </div>

                <div className="col-md-12 mb-25">
                  <div className="forgot-password text-right">
                    <Link href="/auth/forgotpass">{t("Forgot Password")}?</Link>
                  </div>
                </div>
                <div className="col-12 mt-2 px-0">
                  <div className="social-login">
                    <div className="heading-s position-relative text-center">
                      <h2 className="d-inline-block bg-white">or</h2>
                      <div className="b-tb"></div>
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-2 p-0">
                  <div className="add-basket-button ">
                    <Link
                      href="/auth/registration"
                      className="btn btn-primary w-100"
                      tabIndex="0"
                    >
                      {t("Register")}
                    </Link>
                  </div>
                </div>
              </div>
            </form>

            <div className="col-md-12 social-login-btns w-100 d-flex">
              <div className="w-100">
                <div className="add-btn-login-ss">
                  <div
                    className="btn btn-fb"
                    tabIndex="0"
                    onClick={signInWithFacebook}
                  >
                    <img src={fbimage.src} className="img-fluid" />
                    {t("Facebook")}
                  </div>
                </div>
              </div>
              <div className="w-100">
                <div className="add-btn-login-ss">
                  <div
                    className="btn btn-google"
                    tabIndex="0"
                    onClick={signInWithGoogle}
                  >
                    <img src={GoogleIcon.src} className="img-fluid" />
                    {t("Google")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CustomToastContainer />
    </>
  );
};

export default Login;
