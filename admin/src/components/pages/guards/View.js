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
import { CarFilled, SearchOutlined, SafetyOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ButtonGroup from "antd/lib/button/button-group";
import { useHistory } from "react-router-dom";

export default function ViewGuards() {
  const history = useHistory();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [{ loading, data, error }, refetch] = useAuthedAxios("/guard/view");

  const [
    { loading: deleting, data: deleteData, error: deleteError },
    deleteGuard,
  ] = useAuthedAxios(
    {
      url: "/guard/delete",
      method: "POST",
    },
    {
      manual: true,
    }
  );

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

  const onDeleteConfirm = (_id) => {
    deleteGuard({
      data: { _id },
    });
  };

  useEffect(() => {
    if (deleteData) {
      message.success("Guard Deleted Successfully!");
      refetch();
    }
  }, [deleteData]);

  useEffect(() => {
    if (deleteError) {
      message.error("Error deleting guard. Try again!");
    }
  }, [deleteError]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile",
      key: "mobile",
      ...getColumnSearchProps("mobile"),
    },

    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      ...getColumnSearchProps("sector"),
    },

    {
      title: "Block",
      dataIndex: "block",
      key: "block",
      ...getColumnSearchProps("block"),
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (_, record) => (
        <ButtonGroup>
          <Button
            type="dashed"
            disabled={deleting}
            onClick={() =>
              history.push({
                pathname: `/guard/${record._id}/update`,
                state: {
                  guard: record,
                },
              })
            }
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDeleteConfirm(record._id)}
          >
            <Button type="danger" loading={deleting}>
              Delete
            </Button>
          </Popconfirm>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="View All Guards"
        avatar={{
          icon: <SafetyOutlined style={{ color: "black" }} />,
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
      <Spin spinning={loading} tip="Loading Guards...">
        {data && (
          <Table
            columns={columns}
            dataSource={data.guards}
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
    </MainLayout>
  );
}
