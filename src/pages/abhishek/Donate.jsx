
import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Card,
  Space,
  Tag,
  Tooltip,
  Row,
  Col,
  Typography,
  Statistic,
  Divider,
  Empty,
  Avatar,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  WalletOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";

import CustomModal from "../../components/CustomModal";
import { formatDate } from "../../utils";

import {
  deleteDonateThunk,
  getAllDonates,
} from "../../features/donate/donateSlice";

const { Title, Text } = Typography;


const Donate = () => {

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [donateId, setDonateId] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);


  const donateState = useSelector(
    (state) => state.donate.donate
  );


  const loading = useSelector(
    (state) => state.donate.loading
  );


  const user = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {

    dispatch(
      getAllDonates({
        page,
        limit,
        search
      })
    );

  }, [
    dispatch,
    page,
    limit,
    search
  ]);



  const showModal = (id) => {
    setDonateId(id);
    setOpen(true);
  }


  const hideModal = () => {
    setOpen(false);
  }



  const deleteDonate = () => {

    dispatch(deleteDonateThunk(donateId));

    setOpen(false);

    setTimeout(() => {
      dispatch(
        getAllDonates({
          page,
          limit,
          search
        })
      );
    }, 300)

  }



  const handleSearch = (values) => {

    let value =
      values.name ||
      values.mobile_no ||
      values.receipt_number ||
      "";

    setSearch(value);
    setPage(1);

  }



  const resetSearch = () => {

    form.resetFields();

    setSearch("");

    setPage(1);

  }



  const downloadExcel = () => {


    const rows =
      donateState?.data?.map((item, index) => ({

        "S.No": index + 1,

        "Receipt Number":
          item.receipt_number,

        "Name":
          item.name,

        "Amount":
          item.amount,

        "Mobile":
          item.mobile_no,

        "Email":
          item.email,

        "Address":
          item.address,

        "Date":
          formatDate(new Date(item.createdAt))

      })) || [];



    const sheet =
      XLSX.utils.json_to_sheet(rows);


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      sheet,
      "Donations"
    );


    XLSX.writeFile(
      workbook,
      "Donation_Report.xlsx"
    );

  }




  const downloadSlip = (item) => {


    const pdf = new jsPDF();


    pdf.setFillColor(
      255,
      193,
      7
    );

    pdf.rect(
      0,
      0,
      210,
      35,
      "F"
    );


    pdf.setFontSize(20);
    pdf.text(
      "Mangal Grah Mandir",
      105,
      15,
      { align: "center" }
    );


    pdf.setFontSize(14);

    pdf.text(
      "Donation Receipt",
      105,
      25,
      { align: "center" }
    );



    let y = 55;


    const details = [

      ["Receipt Number",
        item.receipt_number],

      ["Name",
        item.name],

      ["Amount",
        `₹ ${item.amount}`],

      ["Mobile",
        item.mobile_no],

      ["Email",
        item.email],

      ["Address",
        item.address],

      ["Date",
        formatDate(new Date(item.createdAt))]

    ];



    details.forEach(([key, value]) => {


      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.text(
        `${key}:`,
        20,
        y
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.text(
        String(value || ""),
        70,
        y
      );


      y += 12;

    });



    pdf.setFontSize(12);

    pdf.text(
      "Thank you for your valuable donation.",
      105,
      250,
      { align: "center" }
    );


    pdf.save(
      `${item.receipt_number}.pdf`
    );

  }


  const pageTotalAmount =
    donateState?.data?.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    ) || 0;


  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase())
      .join("");


  const columns = [

    {
      title: "#",
      width: 60,
      render: (_, __, index) =>
        (page - 1) * limit + index + 1
    },


    {
      title: "Receipt",
      dataIndex: "receipt_number",
      render: (v) =>
        <Tag color="blue" style={{ fontFamily: "monospace" }}>{v}</Tag>
    },


    {
      title: "Donor",
      dataIndex: "name",
      render: (name) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: "#faad14" }}>
            {initials(name)}
          </Avatar>
          <Text strong>{name}</Text>
        </Space>
      )
    },


    {
      title: "Amount",
      dataIndex: "amount",
      align: "right",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      render: (v) =>
        <Text strong style={{ color: "#389e0d" }}>₹{Number(v).toLocaleString()}</Text>
    },


    {
      title: "Contact",
      render: (_, item) =>
        <Space direction="vertical" size={0}>
          <Link to={`mailto:${item.email}`}>
            {item.email}
          </Link>
          <Link to={`tel:${item.mobile_no}`}>
            {item.mobile_no}
          </Link>
        </Space>
    },


    {
      title: "Date",
      render: (_, item) =>
        formatDate(
          new Date(item.createdAt)
        )
    },


    {
      title: "Action",
      fixed: "right",
      width: 110,
      render: (_, item) => (

        <Space>

          <Tooltip title="Download slip">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadSlip(item)}
            />
          </Tooltip>

          {
            user?.user?.role !== "subadmin" &&

            <Tooltip title="Delete donation">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => showModal(item._id)}
              />
            </Tooltip>

          }

        </Space>

      )
    }


  ];



  return (

    <Card
      bordered={false}
      className="shadow-sm"
      style={{ borderRadius: 12 }}
    >

      {/* Header */}
      <Row justify="space-between" align="middle" wrap gutter={[16, 16]}>
        <Col>
          <Title level={3} style={{ marginBottom: 0 }}>
            Donation Management
          </Title>
          <Text type="secondary">
            Track, search and export donation records
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={downloadExcel}
            disabled={!donateState?.data?.length}
          >
            Export Excel
          </Button>
        </Col>
      </Row>

      <Divider />

      {/* Summary stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
        <Col xs={12} md={8}>
          <Card size="small" bordered style={{ borderRadius: 10 }}>
            <Statistic
              title="Donations (all records)"
              value={donateState?.pagination?.totalRecords || 0}
              prefix={<TeamOutlined style={{ color: "#1677ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card size="small" bordered style={{ borderRadius: 10 }}>
            <Statistic
              title="Total amount (this page)"
              value={pageTotalAmount}
              precision={0}
              prefix={<WalletOutlined style={{ color: "#389e0d" }} />}
              formatter={(v) => `₹${Number(v).toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" bordered style={{ borderRadius: 10 }}>
            <Statistic
              title="Showing"
              value={donateState?.data?.length || 0}
              suffix={`of ${donateState?.pagination?.totalRecords || 0} records`}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Search */}
      <Card
        size="small"
        title="Search Donations"
        bordered
        style={{ marginBottom: 24, borderRadius: 10 }}
      >
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="name">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by name"
              allowClear
            />
          </Form.Item>

          <Form.Item name="mobile_no">
            <Input placeholder="Mobile number" allowClear />
          </Form.Item>

          <Form.Item name="receipt_number">
            <Input placeholder="Receipt number" allowClear />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Search
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetSearch}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Table */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={donateState?.data || []}
        bordered
        size="middle"
        scroll={{ x: 1200 }}
        locale={{
          emptyText: (
            <Empty
              description={
                search
                  ? `No donations match "${search}"`
                  : "No donations recorded yet"
              }
            />
          )
        }}
        pagination={{
          current: page,
          pageSize: limit,
          total: donateState?.pagination?.totalRecords,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} donations`,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          }
        }}
      />

      <CustomModal
        open={open}
        hideModal={hideModal}
        performAction={deleteDonate}
        title="Are you sure you want to delete this donation?"
      />

    </Card>

  )

}


export default Donate;