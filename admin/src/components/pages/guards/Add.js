import React, { useEffect, useRef } from "react";
import {
  PageHeader,
  Divider,
  Form,
  Input,
  Button,
  Spin,
  message,
  Select,
  Row,
  Col,
} from "antd";
import MainLayout from "../../shared/Layout";
import { SafetyOutlined } from "@ant-design/icons";
import { useAuthedAxios } from "../../../config/axios.config";

const { Option } = Select;

export default function AddGuard() {
  const formRef = useRef(null);

  const [{ loading, data, error }, addNewGuard] = useAuthedAxios(
    {
      url: "/guard/add",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const onFinish = (data) => {
    addNewGuard({
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
      message.success("New Guard Added Successfully!");
      if (formRef.current) formRef.current.resetFields();
    }
  }, [data]);

  return (
    <MainLayout>
      <PageHeader
        title="Add Guard"
        avatar={{
          icon: <SafetyOutlined style={{ color: "black" }} />,
          style: {
            background: "none",
          },
        }}
      />
      <Divider />
      <Spin spinning={loading} tip="Adding new guard...">
        <Form
          name="add-guard"
          layout="vertical"
          onFinish={onFinish}
          ref={formRef}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>

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
            <Input />
          </Form.Item>

          <Row>
            <Col sm={12} xs={24}>
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
            <Col sm={12} xs={24}>
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
