import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout/Layout";
import { Modal, Button, Form, Input, Select, message, Table, DatePicker, Card } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("all");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);
  const { RangePicker } = DatePicker;

  const columns = [
    { title: "Date", dataIndex: "date", render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span> },
    { title: "Amount", dataIndex: "amount" },
    { title: "Type", dataIndex: "type" },
    { title: "Category", dataIndex: "category" },
    { title: "Reference", dataIndex: "reference" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => { setEditable(record); setShowModal(true); }}
            style={{ cursor: "pointer", color: "blue", fontSize: 18, marginRight: 10 }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record)}
            style={{ cursor: "pointer", color: "red", fontSize: 18 }}
          />
        </div>
      ),
    },
  ];

  const getAllTransaction = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/v1/transactions/get-transaction",
        { userid: user._id, frequency, selectedDate, type }
      );
      setAllTransaction(res.data.transactions || res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch transactions");
    }
  }, [frequency, selectedDate, type]);

  useEffect(() => { getAllTransaction(); }, [getAllTransaction]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/v1/transactions/delete-transaction", { transactionId: record._id });
      setAllTransaction(prev => prev.filter(t => t._id !== record._id));
      setLoading(false);
      message.success("Transaction Deleted");
    } catch (error) {
      setLoading(false);
      message.error("Unable to Delete");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("http://localhost:8080/api/v1/transactions/edit-transaction", {
          transactionId: editable._id, payload: values
        });
        setAllTransaction(prev => prev.map(t => t._id === editable._id ? { ...t, ...values } : t));
        message.success("Transaction Updated successfully");
      } else {
        const res = await axios.post("http://localhost:8080/api/v1/transactions/add-transaction", { ...values, userid: user._id });
        setAllTransaction(prev => [...prev, res.data.transaction || values]);
        message.success("Transaction added successfully");
      }
      setShowModal(false);
      setEditable(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add/edit transaction");
    }
  };

  const handleAddNew = () => { setEditable(null); setShowModal(true); };

  return (
    <Layout>
      {loading && <Spinner />}

      {/* Logout */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}>
        <Button type="primary" danger onClick={handleLogout}>Logout</Button>
      </div>

      {/* Heading */}
      <h1 style={{
        textAlign: "center",
        margin: "30px 0",
        fontSize: 32,
        fontWeight: "bold",
        color: "#1890ff",
        transition: "transform 0.3s",
        cursor: "pointer"
      }}
        onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.target.style.transform = "scale(1)"}
      >
        Expense Management Tracker
      </h1>

      {/* Filters + Icons + Add New */}
      <Card style={{ padding: 20, marginBottom: 30, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20
        }}>
          {/* Frequency */}
          <div>
            <h6 style={{ marginBottom: 5 }}>Select Frequency</h6>
            <Select value={frequency} onChange={setFrequency} style={{ width: 150 }}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency === "custom" && (
              <RangePicker value={selectedDate} onChange={setSelectedDate} style={{ marginTop: 5 }} />
            )}
          </div>

          {/* Type */}
          <div>
            <h6 style={{ marginBottom: 5 }}>Select Type</h6>
            <Select value={type} onChange={setType} style={{ width: 150 }}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </div>

          {/* Icons */}
          <div style={{ display: "flex", gap: 15 }}>
            <UnorderedListOutlined
              className={viewData === "table" ? "active-icon" : "inactive-icon"}
              onClick={() => setViewData("table")}
              style={{ fontSize: 22, cursor: "pointer", transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = "#1890ff"}
              onMouseLeave={e => e.target.style.color = viewData === "table" ? "#1890ff" : "black"}
            />
            <AreaChartOutlined
              className={viewData === "analytics" ? "active-icon" : "inactive-icon"}
              onClick={() => setViewData("analytics")}
              style={{ fontSize: 22, cursor: "pointer", transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = "#1890ff"}
              onMouseLeave={e => e.target.style.color = viewData === "analytics" ? "#1890ff" : "black"}
            />
          </div>

          {/* Add New */}
          <div>
            <Button type="primary" style={{ fontWeight: "bold", padding: "0 20px" }} onClick={handleAddNew}>Add New</Button>
          </div>
        </div>
      </Card>

      {/* Table / Analytics */}
      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransaction} rowKey="_id" bordered pagination={{ pageSize: 6 }} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      {/* Modal */}
      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        bodyStyle={{ padding: 20 }}
        centered
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: "Please enter amount" }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true, message: "Please select type" }]}>
            <Select placeholder="Select type">
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select category" }]}>
            <Select placeholder="Select category">
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select date" }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ fontWeight: "bold" }}>Save</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
