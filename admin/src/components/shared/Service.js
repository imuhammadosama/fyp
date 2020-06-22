import React from "react";
import {
  PageHeader,
  List,
  Descriptions,
  Modal,
  Statistic,
  Card,
  Row,
  Col,
  Divider,
  Table,
  Result,
  Button,
  Spin,
  Tag,
} from "antd";
import { API_UPLOAD_PATH, useAuthedAxios } from "../../config/axios.config";
import { StarFilled } from "@ant-design/icons";

function Service({ service, visible, onModalClose }) {
  const [{ loading, data, error }] = useAuthedAxios(
    {
      url: `/service/${service._id}`,
      method: "GET",
    },
    {
      useCache: false,
    }
  );

  console.log(data);

  const columns = [
    {
      title: "Member Name",
      dataIndex: ["member", "name"],
      key: "name",
      fixed: "left",
    },
    {
      title: "Member Contact",
      dataIndex: ["member", "mobile"],
      key: "mobile",
    },
    {
      title: "Order Status",
      dataIndex: ["isAcceptanceStatusUpdated"],
      key: "status",
      render: (isUpdated, record) => {
        const { isAccepted, isCompleted } = record;
        return (
          <span>
            {isUpdated && isAccepted && !isCompleted && (
              <Tag color="blue">Order Accepted & Under Process</Tag>
            )}
            {isUpdated && isAccepted && isCompleted && (
              <Tag color="green">Order Completed</Tag>
            )}
            {isUpdated && !isAccepted && <Tag color="red">Order Rejected</Tag>}
          </span>
        );
      },
    },
    {
      title: "Rating",
      dataIndex: ["rating"],
      key: "status",
      render: (rating) => <span>{rating ? `${rating}/5` : "N/A"}</span>,
    },
  ];

  return (
    <div>
      <Modal
        visible={visible}
        width={"80%"}
        onCancel={onModalClose}
        footer={null}
      >
        <List
          header={<PageHeader title={service.title} />}
          itemLayout="vertical"
          size="large"
          dataSource={[service]}
          renderItem={(service) => (
            <List.Item
              key={service._id}
              extra={
                <img
                  width={300}
                  height={200}
                  alt="logo"
                  src={`${API_UPLOAD_PATH}/${service.imagePath}`}
                />
              }
            >
              <Row>
                <Col md="12" style={{ width: "50%" }}>
                  <Card>
                    <Statistic
                      title="Average Rating"
                      value={service.rating}
                      precision={2}
                      valueStyle={{ color: "#ffe234" }}
                      prefix={<StarFilled />}
                      suffix="/ 5"
                    />
                  </Card>
                </Col>
                <Col md="12" style={{ width: "50%" }}>
                  <Card>
                    <Statistic
                      title="Total Orders"
                      value={data ? data.hiredServices.length : 0}
                      precision={0}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
              </Row>

              <Descriptions layout="vertical" bordered>
                <Descriptions.Item label="Mobile">
                  {service.mobile}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {service.address}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {service.category}
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
        <Spin
          spinning={loading}
          tip="Loading Members Who Have Hired This Services..."
        >
          <Divider />
          <PageHeader
            title="Members List"
            subTitle="List of members who have hired this service."
          />
          <Divider />
          {data && (
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={data.hiredServices}
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
      </Modal>
    </div>
  );
}

export default Service;
