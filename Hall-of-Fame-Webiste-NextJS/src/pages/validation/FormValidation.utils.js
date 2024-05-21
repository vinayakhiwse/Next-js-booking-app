import useTranslation from "@/hooks/useTranslation";
import * as yup from "yup";
const useValidationSchemas = () => {
  const { t } = useTranslation();
  const LoginValidationSchema = yup.object({
    email: yup
      .string()
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        t("Please enter valid email")
      )
      .required(t("email is required")),
    password: yup
      .string()
      .min(6, t("password must be 6 character"))
      .required(t("password is required")),
  });
  const RegistrationValidationSchema = yup.object({
    name: yup.string().required(t("Full Name is required")),
    address: yup.string().required(t("Address is required")),
    imageUrl: yup.string().required(t("Image is required")),
    email: yup
      .string()
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        t("Please enter valid email")
      )
      .required(t("email is required")),
    password: yup
      .string()
      .min(6, t("password must be 6 character"))
      .required(t("password is required")),
    confirmPass: yup
      .string()
      .min(6, t("Confirm Pass must be 6 character"))
      .required(t("Confirm Pass is required")),
    isChecked: yup
      .boolean()
      .oneOf([true], t("You must accept the terms and conditions")),
  });
  const EditProfileValidationSchema = yup.object({
    name: yup.string().required(t("Full Name is required")),
    address: yup.string().required(t("Address is required")),
    imageUrl: yup.string().required(t("Image is required")),
    email: yup
      .string()
      .matches(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        t("Please enter valid email")
      )
      .required(t("email is required")),
    phoneNumber: yup.string().required(t("Phone Number is required")),
  });
  const OtpValidationSchema = yup.object({
    otp: yup
      .number()
      .min(6, t("OTP must be 6 digit"))
      .required(t("Otp is required")),
  });
  const ForgotPassValidationSchema = yup.object({
    oldPassword: yup
      .string()
      .min(6, t("password must be 6 character"))
      .required(t("password is required")),
    password: yup
      .string()
      .min(6, t("password must be 6 character"))
      .required(t("password is required")),
    confirmPassword: yup
      .string()
      .min(6, t("Confirm Pass must be 6 character"))
      .required(t("Confirm Pass is required")),
  });
  const ManageAddressValidationSchema = yup.object({
    name: yup.string().required(t("Address Name is required")),
    building: yup.string().required(t("Building Number is required")),
    address: yup.string().required(t("Address is required")),
    phoneNumber: yup.string().required(t("Phone Number is required")),
  });
  const SlotBookingValidation = yup.object({
    booking_Date: yup.string().required(t("Please select slot date.")),
    bookingSlots: yup
      .array()
      .of(
        yup.object().shape({
          day: yup.string().required(t("Please select a day.")),
          times: yup
            .array()
            .of(yup.string())
            .required(t("Please select slot time.")),
        })
      )
      .required(t("Please select at least one slot.")),
    bookingNotes: yup.string().required(t("Please fill booking note.")),
  });
  const validationSchemaContactUs = yup.object().shape({
    option: yup.string().required(t("This field is Required")),
    name: yup.string().required(t("This field is Required")),
    email: yup
      .string()
      .email(t("invalid Email"))
      .required(t("This field is Required")),
    comment: yup.string().required(t("This field is Required")),
  });
  return {
    LoginValidationSchema,
    validationSchemaContactUs,
    SlotBookingValidation,
    ManageAddressValidationSchema,
    ForgotPassValidationSchema,
    OtpValidationSchema,
    EditProfileValidationSchema,
    RegistrationValidationSchema,
  };
};

export default useValidationSchemas;
