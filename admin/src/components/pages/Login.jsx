import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";

import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAxios } from "../../config/axios.config";
import { useHistory } from "react-router-dom";

export default function Login(props) {
  const history = useHistory();

  const [{ data, loading, error }, loginQuery] = useAxios(
    {
      url: "/login",
      method: "POST",
    },
    { manual: true }
  );

  const onFinish = (data) => {
    loginQuery({
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
      localStorage.setItem("auth", JSON.stringify(data.auth));
      message.success("Login Succeed!");
      history.push("/");
    }
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
      }}
      id="login-page"
    >
      <h2>
        <b>Comfort Zone</b>
      </h2>
      <h3>Admin Panel Login</h3>
      <Form
        name="login"
        style={{
          width: "40%",
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
