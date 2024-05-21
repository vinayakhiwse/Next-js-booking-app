import React from "react";
import GoogleMapReact from "google-map-react";
import mapIcon from "../../../../public/asset/map-icon.png";
import { exampleMapStyles } from "./_mapStyle";

const Marker = ({ mapimage, text }) => (
  <>
    <img src={mapimage.src} />
    <div className="bg-secondary text-white w-60 sm:w-80 p-5 text-base rounded-md font-thin -ml-20">
      {text}
    </div>
  </>
);

const MapComponent = ({ latitude, longitude, address }) => {
  const defaultProps = {
    center: {
      lat: Number(latitude),
      lng: Number(longitude),
    },
    zoom: 13,
  };

  return (
    <GoogleMapReact
    //   bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY }}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
      options={{
        styles: exampleMapStyles,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        zoomControl: false,
      }}
    >
      <Marker
        lat={latitude}
        lng={longitude}
        mapimage={mapIcon}
        text={address}
      />
    </GoogleMapReact>
  );
};

export default MapComponent;