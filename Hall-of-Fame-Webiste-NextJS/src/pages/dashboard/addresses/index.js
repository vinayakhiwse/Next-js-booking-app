import CustomToastContainer from "@/components/common/CustomToastContainer";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import UserAddressView from "@/views/cards/User/UserAddressView";
import AddressForm from "@/views/form/address";
import DeleteModel from "@/views/models/DeleteModel";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Addresses = () => {
  const [form, setform] = useState({
    open: false,
    editId: null,
  });
  const { AuthId } = useSelector((state) => state.AuthData);
  const [addressDeleteDailog, setAddressDeleteDailog] = useState({
    show: false,
    deleteId: null,
    content: null,
  });
  const [allAddresses, setAllAddresses] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Update the user defalut address
  const handleSetAsDefaultAddress = (e) => {
    const AddressRef = collection(db, "User", AuthId, "Address");
    const oldDefaultAddress = allAddresses.find((item) => item.isDefault);
    const updateRef = doc(AddressRef, oldDefaultAddress?.docid);

    updateDoc(updateRef, {
      isDefault: false,
    }).then(() => {
      const updateNewDefaultRef = doc(AddressRef, e.target.id);

      updateDoc(updateNewDefaultRef, {
        isDefault: true,
      }).then(() => {
        const userRef = doc(db, "User", AuthId);

        updateDoc(userRef, {
          defulat_address: updateNewDefaultRef,
        }).then(() => {
          toast.success(`${t("Default Address Update Successfully")}`);
        });
      });
    });
  };

  const handleDeleteAddress = async () => {
    try {
      const AddressRef = collection(db, "User", AuthId, "Address");
      await deleteDoc(doc(AddressRef, addressDeleteDailog.deleteId)).then(
        () => {
          toast.success(`${t("Address Deleted SuccessFully!")}`);
          setAddressDeleteDailog({
            show: false,
            deleteId: null,
            content: null,
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAddress = async () => {
    try {
      const AddressRef = collection(db, "User", AuthId, "Address");
      setLoading(true);
      onSnapshot(AddressRef, (querySnapshot) => {
        setAllAddresses(
          querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() }))
        );
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setform({
      open: false,
      editId: null,
    });
    fetchAddress();
  }, [router]);

  return (
    <>
      <div className="row">
        {!form.open ? (
          <div className="saved-add usman ">
            <div
              className="btn btn-primary address-btn"
              onClick={() =>
                setform({
                  open: true,
                  editId: null,
                })
              }
            >
              {t("Add New Address")}
            </div>
            {allAddresses &&
              allAddresses.map((addressItem) => (
                <UserAddressView
                  key={addressItem.docid}
                  addressItem={addressItem}
                  handleSetAsDefaultAddress={handleSetAsDefaultAddress}
                  setAddressDeleteDailog={setAddressDeleteDailog}
                  setform={setform}
                  loading={loading}
                />
              ))}
          </div>
        ) : (
          <AddressForm
            form={form}
            setform={setform}
            AddressRef={collection(db, "User", AuthId, "Address")}
          />
        )}
      </div>

      <DeleteModel
        deleteDailog={addressDeleteDailog}
        setDeleteDailog={setAddressDeleteDailog}
        handleDeleteAddress={handleDeleteAddress}
      />

      <CustomToastContainer />
    </>
  );
};

const AddressesPage = () => (
  <DashboardLayout>
    <Addresses />
  </DashboardLayout>
);

export default AddressesPage;
