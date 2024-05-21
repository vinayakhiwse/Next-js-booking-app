import DashboardLayout from "@/components/layouts/DashboardLayout";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import BookingTabPanelView from "@/views/TabsPanels/BookingTabPanelView";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";

const Bookings = () => {
  const [status, setStatus] = useState("all");
  const [AllBookings, setAllBookings] = useState([]);
  const { t } = useTranslation();
  const { AuthId } = useSelector((state) => state.AuthData);
  const [loading, setLoading] = useState(false);
  const handleSelect = (selectedStatus) => {
    setStatus(selectedStatus);
  };

  const fetchBookings = async () => {
    const UserDocRef = doc(db, "User", AuthId);
    setLoading(true);
    const querySnapshot = await getDocs(
      query(collection(db, "Booking"), where("user", "==", UserDocRef))
    );

    querySnapshot.docs.map(async (doc) => {
      const docData = doc.data();

      if (docData.celebrity) {
        docData.celebrity = (await getDoc(docData.celebrity)).data();
      }

      if (docData.service) {
        docData.service = (await getDoc(docData.service)).data();
      }

      const firstTime = docData?.slots[0]?.times[0];
      const lastTime =
        docData?.slots[0]?.times?.[docData.slots[0].times.length - 1];

      setAllBookings((old) => [
        ...old,
        {
          id: doc.id,
          booking_id: docData?.booking_id,
          celebrity: docData?.celebrity?.display_name,
          serviceName: docData?.service?.name,
          serviceImage: docData?.service?.image[0],
          slot_date: docData?.slot_date,
          total_price: docData?.total_price,
          status: docData?.status,
          firstTime: firstTime,
          lastTime: lastTime,
        },
      ]);
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="order-page-tabs">
      <Tab.Container activeKey={status} onSelect={handleSelect}>
        <Nav variant="pills" className="mb-3" id="pills-tab" role="tablist">
          <Nav.Item className="custom-tab">
            <Nav.Link eventKey="all">{t("All")}</Nav.Link>
          </Nav.Item>

          <Nav.Item className="custom-tab">
            <Nav.Link eventKey="Pending">{t("Pending")}</Nav.Link>
          </Nav.Item>

          <Nav.Item className="custom-tab">
            <Nav.Link eventKey="Accepted">{t("Accepted")}</Nav.Link>
          </Nav.Item>

          <Nav.Item className="custom-tab">
            <Nav.Link eventKey="Completed">{t("Completed")}</Nav.Link>
          </Nav.Item>

          <Nav.Item className="custom-tab">
            <Nav.Link eventKey="Cancelled">{t("Cancelled")}</Nav.Link>
          </Nav.Item>
        </Nav>
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
          <Tab.Content>
            <Tab.Pane eventKey="all">
              <BookingTabPanelView items={AllBookings} loading={loading} />
            </Tab.Pane>

            <Tab.Pane eventKey="Pending">
              <BookingTabPanelView
                items={AllBookings.filter(
                  (booking) => booking.status == status
                )}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="Accepted">
              <BookingTabPanelView
                items={AllBookings.filter(
                  (booking) => booking.status == status
                )}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="Completed">
              <BookingTabPanelView
                items={AllBookings.filter(
                  (booking) => booking.status == status
                )}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="Cancelled">
              <BookingTabPanelView
                items={AllBookings.filter(
                  (booking) => booking.status == status
                )}
              />
            </Tab.Pane>
          </Tab.Content>
        )}
      </Tab.Container>
    </div>
  );
};

const BookingsPage = () => (
  <DashboardLayout>
    <Bookings />
  </DashboardLayout>
);

export default BookingsPage;
