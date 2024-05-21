import useTranslation from "@/hooks/useTranslation";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const CancelModel = ({
  setCancelModelView,
  CancelModelView,
  handleCancelOrder,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      show={CancelModelView.show}
      onHide={() => {
        setCancelModelView({
          show: false,
          id: null,
          type: null,
        });
      }}
      centered
      className="cancel-mdl"
    >
      <div className="modal-data">
        <h2>
          {t("Cancel")} {CancelModelView.type}
        </h2>
        <p className="txt-cancel">
          {t("Are you sure you want to cancel the current")}{" "}
          {CancelModelView.type}, {CancelModelView.type} {t("No -")}
          <span>#{CancelModelView.id}</span>?
        </p>
        <div className="yes-no-btns d-flex">
          <button
            type="button"
            data-dismiss="modal"
            aria-label="Close"
            className="btn btn-primary no-btn"
            onClick={() => {
              setCancelModelView({
                show: false,
                id: null,
                type: null,
              });
            }}
          >
            {t("No")}
          </button>
          <button
            type="submit"
            className="btn yes-btn"
            onClick={handleCancelOrder}
          >
            {t("Yes")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelModel;
