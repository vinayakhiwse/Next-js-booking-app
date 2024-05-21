import NotificationList from "@/components/common/notificationList";
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
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";

const NotificationDropdownMenu = ({ notificationData, notificationCount }) => {
  const router = useRouter();
  const { t } = useTranslation();

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
  const handleClearNotifications = () => {};
  return (
    <div
      className="dropdown-menu notif-drop header-notification"
      aria-labelledby="dropdownMenuLink"
    >
      {notificationCount > 0 ? (
        <>
          <Dropdown.Item
            style={{
              backgroundColor: "white",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <NotificationList
              notificationData={notificationData}
              handleNotificationType={handleNotificationType}
            />
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleClearNotifications}>
            {t("Clear Notifications")}
          </Dropdown.Item>
        </>
      ) : (
        <Dropdown.Item disabled> {t("No new notifications")}</Dropdown.Item>
      )}
    </div>
  );
};

const NotificationDropdown = () => {
  const { AuthId, UserType } = useSelector((state) => state.AuthData);
  const [notificationData, SetNotificationData] = useState([]);
  const notificationCount = notificationData.length; // Replace with your actual notification count
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filterDoc = query(
      collection(db, "Notification"),
      where("isRead", "==", false),
      orderBy("date_time", "desc")
    );

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
      SetNotificationData(notificationArray);
      setLoading(false);
    });
  }, []);
  


  return (
    <div className="dropdown show notification-dropdown">
      <a
        className="icon-btn d-flex align-items-center justify-content-center"
        href="#"
        role="button"
        id="dropdownMenuLink"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <div
          className="icon-badge get-center new-cart-notification carting"
          id="notification-count"
        >
          {notificationCount}
        </div>
        <i className="fas fa-bell belling"></i>
      </a>
      <NotificationDropdownMenu
        notificationData={notificationData}
        notificationCount={notificationCount}
      />
    </div>
  );
};

export default NotificationDropdown;
