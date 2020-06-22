import React from "react";
import MainLayout from "../../shared/Layout";
import { PageHeader, Divider, Descriptions } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import { GOOGLE_MAP_API } from "../../../config/google-maps.config";

export default function PreviousRide() {
  const {
    state: { ride },
  } = useLocation();
  const history = useHistory();

  if (!ride) history.push("/drivers/ride");

  const startPoint = {
    lng: ride.route[0].coords.longitude,
    lat: ride.route[0].coords.latitude,
  };
  const endPoint = {
    lng: ride.route[ride.route.length - 1].coords.longitude,
    lat: ride.route[ride.route.length - 1].coords.latitude,
  };

  const polylinePath = ride.route.map((r) => {
    return {
      lat: r.coords.latitude,
      lng: r.coords.longitude,
    };
  });

  const center = {
    lng: ride.startPosition.coords.longitude,
    lat: ride.startPosition.coords.latitude,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API,
  });

  return (
    <MainLayout>
      <PageHeader title={`Ride Details`} onBack={() => history.goBack()} />
      <Divider />
      <Descriptions bordered layout="vertical">
        <Descriptions.Item label="Started At">
          {new Date(ride.createdAt).toUTCString()}
        </Descriptions.Item>
        <Descriptions.Item label="Finished At">
          {new Date(ride.updatedAt).toUTCString()}
        </Descriptions.Item>
      </Descriptions>
      {isLoaded && !loadError && (
        <GoogleMap
          id="ride-map"
          mapContainerStyle={{
            height: "400px",
          }}
          zoom={14}
          center={center}
        >
          <Marker position={startPoint} label="S" />
          <Marker position={endPoint} label="E" />
          <Polyline path={polylinePath} />
        </GoogleMap>
      )}
    </MainLayout>
  );
}
