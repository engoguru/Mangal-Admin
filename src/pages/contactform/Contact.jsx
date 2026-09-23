// import { Table, Form, Input, Button, Card, Space, Tooltip } from "antd";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AiFillDelete } from "react-icons/ai";
// import CustomModal from "../../components/CustomModal";
// import {
//   deleteContactThunk,
//   getAllContacts,
// } from "../../features/contact/contactSlice";
// import { formatDate } from "../../utils";

// const Contact = () => {
//   const dispatch = useDispatch();

//   const [form] = Form.useForm();

//   const [open, setOpen] = useState(false);
//   const [contactId, setContactId] = useState("");

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [search, setSearch] = useState("");

//   const contactState = useSelector((state) => state.contact.contact);

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     dispatch(
//       getAllContacts({
//         page,
//         limit,
//         search,
//       })
//     );
//   }, [dispatch, page, limit, search]);

//   const showModal = (id) => {
//     setContactId(id);
//     setOpen(true);
//   };

//   const hideModal = () => {
//     setOpen(false);
//     setContactId("");
//   };

//   const deleteContact = async () => {
//     await dispatch(deleteContactThunk(contactId));

//     setOpen(false);

//     dispatch(
//       getAllContacts({
//         page,
//         limit,
//         search,
//       })
//     );
//   };

//   const onFinish = (values) => {
//     setPage(1);
//     setSearch(values.search || "");
//   };

//   const resetFilters = () => {
//     form.resetFields();
//     setSearch("");
//     setPage(1);
//   };

//   const columns = [
//     {
//       title: "#",
//       width: 70,
//       align: "center",
//       render: (_, __, index) => (page - 1) * limit + index + 1,
//     },
//     {
//       title: "Name",
//       dataIndex: "fname",
//       sorter: (a, b) => a.fname.localeCompare(b.fname),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       render: (email) => (
//         <a href={`mailto:${email}`} className="text-decoration-none">
//           {email}
//         </a>
//       ),
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       render: (phone) => (
//         <a href={`tel:${phone}`} className="text-decoration-none">
//           {phone}
//         </a>
//       ),
//     },
//     {
//       title: "Message",
//       dataIndex: "message",
//       ellipsis: {
//         showTitle: true,
//       },
//     },
//     {
//       title: "Date",
//       dataIndex: "createdAt",
//       render: (date) => formatDate(date),
//     },
//     {
//       title: "Action",
//       align: "center",
//       width: 100,
//       render: (_, record) =>
//         user?.admin?.role !== "subadmin" ? (
//           <Tooltip title="Delete">
//             <Button
//               danger
//               type="text"
//               icon={<AiFillDelete size={20} />}
//               onClick={() => showModal(record._id)}
//             />
//           </Tooltip>
//         ) : null,
//     },
//   ];

//   return (
//     <>
//       <Card
//         bordered={false}
//         className="shadow-sm"
//         style={{
//           borderRadius: 12,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
//           <div>
//             <h3 className="mb-1 fw-bold">Contact Queries</h3>
//             <p className="text-muted mb-0">
//               Manage all customer contact requests.
//             </p>
//           </div>

//           <Form
//             form={form}
//             layout="inline"
//             onFinish={onFinish}
//             style={{ marginTop: 10 }}
//           >
//             <Space wrap>
//               <Form.Item name="search" style={{ marginBottom: 0 }}>
//                 <Input.Search
//                   placeholder="Search name, email or message..."
//                   allowClear
//                   enterButton
//                   size="large"
//                   style={{
//                     width: 320,
//                   }}
//                   onSearch={() => form.submit()}
//                 />
//               </Form.Item>

//               <Button size="large" onClick={resetFilters}>
//                 Reset
//               </Button>
//             </Space>
//           </Form>
//         </div>

//         <Table
//           bordered
//           rowKey="_id"
//           columns={columns}
//           dataSource={contactState?.data || []}
//           pagination={{
//             current: contactState?.currentPage || page,
//             total: contactState?.totalRecords || 0,
//             pageSize: contactState?.pageSize || limit,
//             showSizeChanger: true,
//             pageSizeOptions: ["10", "20", "50"],

//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} contacts`,

//             onChange: (current, pageSize) => {
//               setPage(current);
//               setLimit(pageSize);
//             },
//           }}
//         />
//       </Card>

//       <CustomModal
//         open={open}
//         hideModal={hideModal}
//         performAction={deleteContact}
//         title="Are you sure you want to delete this contact?"
//       />
//     </>
//   );
// };

// export default Contact;




import {
  Table,
  Form,
  Input,
  Button,
  Card,
  Space,
  Tooltip,
  Row,
  Col,
  Typography,
  Statistic,
  Divider,
  Empty,
  Avatar,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import { MessageOutlined } from "@ant-design/icons";
import CustomModal from "../../components/CustomModal";
import {
  deleteContactThunk,
  getAllContacts,
} from "../../features/contact/contactSlice";
import { formatDate } from "../../utils";

const { Title, Text } = Typography;

const Contact = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [contactId, setContactId] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const contactState = useSelector((state) => state.contact.contact);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(
      getAllContacts({
        page,
        limit,
        search,
      })
    );
  }, [dispatch, page, limit, search]);

  const showModal = (id) => {
    setContactId(id);
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
    setContactId("");
  };

  const deleteContact = async () => {
    await dispatch(deleteContactThunk(contactId));

    setOpen(false);

    dispatch(
      getAllContacts({
        page,
        limit,
        search,
      })
    );
  };

  const onFinish = (values) => {
    setPage(1);
    setSearch(values.search || "");
  };

  const resetFilters = () => {
    form.resetFields();
    setSearch("");
    setPage(1);
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

  const columns = [
    {
      title: "#",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Name",
      dataIndex: "fname",
      sorter: (a, b) => a.fname.localeCompare(b.fname),
      render: (name) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: "#1677ff" }}>
            {initials(name)}
          </Avatar>
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <a href={`mailto:${email}`} className="text-decoration-none">
          {email}
        </a>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => (
        <a href={`tel:${phone}`} className="text-decoration-none">
          {phone}
        </a>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
      render: (message) => (
        <Tooltip title={message} placement="topLeft">
          <Text
            type="secondary"
            italic
            style={{
              display: "block",
              maxWidth: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            "{message}"
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Action",
      align: "center",
      width: 90,
      fixed: "right",
      render: (_, record) =>
        user?.admin?.role !== "subadmin" ? (
          <Tooltip title="Delete">
            <Button
              danger
              type="text"
              icon={<AiFillDelete size={18} />}
              onClick={() => showModal(record._id)}
            />
          </Tooltip>
        ) : null,
    },
  ];

  return (
    <>
      <Card
        bordered={false}
        className="shadow-sm"
        style={{
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <Row justify="space-between" align="middle" wrap gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ marginBottom: 0 }}>
              Contact Queries
            </Title>
            <Text type="secondary">
              Manage all customer contact requests
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Summary */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" bordered style={{ borderRadius: 10 }}>
              <Space align="center" size={16}>
                <Avatar
                  size={48}
                  style={{ backgroundColor: "#e6f4ff" }}
                  icon={<MessageOutlined style={{ color: "#1677ff", fontSize: 20 }} />}
                />
                <Statistic
                  title="Total Queries"
                  value={contactState?.totalRecords || 0}
                />
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Search */}
        <Card size="small" title="Search Queries" bordered style={{ marginBottom: 24, borderRadius: 10 }}>
          <Form form={form} layout="inline" onFinish={onFinish}>
            <Space wrap>
              <Form.Item name="search" style={{ marginBottom: 0 }}>
                <Input.Search
                  placeholder="Search name, email or message..."
                  allowClear
                  enterButton
                  size="large"
                  style={{
                    width: 320,
                  }}
                  onSearch={() => form.submit()}
                />
              </Form.Item>

              <Button size="large" onClick={resetFilters}>
                Reset
              </Button>
            </Space>
          </Form>
        </Card>

        <Table
          bordered
          rowKey="_id"
          columns={columns}
          dataSource={contactState?.data || []}
          size="middle"
          scroll={{ x: 900 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  search
                    ? `No queries match "${search}"`
                    : "No contact queries yet"
                }
              />
            ),
          }}
          pagination={{
            current: contactState?.currentPage || page,
            total: contactState?.totalRecords || 0,
            pageSize: contactState?.pageSize || limit,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],

            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} contacts`,

            onChange: (current, pageSize) => {
              setPage(current);
              setLimit(pageSize);
            },
          }}
        />
      </Card>

      <CustomModal
        open={open}
        hideModal={hideModal}
        performAction={deleteContact}
        title="Are you sure you want to delete this contact?"
      />
    </>
  );
};

export default Contact;