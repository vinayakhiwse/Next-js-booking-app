import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
function AddressListModel({ show, onHide, setAddress }) {
  const { AuthId } = useSelector((state) => state.AuthData);
  const [AddressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const { t } = useTranslation();

  const FetchUserAddressDetail = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "User", AuthId, "Address")
      );
      querySnapshot.docs.map((doc) => {
        const dataDoc = doc.data();

        setAddressList((prev) => [
          ...prev,
          {
            id: doc.id,
            name: dataDoc?.name,
            address: dataDoc?.address,
            phno: dataDoc?.phno,
            isDefault: dataDoc?.isDefault,
          },
        ]);
      });
    } catch (error) {
      console.log("AddresList", error);
    }
  };

  const handleRadioChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleFormSubmit = () => {
    const AddressData = AddressList.find((item) => item.id === selectedAddress);
    setAddress(AddressData);
    onHide();
  };

  useEffect(() => {
    FetchUserAddressDetail();
  }, []);

  return (
    <Modal show={show}>
      <Modal.Body>
        <div className="address-checkout">
          {AddressList.length > 0 &&
            AddressList?.map((item) => (
              <div className="home-add" key={item.id}>
                <input
                  style={{ marginRight: "20px", transform: "scale(1.8)" }}
                  type="radio"
                  name="make-default"
                  value={item.id}
                  checked={selectedAddress === item.id}
                  onChange={handleRadioChange}
                />
                <label htmlFor={item.id}>
                  <div className="address-info" style={{ color: "black" }}>
                    <p
                      className="name"
                      style={{ fontSize: "18px", marginBottom: "0px" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="address"
                      style={{ fontSize: "16px", marginBottom: "0px" }}
                    >
                      {item.address}
                    </p>
                    <p
                      className="add-num"
                      style={{ fontSize: "16px", marginBottom: "0px" }}
                    >
                      {item.phno}
                    </p>
                  </div>
                </label>
                <br />
              </div>
            ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
        <Button onClick={handleFormSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddressListModel;
