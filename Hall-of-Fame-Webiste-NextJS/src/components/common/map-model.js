import React, { useEffect, useRef, useState } from "react";
import GoogleMap from "google-map-react";
import { usePlacesWidget } from "react-google-autocomplete";

import Autocomplete from "react-google-autocomplete";

import ReactGoogleAutocomplete from "react-google-autocomplete";
import useTranslation from "@/hooks/useTranslation";

const AddressModal = (props) => {
  const { formik } = props;
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);
  const { t } = useTranslation();
  const AutocompleteMemoized = React.memo(Autocomplete);
  const loadMap = (map, maps) => {
    const geocoder = new maps.Geocoder();
    mapRef.current = map;

    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new maps.Marker({
      position: formik.values.cordinate,
      map,
      draggable: true,
    });

    newMarker.addListener("dragend", (e) => {
      const { lat, lng } = e.latLng;
      geocoder.geocode(
        { location: { lat: lat(), lng: lng() } },
        (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              formik.setFieldValue("cordinate", {
                lat: lat(),
                lng: lng(),
              });
              formik.setFieldValue("address", results[0].formatted_address);
              console.log("Full address:", results[0].formatted_address);
            } else {
              console.log("No results found");
            }
          } else {
            console.log("Geocoder failed due to:", status);
          }
        }
      );
    });

    setMarker(newMarker);
  };

  useEffect(() => {
    if (mapRef.current && marker) {
      mapRef.current.setCenter(formik.values.cordinate);
      marker.setPosition(formik.values.cordinate);
    }
  }, [formik.values.cordinate]);

  const { ref } = usePlacesWidget({
    apiKey: "AIzaSyBNcTmnS323hh7tSQzFdwlnB4EozA3lwcA",
    onPlaceSelected: (place) => {
      formik.setFieldValue("address", place.formatted_address);
      handlePlaceSelected(place);
    },
    inputAutocompleteValue: "country",
  });

  const handlePlaceSelected = (place) => {
    const {
      formatted_address,
      geometry: { location },
    } = place;
    formik.setFieldValue("cordinate", {
      lat: location.lat(),
      lng: location.lng(),
    });

    formik.setFieldValue("address", formatted_address);
    console.log("Selected place:", formatted_address);
    console.log("Latitude:", location.lat());
    console.log("Longitude:", location.lng());
  };

  return (
    <>
      <label className="d-block">
        {t("Address")} <span className="text-danger">*</span>
      </label>
      <span className="input-error mt-3">{formik.errors.address}</span>
      <AutocompleteMemoized
        placeholder={t("Address")}
        className="ctm-input w-100 address-padds-register"
        defaultValue={formik.values.address}
        apiKey={"AIzaSyBNcTmnS323hh7tSQzFdwlnB4EozA3lwcA"}
        onPlaceSelected={(place) => {
          formik.setFieldValue("address", place.formatted_address);
          handlePlaceSelected(place);
        }}
      />
      <div style={{ height: "440px", width: "100%" }}>
        <GoogleMap
          bootstrapURLKeys={{
            key: "AIzaSyBNcTmnS323hh7tSQzFdwlnB4EozA3lwcA",
            libraries: "places",
          }}
          center={formik.values.cordinate}
          defaultZoom={14}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => loadMap(map, maps)}
        />
      </div>
    </>
  );
};

export default AddressModal;
