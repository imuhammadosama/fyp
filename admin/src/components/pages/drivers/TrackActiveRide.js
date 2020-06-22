import React, { useState, useEffect } from "react";
import MainLayout from "../../shared/Layout";
import { PageHeader, Divider, Descriptions, Button } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import { GOOGLE_MAP_API } from "../../../config/google-maps.config";
import { useAuthedAxios } from "../../../config/axios.config";

export default function TrackActiveRide() {
  const {
    state: { ride, driverName },
  } = useLocation();
  const history = useHistory();

  if (!ride) history.push("/drivers/ride");

  const [startPoint, setStartPoint] = useState({
    lng: ride.route[0].coords.longitude,
    lat: ride.route[0].coords.latitude,
  });
  const [endPoint, setEndPoint] = useState({
    lng: ride.route[ride.route.length - 1].coords.longitude,
    lat: ride.route[ride.route.length - 1].coords.latitude,
  });
  const [polylinePath, setPolylinePath] = useState({
    lng: ride.route[ride.route.length - 1].coords.longitude,
    lat: ride.route[ride.route.length - 1].coords.latitude,
  });

  const [{ loading, data, error }, refetch] = useAuthedAxios({
    url: "/driver/track",
    method: "GET",
    params: {
      rideID: ride._id,
    },
  });

  useEffect(() => {
    let timer = setInterval(() => {
      refetch();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (data) {
      const { ride } = data;
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
      setStartPoint(startPoint);
      setEndPoint(endPoint);
      setPolylinePath(polylinePath);
    }
  }, [data]);

  const center = {
    lng: ride.startPosition.coords.longitude,
    lat: ride.startPosition.coords.latitude,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API,
  });

  return (
    <MainLayout>
      <PageHeader
        title={`${driverName} Active Ride`}
        onBack={() => history.goBack()}
        extra={[
          <Button type="dashed" key="refresh-button" onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Divider />
      <Descriptions bordered layout="vertical">
        <Descriptions.Item label="Started At">
          {new Date(ride.createdAt).toUTCString()}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
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
