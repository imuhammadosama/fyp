import React, { useState, useEffect } from "react";
import MainLayout from "../../shared/Layout";
import {
  PageHeader,
  Divider,
  Result,
  Button,
  Spin,
  Descriptions,
  Table,
  Popconfirm,
  message,
} from "antd";
import { useLocation, useHistory } from "react-router-dom";
import { useAuthedAxios } from "../../../config/axios.config";
import Service from "../../shared/Service";
import ButtonGroup from "antd/lib/button/button-group";

export default function WorkerServices() {
  const {
    state: { worker },
  } = useLocation();
  const history = useHistory();

  if (!worker) history.push("/workers/view");

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(false);

  const [{ loading, data, error }, refetch] = useAuthedAxios(
    `/worker/${worker._id}/services`,
    {
      useCache: false,
    }
  );

  const [
    { loading: deleting, data: deleteData, error: deleteError },
    deleteService,
  ] = useAuthedAxios(
    {
      url: "/service/delete",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const onDeleteConfirm = (id) => {
    deleteService({
      data: { id },
    });
  };

  useEffect(() => {
    if (deleteData) {
      message.success("Service Deleted Successfully!");
      refetch();
    }
  }, [deleteData]);

  useEffect(() => {
    if (deleteError) {
      message.error("Error deleting service. Try again!");
    }
  }, [deleteError]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      fixed: "left",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <span>{new Date(date).toUTCString()}</span>,
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => <span>{new Date(date).toUTCString()}</span>,
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <ButtonGroup>
          <Button
            type="dashed"
            disabled={deleting}
            onClick={() => {
              setSelectedService(record);
              setModalVisible(true);
            }}
          >
            View Details
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDeleteConfirm(record._id)}
          >
            <Button type="danger" loading={deleting}>
              Delete Service
            </Button>
          </Popconfirm>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title={`Worker Details - ${worker.name}`}
        onBack={() => history.push("/workers/view")}
        extra={[
          <Button type="dashed" key="refresh-button" onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Divider />
      <Descriptions layout="vertical" bordered>
        <Descriptions.Item label="Name">{worker.name}</Descriptions.Item>
        <Descriptions.Item label="Mobile Number">
          {worker.mobile}
        </Descriptions.Item>
        <Descriptions.Item label="Username">
          {worker.user.username}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <PageHeader title="Services" />
      <Divider />
      <Spin spinning={loading} tip="Loading Services...">
        {data && (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={data.services}
            bordered
          />
        )}
        {error && (
          <Result
            status="warning"
            title="There are some problems while fetching data."
            extra={
              <Button
                type="primary"
                key="console"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
            }
          />
        )}
      </Spin>
      {selectedService && (
        <Service
          service={selectedService}
          visible={isModalVisible}
          onModalClose={() => setModalVisible(false)}
        />
      )}
    </MainLayout>
  );
}
