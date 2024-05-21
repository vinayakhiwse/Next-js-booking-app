import useTranslation from "@/hooks/useTranslation";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const SubscriptionExpireModel = ({ setShowDailog, showDailog }) => {
  const { t } = useTranslation();
  return (
    <Modal show={showDailog} onHide={() => setShowDailog(false)} centered>
      <Modal.Body className="text-center">
        <h2 className="mb-2">{t("Package Subscription")}</h2>
        <h2 className="mb-2">
          {t(
            "Your subscription package has expired. Kindly renew your package to add a new service."
          )}
        </h2>
        <div className="d-flex gap-3 justify-content-center">
          <Button onClick={() => setShowDailog(false)}>
            {t("Renew Later")}
          </Button>
          <Button id="renew_now" onClick={() => setShowDailog(false)}>
            {t("Renew Now")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SubscriptionExpireModel;
