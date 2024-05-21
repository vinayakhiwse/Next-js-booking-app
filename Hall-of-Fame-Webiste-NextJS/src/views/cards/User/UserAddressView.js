import useTranslation from "@/hooks/useTranslation";
import React from "react";
import { Rings } from "react-loader-spinner";

const UserAddressView = ({
  addressItem,
  handleSetAsDefaultAddress,
  setAddressDeleteDailog,
  setform,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <>
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
          visible={true}
          ariaLabel="rings-loading"
        />
      ) : (
        <>
          <div className="address-cont usman">
            <div className="place">
              <p>
                {addressItem.name}
                {addressItem.isDefault ? (
                  <span>
                    <i className="far fa-check-circle"></i>{" "}
                    {t("Default Address")}
                  </span>
                ) : (
                  <span
                    className="defaulting"
                    id={addressItem.docid}
                    onClick={handleSetAsDefaultAddress}
                  >
                    {t("Set as Default Address")}
                  </span>
                )}
              </p>
            </div>
            <p className="st-address">{addressItem.address}</p>
            <span className="add-num">
              {addressItem.phno}
              <span>
                <span
                  className="delete-link delete-address"
                  role="button"
                  onClick={() =>
                    setAddressDeleteDailog({
                      show: true,
                      deleteId: addressItem.docid,
                      content: "Address",
                    })
                  }
                >
                  {t("Delete")}
                </span>
                |
                <span
                  role="button"
                  className="edit-link pointer-curser"
                  onClick={() =>
                    setform({
                      open: true,
                      editId: addressItem.docid,
                    })
                  }
                >
                  {t("Edit")}
                </span>
              </span>
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default UserAddressView;
