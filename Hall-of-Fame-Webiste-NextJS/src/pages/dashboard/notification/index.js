import SideNavigation from "@/components/common/SideNavigation";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotificationList from "@/components/common/notificationList";
import { useRouter } from "next/router";
const Notifications = () => {
  const { AuthId, UserType } = useSelector((state) => state.AuthData);
  const [notificationData, SetNotificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const docRef = collection(db, "Notification");
    const filterDoc = query(docRef, orderBy("date_time", "desc"));
    onSnapshot(filterDoc, (snapshot) => {
      const notificationArray = [];
      snapshot.docs.map((res) => {
        if (res.exists()) {
          if (UserType == "User") {
            if (
              (AuthId == res.data().send_from.id &&
                res.data().type == "Booking") ||
              (AuthId == res.data().send_from.id &&
                res.data().type == "Quotation")
            ) {
              notificationArray.push({ ...res.data(), id: res.id });
            }
          } else {
            if (AuthId == res.data().send_to.id) {
              getDoc(res.data()?.send_from)
                .then((userdata) => {
                  notificationArray.push({
                    ...res.data(),
                    id: res.id,
                    userInfo: userdata.data(),
                  });
                })
                .catch((err) => {
                  toast.error(err);
                  setLoading(false);
                });
            }
          }
        } else {
          setLoading(false);
        }
      });

      setTimeout(() => {
        SetNotificationData(notificationArray);
        setLoading(false);
      }, 2000);
    });
  }, [UserType]);

  const handleNotificationType = async (type, id) => {
    const NotificationRef = doc(db, "Notification", id);
    if (type === "Quotation") {
      await updateDoc(NotificationRef, {
        isRead: true,
      });
      router.push("/dashboard/quotations");
    } else {
      await updateDoc(NotificationRef, {
        isRead: true,
      });
      router.push("/dashboard/bookings");
    }
  };
  return (
    <section className="sec-m-tb">
      <div className="container">
        <div className="row">
          <SideNavigation />
          <div className="w-75 header-set">
            <div className="notification-cont"></div>
            <div className="d-flex align-items-center justify-content-between use-clas-noti-bordr">
              <div className="shipping-heading-notipage">
                {t("Notifications")}
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <button className="clear-all">{t("Clear All")}</button>
            </div>
            <NotificationList
              notificationData={notificationData}
              loading={loading}
              handleNotificationType={handleNotificationType}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
