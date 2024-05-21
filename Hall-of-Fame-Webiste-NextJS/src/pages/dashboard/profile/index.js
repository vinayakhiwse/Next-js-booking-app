import Link from "next/link";
import React, { useEffect, useState } from "react";
import UserDetail from "@/views/cards/User/UserDetail";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import useTranslation from "@/hooks/useTranslation";
import { Rings } from "react-loader-spinner";

const Profile = () => {
  const { AuthId } = useSelector((state) => state.AuthData);
  const [loading, setLoading] = useState(false);
  const [UserInfo, setUserInfo] = useState({});
  const { t } = useTranslation();
  const fetchUserData = async () => {
    setLoading(true);
    const docRef = doc(db, "User", AuthId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const dataDoc = docSnap.data();
      setUserInfo({
        display_name: dataDoc?.display_name,
        address: dataDoc?.address,
        email: dataDoc?.email,
        photo_url: dataDoc?.photo_url,
        phone_number: dataDoc?.phone_number,
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="user-profile-btn-iyt">
        <Link
          href="/dashboard/profile/edit"
          className="btn btn-primary profile-btn"
        >
          {t("edit profile")}
        </Link>
      </div>
      {loading ? (
        <Rings
          height="120"
          width="120"
          color="#C2C0D5"
          radius="6"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          wrapperClass=""
          visible={loading}
          ariaLabel="rings-loading"
        />
      ) : (
        <UserDetail data={UserInfo} />
      )}
    </>
  );
};

const ProfilePage = () => (
  <DashboardLayout>
    <Profile />
  </DashboardLayout>
);

export default ProfilePage;
