import React, { useState, useEffect } from "react";
import MainLayout from "../shared/Layout";
import {
  PageHeader,
  Button,
  Divider,
  List,
  Skeleton,
  Switch,
  Modal,
  Descriptions,
} from "antd";
import { useAuthedAxios } from "../../config/axios.config";

export default function Alerts() {
  const [status, setStatus] = useState("Unresolved");

  const [showGuardInfo, setShowGuardInfo] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState({});

  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const [selectedMember, setSelectedMember] = useState({});

  const [{ loading, data, error }, refetch] = useAuthedAxios({
    url: "/guard/alerts",
    method: "get",
    params: {
      status,
    },
  });

  console.log(loading, data, error);

  return (
    <MainLayout>
      <PageHeader
        title="Alerts"
        subTitle="View information of generated alerts by members"
        extra={[
          <Button type="dashed" key="refresh-button" onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Divider />
      {!loading && data && (
        <div style={{ marginBottom: 20, textAlign: "right" }}>
          <Switch
            checkedChildren="Resolved"
            unCheckedChildren="Unresolved"
            checked={status === "Resolved"}
            onChange={(checked) =>
              setStatus(checked ? "Resolved" : "Unresolved")
            }
          />
        </div>
      )}
      <Divider />
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={data ? data.alerts : []}
        bordered
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="guard-info"
                type="ghost"
                onClick={() => {
                  setShowGuardInfo(true);
                  setSelectedGuard(item.guard);
                }}
              >
                View Guard Info
              </Button>,
              <Button
                key="member-info"
                type="ghost"
                onClick={() => {
                  setShowMemberInfo(true);
                  setSelectedMember(item.member);
                }}
              >
                View Member Info
              </Button>,
            ]}
            extra={[
              <div key="status" style={{ textAlign: "right" }}>
                <p>
                  <b
                    style={{
                      color: item.status === "Resolved" ? "green" : "red",
                    }}
                  >
                    {item.status}
                  </b>
                </p>
              </div>,
              <div key="status12">
                <p>
                  <b>Generated At:</b> {new Date(item.createdAt).toUTCString()}
                </p>
                {item.status === "Resolved" && (
                  <p>
                    <b>Resolved At:</b> {new Date(item.updatedAt).toUTCString()}
                  </p>
                )}
              </div>,
            ]}
          >
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </Skeleton>
          </List.Item>
        )}
      />
      <Modal
        title="Guard Info"
        visible={showGuardInfo}
        footer={null}
        onCancel={() => setShowGuardInfo(false)}
        width={"60%"}
      >
        <Descriptions layout="vertical" bordered>
          <Descriptions.Item label="Name">
            {selectedGuard.name}
          </Descriptions.Item>
          <Descriptions.Item label="Mobile Number">
            {selectedGuard.mobile}
          </Descriptions.Item>
          <Descriptions.Item label="Sector">
            {selectedGuard.sector}
          </Descriptions.Item>
          <Descriptions.Item label="Block">
            {selectedGuard.block}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(selectedGuard.createdAt).toUTCString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {new Date(selectedGuard.updatedAt).toUTCString()}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Modal
        title="Member Info"
        visible={showMemberInfo}
        footer={null}
        onCancel={() => setShowMemberInfo(false)}
        width={"60%"}
      >
        <Descriptions layout="vertical" bordered>
          <Descriptions.Item label="Name">
            {selectedMember.name}
          </Descriptions.Item>
          <Descriptions.Item label="Mobile Number">
            {selectedMember.mobile}
          </Descriptions.Item>
          <Descriptions.Item label="House Number">
            {selectedMember.houseNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Sector">
            {selectedMember.sector}
          </Descriptions.Item>
          <Descriptions.Item label="Block">
            {selectedMember.block}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(selectedMember.createdAt).toUTCString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {new Date(selectedMember.updatedAt).toUTCString()}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </MainLayout>
  );
}
