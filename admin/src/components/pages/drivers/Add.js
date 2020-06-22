import React, { useEffect, useRef } from "react";
import { PageHeader, Divider, Form, Input, Button, Spin, message } from "antd";
import MainLayout from "../../shared/Layout";
import { CarFilled } from "@ant-design/icons";
import { useAuthedAxios } from "../../../config/axios.config";

export default function AddDriver() {
  const formRef = useRef(null);

  const [{ loading, data, error }, addNewDriver] = useAuthedAxios(
    {
      url: "/driver/add",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const onFinish = (data) => {
    addNewDriver({
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
      message.success("New Driver Added Successfully!");
      if (formRef.current) formRef.current.resetFields();
    }
  }, [data]);

  return (
    <MainLayout>
      <PageHeader
        title="Add Driver"
        avatar={{
          icon: <CarFilled style={{ color: "black" }} />,
          style: {
            background: "none",
          },
        }}
      />
      <Divider />
      <Spin spinning={loading} tip="Adding new driver...">
        <Form
          name="add-driver"
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
            <Input />
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
            <Input.Password />
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
            <Input.Password />
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
