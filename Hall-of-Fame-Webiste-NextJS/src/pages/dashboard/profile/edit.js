import CustomToastContainer from "@/components/common/CustomToastContainer";
import AddressModal from "@/components/common/map-model";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import useValidationSchemas, {
  valid,
} from "@/pages/validation/FormValidation.utils";

import { imageUploading } from "@/utils/firebaseutils";
import { toastConfig } from "@/utils/toast.utils";
import UserProfileEdit from "@/views/form/User/UserProfileEdit";
import { GeoPoint, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useFormik } from "formik";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { AuthId } = useSelector((state) => state.AuthData);
  const [modalShow, setModalShow] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { EditProfileValidationSchema } = useValidationSchemas();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      cordinate: {
        lat: 31.47262121035523,
        lng: 74.27061450209968,
      },
      address: "",
      imageUrl: "",
      imageFile: "",
      phoneCode: "+91",
      phoneNumber: "",
    },
    validationSchema: EditProfileValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      if (values.imageFile) {
        values.imageUrl = await imageUploading(
          `user/${AuthId}/uploads/`,
          values.imageFile
        );
      }

      setDoc(
        doc(db, "User", AuthId),
        {
          email: values.email,
          display_name: values.name,
          geoLocation: new GeoPoint(values.cordinate.lat, values.cordinate.lng),
          address: values.address,
          photo_url: values.imageUrl,
          phone_number: values.phoneCode + values.phoneNumber,
        },
        { merge: true }
      ).then(() => {
        toast.success(
          `${t("Profile update successfully")}`,
          toastConfig.success
        );
        setLoading(false);
        setTimeout(() => {
          router.push("/dashboard/profile", "/dashboard/profile", {
            locale: router?.locale,
          });
        }, 2000);
      });
    },
  });

  const fetchUserData = async () => {
    const docRef = doc(db, "User", AuthId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      let parsedPhoneNumber;
      if (userData.phone_number) {
        parsedPhoneNumber = parsePhoneNumberFromString(userData.phone_number);
      }

      formik.setValues({
        name: userData.display_name,
        email: userData.email,
        phoneCode: `+${parsedPhoneNumber?.countryCallingCode}`,
        phoneNumber: parsedPhoneNumber?.nationalNumber,
        address: userData?.address,
        cordinate: {
          lat: userData.geoLocation?._lat,
          lng: userData.geoLocation?._long,
        },
        imageUrl: userData?.photo_url,
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <UserProfileEdit
        formik={formik}
        loading={loading}
        setModalShow={setModalShow}
      />

      <CustomToastContainer />
    </>
  );
};

const UpdateProfilePage = () => (
  <DashboardLayout>
    <UpdateProfile />
  </DashboardLayout>
);

export default UpdateProfilePage;
