import React, { useEffect } from "react";
import MainLayout from "../../shared/Layout";
import { PageHeader, Button, Divider, Spin, Table, List, Empty } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import { useAuthedAxios } from "../../../config/axios.config";

export default function DriverRides() {
  const {
    state: { driver },
  } = useLocation();
  const history = useHistory();

  if (!driver) history.push("/drivers/view");

  const [{ loading, data, error }, refetch] = useAuthedAxios({
    url: "/driver/rides",
    method: "GET",
    params: {
      driverID: driver._id,
    },
  });

  console.log(data);

  useEffect(() => {
    let timer = setInterval(() => {
      refetch();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const columns = [
    {
      title: "Ride Started",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toUTCString(),
    },
    {
      title: "Ride Stopped",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toUTCString(),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            onClick={() => {
              history.push({
                pathname: `/driver/${driver._id}/ride`,
                state: {
                  ride: record,
                },
              });
            }}
          >
            View Ride
          </Button>
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title={`Track ${driver.name} Rides`}
        subTitle={`View previous rides of ${driver.name} or track the active one.`}
        extra={[
          <Button type="dashed" key="refresh-button" onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Divider />
      {loading && (
        <div
          style={{
            display: "flex",
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin spinning={loading} tip="Loading data..." />
        </div>
      )}
      {!loading && data && (
        <React.Fragment>
          {data.activeRide && (
            <List
              itemLayout="horizontal"
              dataSource={[data.activeRide]}
              bordered
              renderItem={(item) => (
                <List.Item
                  style={{ background: "#001529" }}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => {
                        history.push({
                          pathname: `/driver/${driver._id}/track`,
                          state: {
                            ride: data.activeRide,
                            driverName: driver.name,
                          },
                        });
                      }}
                    >
                      Track Ride
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span
                        style={{ color: "white" }}
                      >{`${driver.name} is on an active ride`}</span>
                    }
                  />
                </List.Item>
              )}
            />
          )}

          {!data.activeRide && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`${driver.name} has no active ride.`}
            />
          )}

          <Divider />

          <div style={{ background: "#fafafa", padding: 18 }}>
            <h3>
              <b>Previous Rides</b>
            </h3>
          </div>
          <Table
            dataSource={data.previousRides}
            columns={columns}
            rowKey="_id"
          />
        </React.Fragment>
      )}
      {!loading && error && (
        <h6>Error fetching rides. Please try reloading page.</h6>
      )}
    </MainLayout>
  );
}
