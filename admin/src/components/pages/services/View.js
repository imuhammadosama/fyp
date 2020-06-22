import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../../shared/Layout";
import {
  PageHeader,
  Divider,
  Table,
  Spin,
  Result,
  Button,
  Input,
  Popconfirm,
  message,
} from "antd";
import { useAuthedAxios } from "../../../config/axios.config";
import { CarFilled, SearchOutlined, UserOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ButtonGroup from "antd/lib/button/button-group";
import { useHistory } from "react-router-dom";
import Service from "../../shared/Service";

export default function ViewServices() {
  const history = useHistory();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [{ loading, data, error }, refetch] = useAuthedAxios("/services/all");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(false);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() =>
          searchInput.current ? searchInput.current.select() : null
        );
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

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
      ...getColumnSearchProps("title"),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile",
      key: "mobile",
      ...getColumnSearchProps("mobile"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Average Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <span>{rating ? `${rating}/5` : "N/A"}</span>,
    },
    {
      title: "Total Orders",
      dataIndex: "totalHiring",
      key: "totalHiring",
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
        title="View All Services"
        avatar={{
          icon: <UserOutlined style={{ color: "black" }} />,
          style: {
            background: "none",
          },
        }}
        extra={[
          <Button type="dashed" key="refresh-button" onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Divider />
      <Spin spinning={loading} tip="Loading Services...">
        {data && (
          <Table
            columns={columns}
            dataSource={data.services}
            rowKey={"_id"}
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
