import React, { useEffect, useRef, useState } from "react";
import {
  PageHeader,
  Divider,
  Form,
  Input,
  Button,
  Spin,
  message,
  Row,
  Col,
  Select,
} from "antd";
import MainLayout from "../../shared/Layout";
import { UserAddOutlined } from "@ant-design/icons";
import { useAuthedAxios } from "../../../config/axios.config";
import { GOOGLE_MAP_API } from "../../../config/google-maps.config";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const { Option } = Select;

export default function AddMember() {
  const LatLng = {
    lng: 73.1177059,
    lat: 33.5848898,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API,
  });

  const [center, setCenter] = useState(LatLng);

  const formRef = useRef(null);

  const [{ loading, data, error }, addNewMember] = useAuthedAxios(
    {
      url: "/member/add",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const onMapClick = (e) => {
    const center = e.latLng;
    const lat = center.lat();
    const lng = center.lng();
    setCenter({ lat, lng });
  };

  const onFinish = (formData) => {
    if (loadError) {
      message.error(
        "Map was not loaded. Please reload the page and select the location of member."
      );
      return;
    }
    const data = {
      ...formData,
      coords: center,
    };
    addNewMember({
      data,
    });
  };

  useEffect(() => {
    if (error) {
      const msg = error.response
        ? error.response.data
          ? error.response.data.message
            ? error.response.data.message
            : "Internal Server Error"
          : "Internal Server Error"
        : "Internal Server Error";
      message.error(msg);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      console.log("Data: ", data);
      message.success("New Member Added Successfully!");
      if (formRef.current) formRef.current.resetFields();
    }
  }, [data]);

  return (
    <MainLayout>
      <PageHeader
        title="Add Member"
        avatar={{
          icon: <UserAddOutlined style={{ color: "black" }} />,
          style: {
            background: "none",
          },
        }}
      />
      <Divider />
      <Spin spinning={loading} tip="Adding new member...">
        <Form
          name="add-member"
          layout="vertical"
          onFinish={onFinish}
          ref={formRef}
          initialValues={{
            latitude: center.lat,
            longitude: center.lng,
          }}
        >
          <Row>
            <Col sm={12} xs={24}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input name!" }]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <Form.Item
                label="Mobile Number"
                name="mobile"
                rules={[
                  { required: true, message: "Please input mobile number!" },
                  {
                    pattern: /^(\+\d{1,3}[- ]?)?\d{11}$/,
                    message: "Mobile number is invalid!",
                  },
                ]}
              >
                <Input placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={8} xs={24}>
              <Form.Item
                label="House Number"
                name="houseNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input house number!",
                  },
                ]}
              >
                <Input placeholder="Enter member's house number" />
              </Form.Item>
            </Col>
            <Col sm={8} xs={24}>
              <Form.Item
                name="sector"
                label="Sector"
                rules={[{ required: true, message: "Please select sector!" }]}
              >
                <Select placeholder="Please select a sector">
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={8} xs={24}>
              <Form.Item
                name="block"
                label="Block"
                rules={[{ required: true, message: "Please select block!" }]}
              >
                <Select placeholder="Please select a sector">
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="C">C</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Location">
            {isLoaded && !loadError && (
              <GoogleMap
                id="member-selection-map"
                mapContainerStyle={{
                  height: "400px",
                }}
                zoom={15}
                center={center}
                onClick={onMapClick}
              >
                <Marker position={center} />
              </GoogleMap>
            )}
            {!isLoaded && !loadError && (
              <div style={{ textAlign: "center" }}>
                <Spin spinning tip="Loading Map..." />
              </div>
            )}
            {loadError && "Error Loading Map. Try reloading page!"}
          </Form.Item>

          <Form.Item
            label="Membership Number"
            name="membershipNumber"
            rules={[
              {
                required: true,
                message: "Please input membership number!",
              },
            ]}
          >
            <Input placeholder="Enter member's membership number" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input username!" },
              {
                pattern: /^[a-z0-9_]{3,16}$/,
                message:
                  "Username can be alphanumeric and may include _ having a length of 3 to 16 characters.",
              },
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm password!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </MainLayout>
  );
}
