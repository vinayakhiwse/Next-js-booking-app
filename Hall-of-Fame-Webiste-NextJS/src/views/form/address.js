import CustomToastContainer from "@/components/common/CustomToastContainer";
import PhoneInput from "@/components/common/PhoneInput";
import AddressModal from "@/components/common/map-model";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import useValidationSchemas from "@/pages/validation/FormValidation.utils";
import { toastConfig } from "@/utils/toast.utils";
import {
  GeoPoint,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useFormik } from "formik";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddressForm = ({ AddressRef, form, setform }) => {
  const { AuthId } = useSelector((state) => state.AuthData);
  const { t } = useTranslation();
  const { ManageAddressValidationSchema } = useValidationSchemas();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      building: "",
      cordinate: {
        lat: 31.47262121035523,
        lng: 74.27061450209968,
      },
      address: "",
      phoneCode: "+91",
      phoneNumber: "",
    },
    validationSchema: ManageAddressValidationSchema,
    onSubmit: async (values) => {
      // Query to check if there are any existing addresses
      const addressSnapshot = await getDocs(AddressRef);
      const addressExists = addressSnapshot.empty;

      if (form.editId) {
        try {
          await updateDoc(doc(AddressRef, form.editId), {
            address: values.address,
            isDefault: false,
            name: values.name,
            phno: `${values.phoneCode + values.phoneNumber}`,
            geoLocation: new GeoPoint(
              values.cordinate.lat,
              values.cordinate.lng
            ),
            building: values.building,
          }).then(() => {
            toast.success(
              `${t("Address Updated Successfully!")}`,
              toastConfig.success
            );
            setform({
              open: false,
              editId: null,
            });
          });
        } catch (error) {
          console.log("Fetching edit detail", error);
        }
      } else {
        try {
          if (addressExists) {
            const newdoc = doc(AddressRef);
            setDoc(newdoc, {
              address: values.address,
              created_at: serverTimestamp(),
              isDefault: true,
              name: values.name,
              phno: `${values.phoneCode + values.phoneNumber}`,
              geoLocation: new GeoPoint(
                values.cordinate.lat,
                values.cordinate.lng
              ),
              building: values.building,
            }).then(() => {
              const updateRef = doc(db, "User", AuthId);
              updateDoc(updateRef, {
                defulat_address: doc(db, "User", AuthId, "Address", newdoc.id),
              }).then(() => {
                toast.success(
                  `${t("New Address Added Successfully!")}`,
                  toastConfig.success
                );
                setform({
                  open: false,
                  editId: null,
                });
              });
            });
          } else {
            await setDoc(doc(AddressRef), {
              address: values.address,
              created_at: serverTimestamp(),
              isDefault: false,
              name: values.name,
              phno: `${values.phoneCode + values.phoneNumber}`,
              geoLocation: new GeoPoint(
                values.cordinate.lat,
                values.cordinate.lng
              ),
              building: values.building,
            }).then(() => {
              toast.success(
                `${t("New Address Added Successfully!")}`,
                toastConfig.success
              );
              setform({
                open: false,
                editId: null,
              });
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  });

  const handleForm = async (Id) => {
    if (Id) {
      const docRef = doc(db, "User", AuthId, "Address", Id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const addressdata = docSnap.data();
        const parsedPhoneNumber = parsePhoneNumberFromString(addressdata.phno);
        formik.setValues({
          name: addressdata.name,
          building: addressdata.building,
          phoneCode: `+${parsedPhoneNumber.countryCallingCode}`,
          phoneNumber: parsedPhoneNumber.nationalNumber,
          address: addressdata.address,
          cordinate: {
            lat: addressdata.geoLocation?._lat,
            lng: addressdata.geoLocation?._long,
          },
        });
      }
    }
  };

  useEffect(() => {
    handleForm(form.editId);
  }, [form.editId]);

  return (
    <>
      <form id="address-edit-form" onSubmit={formik.handleSubmit}>
        <div className="col-12 mb-25">
          <div className="input-style mb-23">
            <AddressModal formik={formik} />
          </div>
          <div className="input-style">
            <label htmlFor="addressname">
              {t("Address Name")} <span>*</span>
            </label>
            <input
              type="text"
              className="ctm-input"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="e.g Home"
            />
            <span className="input-error mt-3">{formik.errors.name}</span>
          </div>
          <div className="mb-25">
            <div className="input-style">
              <label htmlFor="addressnum">
                {t("Building Number")} <span>*</span>
              </label>
              <input
                type="text"
                className="ctm-input"
                id="building"
                placeholder="Number"
                onChange={formik.handleChange}
                value={formik.values.building}
                name="building"
              />
              <span className="input-error mt-3">{formik.errors.building}</span>
            </div>
          </div>
          <PhoneInput formik={formik} />
          {form.editId ? (
            <button
              type="submit"
              className="btn btn-primary w-100"
              tabIndex="0"
            >
              {t("Edit Address")}
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary w-100"
              tabIndex="0"
            >
              {t("Add Address")}
            </button>
          )}
        </div>
      </form>

      {/* <AddressModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        formik={formik}
      /> */}

      <CustomToastContainer />
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKJ0LTVbtsmscRTc1iFyUJt5Rz8r18kw0&libraries=places"></script>
    </>
  );
};

export default AddressForm;
