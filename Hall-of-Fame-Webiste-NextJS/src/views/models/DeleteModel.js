import useTranslation from "@/hooks/useTranslation";
import React from "react";
import { Modal } from "react-bootstrap";

const DeleteModel = ({
  setDeleteDailog,
  deleteDailog,
  handleDeleteAddress,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      show={deleteDailog.show}
      onHide={() => {
        setDeleteDailog({
          show: false,
          deleteId: null,
        });
      }}
      centered
      className="cancel-mdl"
    >
      <h2>{t("Delete")}</h2>
      <h2 className="mt-1 mb-2">
        {t("Are you sure you want to delete")} {deleteDailog.content}?
      </h2>
      <div className="yes-no-btns d-flex w-75 align-self-center">
        <button
          type="button"
          data-dismiss="modal"
          aria-label="Close"
          className="btn btn-primary no-btn"
          onClick={() => {
            setDeleteDailog({
              show: false,
              deleteId: null,
            });
          }}
        >
          {t("No")}
        </button>
        <button
          type="submit"
          className="btn yes-btn"
          onClick={handleDeleteAddress}
        >
          {t("Yes")}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModel;
