import React from "react";
import MainLayout from "../shared/Layout";
import { PageHeader, Divider, List, Card, Row, Col } from "antd";
import { getTwoToneColor, setTwoToneColor } from '@ant-design/icons';

import {
  UserOutlined,
  BankTwoTone,
  FrownTwoTone,
  DollarTwoTone,
  MessageTwoTone,
  ShopTwoTone,
  SmileTwoTone,
  TrophyTwoTone,
  CarTwoTone,
  LockTwoTone,
  SecurityScanTwoTone,
  AlertTwoTone,
  SafetyCertificateTwoTone,
  GiftTwoTone,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const gridStyle = {
  width: "33.33%",
  textAlign: "center",
  cursor: "pointer",
};

export default function Dashboard() {
  const history = useHistory();

  setTwoToneColor('#52C41A');
  getTwoToneColor(); // #eb2f96
  return (
    <MainLayout>
      <PageHeader title="Dashboard" />
      <Divider />
      <Card>
    
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/bills/view")}
        >
          <BankTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Bills</h3>
        </Card.Grid>
        
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/complains/view")}
        >
          <FrownTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Complains</h3>
        </Card.Grid>
       
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/funds/view")}
        >
          <DollarTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Funds</h3>
        </Card.Grid>
        
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/funds/view")}
        >
          <MessageTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Issues</h3>
        </Card.Grid>
        
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/funds/view")}
        >
          <ShopTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Ads</h3>
        </Card.Grid>

        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/members/view")}
        >
          <SmileTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Members</h3>
        </Card.Grid>
       
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/workers/view")}
        >
          <TrophyTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Workers</h3>
        </Card.Grid>
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/drivers/view")}
        >
          <CarTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Drivers</h3>
        </Card.Grid>
        <Card.Grid
          style={gridStyle}
          onClick={() => history.push("/guards/view")}
        >
          <SafetyCertificateTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>Manage Guards</h3>
        </Card.Grid>
        <Card.Grid style={gridStyle} onClick={() => history.push("/alerts")}>
          <AlertTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>View Alerts</h3>
        </Card.Grid>
        <Card.Grid style={gridStyle} onClick={() => history.push("/services")}>
          <GiftTwoTone style={{ fontSize: 30 }} /> <br />
          <h3>View Services</h3>
        </Card.Grid>
      </Card>
    </MainLayout>
  );
}
