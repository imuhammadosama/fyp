import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  HomeOutlined,
  CarOutlined,
  SafetyOutlined,
  AlertOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  BankTwoTone,
  BankOutlined,
  FrownTwoTone,
  FrownOutlined,
  DollarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";

const { SubMenu } = Menu;

const { Header, Content, Sider } = Layout;

export default function MainLayout({ children }) {
  const history = useHistory();

  const location = useLocation();

  const onLogout = () => {
    localStorage.removeItem("auth");
    history.push("/");
  };

  const onMenuSelect = ({ key }) => {
    history.push(key);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
        <div className="main-logo">
          <h3 style={{ color: "white" }}>
            <b>Comfort Zone</b>
          </h3>
        </div>
        <div
          style={{
            float: "right",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
          </Menu> */}

          <Button
            style={{ verticalAlign: "middle" }}
            onClick={onLogout}
            type="dashed"
          >
            <PoweroffOutlined style={{ color: "red" }} /> Logout
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          className="site-layout-background"
          breakpoint="md"
          collapsedWidth="0"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            style={{ height: "100%", borderRight: 0 }}
            theme="dark"
            onSelect={onMenuSelect}
          >
            <Menu.Item key="/">
              <span>
                <HomeOutlined /> Dashboard
              </span>
            </Menu.Item>
            <Menu.Item key="/alerts">
              <span>
                <AlertOutlined /> Alerts
              </span>
            </Menu.Item>
            <SubMenu
              key="bills"
              title={
                <span>
                  <BankOutlined />
                  Bills
                </span>
              }
            >
              <Menu.Item key="/bills/add">Add Bills</Menu.Item>
              <Menu.Item key="/bills/view">View All Bills</Menu.Item>
            </SubMenu>
            <SubMenu
              key="complains"
              title={
                <span>
                  <FrownOutlined />
                  Complains
                </span>
              }
            >
              <Menu.Item key="/complains/add">Add Complain</Menu.Item>
              <Menu.Item key="/complains/view">View All Complains</Menu.Item>
            </SubMenu>
            <SubMenu
              key="funds"
              title={
                <span>
                  <DollarOutlined />
                  Funds
                </span>
              }
            >
              <Menu.Item key="/funds/add">Add Funds</Menu.Item>
              <Menu.Item key="/funds/view">View All Funds</Menu.Item>
            </SubMenu>
            <SubMenu
              key="issues"
              title={
                <span>
                  <MessageOutlined />
                  Issues
                </span>
              }
            >
              <Menu.Item key="/issues/add">Add Issue</Menu.Item>
              <Menu.Item key="/issues/view">View All Issues</Menu.Item>
            </SubMenu>
            <SubMenu
              key="ads"
              title={
                <span>
                  <BankOutlined />
                  Ads
                </span>
              }
            >
              <Menu.Item key="/ads/add">Add Ad</Menu.Item>
              <Menu.Item key="/ads/view">View All Ads</Menu.Item>
            </SubMenu>

            <SubMenu
              key="members"
              title={
                <span>
                  <UserOutlined />
                  Members
                </span>
              }
            >
              <Menu.Item key="/members/add">Add Member</Menu.Item>
              <Menu.Item key="/members/view">View All Members</Menu.Item>
            </SubMenu>
            <SubMenu
              key="drivers"
              title={
                <span>
                  <CarOutlined /> Drivers
                </span>
              }
            >
              <Menu.Item key="/drivers/add">Add Driver</Menu.Item>
              <Menu.Item key="/drivers/view">View All Drivers</Menu.Item>
            </SubMenu>
            <SubMenu
              key="guard"
              title={
                <span>
                  <SafetyOutlined />
                  Guards
                </span>
              }
            >
              <Menu.Item key="/guards/add">Add Guard</Menu.Item>
              <Menu.Item key="/guards/view">View All Guards</Menu.Item>
            </SubMenu>
            <SubMenu
              key="workers"
              title={
                <span>
                  <UsergroupAddOutlined />
                  Workers
                </span>
              }
            >
              <Menu.Item key="/workers/view">View All Workers</Menu.Item>
            </SubMenu>
            <SubMenu
              key="services"
              title={
                <span>
                  <BookOutlined />
                  Services
                </span>
              }
            >
              <Menu.Item key="/services">View All Services</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="main-content site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              background: "#fff",
              marginTop: 10,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
