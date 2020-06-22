import React, { useEffect, useRef } from "react";
import { PageHeader, Divider, Form, Input, Button, Spin, message } from "antd";
import MainLayout from "../../shared/Layout";
import { CarFilled } from "@ant-design/icons";
import { useAuthedAxios } from "../../../config/axios.config";
import { useRouteMatch, useLocation, useHistory } from "react-router-dom";

export default function UpdateDriver() {
  const {
    state: { driver },
  } = useLocation();
  const history = useHistory();

  if (!driver) history.push("/drivers/view");

  const [{ loading, data, error }, updateDriver] = useAuthedAxios(
    {
      url: "/driver/update",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const [
    { loading: cpLoading, data: cpData, error: cpError },
    updatePassword,
  ] = useAuthedAxios(
    {
      url: "/driver/update/password",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const onFinish = (data) => {
    updateDriver({
      data: {
        ...data,
        _id: driver._id,
      },
    });
  };

  const onChangePassword = (data) => {
    updatePassword({
      data: {
        ...data,
        username: driver.username,
      },
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
      message.success("Driver Updated Successfully!");
    }
  }, [data]);

  useEffect(() => {
    if (cpError) {
      const msg = cpError.response
        ? cpError.response.data
          ? cpError.response.data.message
            ? cpError.response.data.message
            : "Internal Server Error"
          : "Internal Server Error"
        : "Internal Server Error";
      message.error(msg);
    }
  }, [cpError]);

  useEffect(() => {
    if (cpData) {
      console.log("Data: ", cpData);
      message.success("Password Updated Successfully!");
    }
  }, [cpData]);

  return (
    <MainLayout>
      <PageHeader
        title={`Update Driver`}
        avatar={{
          icon: <CarFilled style={{ color: "black" }} />,
          style: {
            background: "none",
          },
        }}
        onBack={() => history.goBack()}
      />
      <Divider />
      <Spin spinning={loading || cpLoading} tip="Updating Driver...">
        {driver && (
          <React.Fragment>
            <Form
              name="add-driver"
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: driver.name,
                username: driver.username[0],
                mobile: driver.mobile,
              }}
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
                <Input disabled />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <h1 className="h1">Update Password</h1>
            <Divider />
            <Form
              name="change-password"
              layout="vertical"
              onFinish={onChangePassword}
            >
              <Form.Item
                name="password"
                label="New Password"
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
          </React.Fragment>
        )}
      </Spin>
    </MainLayout>
  );
}
