import SideNavigation from "@/components/common/SideNavigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import QuotationsTabPanelView from "@/views/TabsPanels/QuotationsTabPanelView";
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

const Quotations = () => {
  const [status, setStatus] = useState("all");
  const [AllQuotations, setAllQuotations] = useState([]);
  const { AuthId } = useSelector((state) => state.AuthData);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleSelect = (selectedStatus) => {
    setStatus(selectedStatus);
  };

  const fetchQuotations = async () => {
    const UserDocRef = doc(db, "User", AuthId);
    setLoading(true);
    const querySnapshot = await getDocs(
      query(collection(db, "Quotation"), where("user", "==", UserDocRef))
    );

    querySnapshot.docs.map(async (doc) => {
      const docData = doc.data();
      if (docData.service) {
        const temp = await getDoc(docData.service);
        docData.service = temp.data();
      }
    
      const firstTime = docData?.slots[0]?.times[0];
      const lastTime =
        docData?.slots[0]?.times?.[docData.slots[0].times.length - 1];
      setAllQuotations((old) => [
        ...old,
        {
          id: doc.id,
          quotation_id: docData?.quotation_id,
          serviceName: docData?.service?.name,
          serviceImage: docData?.service?.image[0],
          slot_date: docData?.slot_date,
          status: docData?.status,
          firstTime: firstTime,
          lastTime: lastTime,
          QuotedPrice: docData?.QuotedPrice,
        },
      ]);
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
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
            ariaLabel="rings-loading"
          />
        ) : (
          <>
            {AllQuotations && AllQuotations.length === 0 ? (
              <div className="alert alert-danger">{t("No record found")}</div>
            ) : (
              <Tab.Content>
                <Tab.Pane eventKey="all">
                  <QuotationsTabPanelView items={AllQuotations} />
                </Tab.Pane>
                <Tab.Pane eventKey="Pending">
                  <QuotationsTabPanelView
                    items={AllQuotations.filter(
                      (quotations) => quotations.status == status
                    )}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="Accepted">
                  <QuotationsTabPanelView
                    items={AllQuotations.filter(
                      (quotations) => quotations.status == status
                    )}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="Completed">
                  <QuotationsTabPanelView
                    items={AllQuotations.filter(
                      (quotations) => quotations.status == status
                    )}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="Cancelled">
                  <QuotationsTabPanelView
                    items={AllQuotations.filter(
                      (quotations) => quotations.status == status
                    )}
                  />
                </Tab.Pane>
              </Tab.Content>
            )}
          </>
        )}
      </Tab.Container>
    </div>
  );
};

const QuotationsPage = () => (
  <DashboardLayout>
    <Quotations />
  </DashboardLayout>
);

export default QuotationsPage;
