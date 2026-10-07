
// import {
//   Table,
//   Form,
//   Input,
//   Button,
//   Card,
//   Row,
//   Col,
//   Select,
//   Typography,
//   Statistic,
//   Divider,
//   Empty,
//   Tag,
//   Tooltip,
//   Space,
//   Avatar,
// } from "antd";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { AiFillDelete } from "react-icons/ai";
// import { FaRupeeSign } from "react-icons/fa";
// import { MdOutlineAppRegistration } from "react-icons/md";
// import {
//   FileExcelOutlined,
//   ReloadOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip as ChartTooltip,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// import { Link } from "react-router-dom";

// import CustomModal from "../../components/CustomModal";

// import {
//   deleteAbhishekThunk,
//   getAllAbhisheks,
// } from "../../features/abhishek/abhishekSlice";

// import { formatDate } from "../../utils";

// import * as XLSX from "xlsx";

// const { Title, Text } = Typography;


// const Abhishek = () => {

//   const dispatch = useDispatch();

//   const [form] = Form.useForm();


//   const [open,setOpen] = useState(false);
//   const [abhId,setAbhId] = useState("");

//   const [page,setPage] = useState(1);
//   const [limit,setLimit] = useState(10);

//   const [search,setSearch] = useState("");

//   const [
//     typeOfAbhishek,
//     setTypeOfAbhishek
//   ] = useState("");


//   const abhState = useSelector(
//     state => state.abhishek.abhishek
//   );


//   const user =
//   JSON.parse(localStorage.getItem("user"));


//   const data =
//   abhState?.data || [];


//   const stats =
//   abhState?.stats || {};


//   const monthlyStats =
//   abhState?.monthlyStats || [];



//   useEffect(()=>{

//     dispatch(
//       getAllAbhisheks({
//         page,
//         limit,
//         search,
//         typeOfAbhishek
//       })
//     );

//   },[
//     page,
//     limit,
//     search,
//     typeOfAbhishek,
//     dispatch
//   ]);



//   const columns=[

//     {
//       title:"#",
//       width: 56,
//       render:(_,__,index)=>
//       (page-1)*limit+index+1
//     },


//     {
//       title:"Receipt",
//       dataIndex:"receipt_number",
//       render: (v) => <Tag color="blue" style={{ fontFamily: "monospace" }}>{v}</Tag>
//     },


//     {
//       title:"Name",
//       dataIndex:"name",
//       render: (v) => <Text strong>{v}</Text>
//     },


//     {
//       title:"Email",
//       render:(_,record)=>

//       <Link to={`mailto:${record.email}`}>
//         {record.email}
//       </Link>

//     },


//     {
//       title:"Mobile",
//       render:(_,record)=>

//       <Link to={`tel:${record.mobile_no}`}>
//         {record.mobile_no}
//       </Link>

//     },


//     {
//       title:"Type",
//       dataIndex:"typeOfAbhishek",
//       render: (v) => v ? <Tag color="gold">{v}</Tag> : "-"
//     },


//     {
//       title:"Amount",
//       align: "right",
//       render:(_,record)=>
//       <Text strong style={{ color: "#389e0d" }}>₹{Number(record.amount || 0).toLocaleString()}</Text>
//     },


//     {
//       title:"Hall",
//       dataIndex:"hall"
//     },


//     {
//       title:"Batch",
//       dataIndex:"batch_time"
//     },


//     {
//       title:"Date",
//       render:(_,record)=>
//       formatDate(record.createdAt)
//     },


//     {
//       title:"Action",
//       fixed: "right",
//       width: 80,

//       render:(_,record)=>

//       user?.admin?.role !== "subadmin" &&

//       <Tooltip title="Delete">
//         <Button
//           danger
//           type="text"
//           icon={<AiFillDelete size={18}/>}
//           onClick={()=>{
//             setAbhId(record._id);
//             setOpen(true);
//           }}
//         />
//       </Tooltip>

//     }

//   ];





//   const monthlyChartData =
//   monthlyStats.map(item=>({

//     name:
//     `${item._id.month}/${item._id.year}`,

//     amount:item.totalAmount,

//     count:item.totalAbhishek

//   }));





//   const deleteAbhishek = async()=>{


//     await dispatch(
//       deleteAbhishekThunk(abhId)
//     );


//     setOpen(false);


//     dispatch(
//       getAllAbhisheks({
//         page,
//         limit,
//         search,
//         typeOfAbhishek
//       })
//     );

//   };





//   const onFinish=(values)=>{

//     setPage(1);

//     setSearch(
//       values.search || ""
//     );

//   };


//   const resetSearch = () => {
//     form.resetFields();
//     setSearch("");
//     setTypeOfAbhishek("");
//     setPage(1);
//   };





//   const downloadExcel=()=>{


//     const worksheet =
//     XLSX.utils.json_to_sheet(

//       data.map((item,index)=>({

//         S_No:index+1,

//         Receipt:item.receipt_number,

//         Name:item.name,

//         Email:item.email,

//         Mobile:item.mobile_no,

//         Type:item.typeOfAbhishek,

//         Amount:item.amount,

//         Date:
//         formatDate(item.createdAt)

//       }))

//     );


//     const workbook =
//     XLSX.utils.book_new();


//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       "Abhishek"
//     );


//     XLSX.writeFile(
//       workbook,
//       "abhishek.xlsx"
//     );

//   };





// return (

// <Card
//  bordered={false}
//  className="shadow-sm"
//  style={{ borderRadius: 12 }}
// >

//   {/* Header */}
//   <Row justify="space-between" align="middle" wrap gutter={[16, 16]}>
//     <Col>
//       <Title level={3} style={{ marginBottom: 0 }}>
//         Abhishek Dashboard
//       </Title>
//       <Text type="secondary">
//         Bookings, collections and monthly trends
//       </Text>
//     </Col>
//     <Col>
//       <Button
//         type="primary"
//         icon={<FileExcelOutlined />}
//         onClick={downloadExcel}
//         disabled={!data.length}
//       >
//         Export Excel
//       </Button>
//     </Col>
//   </Row>

//   <Divider />

//   {/* Summary stats */}
//   <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>

//     <Col xs={24} sm={12}>
//       <Card size="small" bordered style={{ borderRadius: 10 }}>
//         <Space align="center" size={16}>
//           <Avatar
//             size={48}
//             style={{ backgroundColor: "#fff1f0" }}
//             icon={<MdOutlineAppRegistration size={24} color="#cf1322" />}
//           />
//           <Statistic
//             title="Total Abhishek"
//             value={stats.totalAbhishek || 0}
//           />
//         </Space>
//       </Card>
//     </Col>

//     <Col xs={24} sm={12}>
//       <Card size="small" bordered style={{ borderRadius: 10 }}>
//         <Space align="center" size={16}>
//           <Avatar
//             size={48}
//             style={{ backgroundColor: "#f6ffed" }}
//             icon={<FaRupeeSign size={22} color="#389e0d" />}
//           />
//           <Statistic
//             title="Total Collection"
//             value={stats.totalAmount || 0}
//             formatter={(v) => `₹${Number(v).toLocaleString()}`}
//           />
//         </Space>
//       </Card>
//     </Col>

//   </Row>

//   {/* Monthly chart */}
//   <Card title="Monthly Collection" size="small" bordered style={{ borderRadius: 10, marginBottom: 24 }}>

//     {monthlyChartData.length === 0 ? (
//       <Empty description="No monthly data yet" />
//     ) : (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={monthlyChartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <ChartTooltip formatter={(value, name) => name === "amount" ? [`₹${Number(value).toLocaleString()}`, "Amount"] : [value, "Count"]} />
//           <Legend />
//           <Bar dataKey="amount" name="Amount" fill="#1677ff" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     )}

//   </Card>

//   {/* Search */}
//   <Card size="small" title="Search Abhishek" bordered style={{ marginBottom: 24, borderRadius: 10 }}>
//     <Form
//       form={form}
//       layout="inline"
//       onFinish={onFinish}
//     >

//       <Form.Item name="search">
//         <Input
//           prefix={<SearchOutlined />}
//           placeholder="Search name / email / mobile"
//           allowClear
//           style={{ width: 260 }}
//         />
//       </Form.Item>

//       <Form.Item>
//         <Select
//           style={{ width: 220 }}
//           placeholder="Filter by type"
//           allowClear
//           onChange={(value) => {
//             setTypeOfAbhishek(value || "");
//             setPage(1);
//           }}
//         >
//           <Select.Option value="Abhishek">
//             Abhishek
//           </Select.Option>
//           <Select.Option value="Panchamrit Abhishek">
//             Panchamrit Abhishek
//           </Select.Option>
//         </Select>
//       </Form.Item>

//       <Form.Item>
//         <Space>
//           <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//             Search
//           </Button>
//           <Button icon={<ReloadOutlined />} onClick={resetSearch}>
//             Reset
//           </Button>
//         </Space>
//       </Form.Item>

//     </Form>
//   </Card>

//   {/* Table */}
//   <Table
//     rowKey="_id"
//     columns={columns}
//     dataSource={data}
//     bordered
//     size="middle"
//     scroll={{ x: 1300 }}
//     locale={{
//       emptyText: (
//         <Empty
//           description={
//             search || typeOfAbhishek
//               ? "No records match your filters"
//               : "No abhishek bookings recorded yet"
//           }
//         />
//       )
//     }}
//     pagination={{
//       current:
//       abhState?.pagination?.page || page,

//       total:
//       abhState?.pagination?.total || 0,

//       pageSize:
//       limit,

//       showSizeChanger:true,

//       showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,

//       onChange:(p,l)=>{
//         setPage(p);
//         setLimit(l);
//       }
//     }}
//   />

//   <CustomModal
//     open={open}
//     hideModal={()=>setOpen(false)}
//     performAction={deleteAbhishek}
//     title="Are you sure you want to delete this data?"
//   />

// </Card>

// )

// };


// export default Abhishek;



import {
  Table,
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  Typography,
  Statistic,
  Divider,
  Empty,
  Tag,
  Tooltip,
  Space,
  Avatar,
  Modal,
  message,
} from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { AiFillDelete } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";
import { MdOutlineAppRegistration } from "react-icons/md";
import {
  FileExcelOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Link } from "react-router-dom";

import CustomModal from "../../components/CustomModal";

import {
  deleteAbhishekThunk,
  getAllAbhisheks,
} from "../../features/abhishek/abhishekSlice";

import { formatDate } from "../../utils";
import { base_booking_url2 } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

import * as XLSX from "xlsx";

const { Title, Text } = Typography;

// Same endpoint the QR scanner uses: PATCH {base}/qr/verify/:type/:id
// QR_TYPE must match the "type" segment in the QR code URL of these (online) bookings
const QR_TYPE = "abhishek";

const getStatusApiUrl = (id) => {
  const baseUrl = base_booking_url2.replace(/\/$/, "");
  return `${baseUrl}/qr/verify/${encodeURIComponent(QR_TYPE)}/${encodeURIComponent(id)}`;
};

const Abhishek = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [abhId, setAbhId] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");

  const [typeOfAbhishek, setTypeOfAbhishek] = useState("");

  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const abhState = useSelector((state) => state.abhishek.abhishek);

  const user = JSON.parse(localStorage.getItem("user"));

  const data = abhState?.data || [];

  const stats = abhState?.stats || {};

  const monthlyStats = abhState?.monthlyStats || [];

  const fetchList = () =>
    dispatch(
      getAllAbhisheks({
        page,
        limit,
        search,
        typeOfAbhishek,
      })
    );

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, typeOfAbhishek, dispatch]);

  // Update booking status (completed bookings are locked)
  const updateStatus = async (record, newStatus) => {
    try {
      setStatusUpdatingId(record._id);

      const res = await axios.patch(
        getStatusApiUrl(record._id),
        { status: newStatus },
        config
      );

      if (res.data?.success === false) {
        message.error(res.data.message || "Failed to update status");
        return;
      }

      message.success(`Status updated to ${newStatus}`);
      await fetchList();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleStatusChange = (record, newStatus) => {
    const current = (record.status || "pending").toLowerCase();

    if (current === "completed" || newStatus === current) return;

    if (newStatus === "completed") {
      Modal.confirm({
        title: "Mark this booking as completed?",
        content: "Once completed, the status cannot be changed.",
        okText: "Yes, complete",
        cancelText: "Cancel",
        onOk: () => updateStatus(record, newStatus),
      });
      return;
    }

    updateStatus(record, newStatus);
  };

  const columns = [
    {
      title: "#",
      width: 56,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },

    {
      title: "Receipt",
      dataIndex: "receipt_number",
      render: (v) => (
        <Tag color="blue" style={{ fontFamily: "monospace" }}>
          {v}
        </Tag>
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
      render: (v) => <Text strong>{v}</Text>,
    },

    {
      title: "Email",
      render: (_, record) => (
        <Link to={`mailto:${record.email}`}>{record.email}</Link>
      ),
    },

    {
      title: "Mobile",
      render: (_, record) => (
        <Link to={`tel:${record.mobile_no}`}>{record.mobile_no}</Link>
      ),
    },

    {
      title: "Type",
      dataIndex: "typeOfAbhishek",
      render: (v) => (v ? <Tag color="gold">{v}</Tag> : "-"),
    },

    {
      title: "Amount",
      align: "right",
      render: (_, record) => (
        <Text strong style={{ color: "#389e0d" }}>
          ₹{Number(record.amount || 0).toLocaleString()}
        </Text>
      ),
    },

    {
      title: "Hall",
      dataIndex: "hall",
    },

    {
      title: "Batch",
      dataIndex: "batch_time",
    },

    {
      title: "Status",
      width: 150,
      render: (_, record) => {
        const status = (record.status || "pending").toLowerCase();

        // Completed: locked
        if (status === "completed") {
          return <Tag color="success">COMPLETED</Tag>;
        }

        return (
          <Select
            size="small"
            value={status}
            style={{ width: 120 }}
            loading={statusUpdatingId === record._id}
            disabled={statusUpdatingId === record._id}
            onChange={(value) => handleStatusChange(record, value)}
            options={[
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        );
      },
    },

    {
      title: "Date",
      render: (_, record) => formatDate(record.createdAt),
    },

    {
      title: "Action",
      fixed: "right",
      width: 80,

      render: (_, record) =>
        user?.admin?.role !== "subadmin" && (
          <Tooltip title="Delete">
            <Button
              danger
              type="text"
              icon={<AiFillDelete size={18} />}
              onClick={() => {
                setAbhId(record._id);
                setOpen(true);
              }}
            />
          </Tooltip>
        ),
    },
  ];

  const monthlyChartData = monthlyStats.map((item) => ({
    name: `${item._id.month}/${item._id.year}`,

    amount: item.totalAmount,

    count: item.totalAbhishek,
  }));

  const deleteAbhishek = async () => {
    await dispatch(deleteAbhishekThunk(abhId));

    setOpen(false);

    fetchList();
  };

  const onFinish = (values) => {
    setPage(1);

    setSearch(values.search || "");
  };

  const resetSearch = () => {
    form.resetFields();
    setSearch("");
    setTypeOfAbhishek("");
    setPage(1);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item, index) => ({
        S_No: index + 1,

        Receipt: item.receipt_number,

        Name: item.name,

        Email: item.email,

        Mobile: item.mobile_no,

        Type: item.typeOfAbhishek,

        Amount: item.amount,

        Status: item.status,

        Date: formatDate(item.createdAt),
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Abhishek");

    XLSX.writeFile(workbook, "abhishek.xlsx");
  };

  return (
    <Card bordered={false} className="shadow-sm" style={{ borderRadius: 12 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" wrap gutter={[16, 16]}>
        <Col>
          <Title level={3} style={{ marginBottom: 0 }}>
            Abhishek Dashboard
          </Title>
          <Text type="secondary">Bookings, collections and monthly trends</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={downloadExcel}
            disabled={!data.length}
          >
            Export Excel
          </Button>
        </Col>
      </Row>

      <Divider />

      {/* Summary stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card size="small" bordered style={{ borderRadius: 10 }}>
            <Space align="center" size={16}>
              <Avatar
                size={48}
                style={{ backgroundColor: "#fff1f0" }}
                icon={<MdOutlineAppRegistration size={24} color="#cf1322" />}
              />
              <Statistic title="Total Abhishek" value={stats.totalAbhishek || 0} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card size="small" bordered style={{ borderRadius: 10 }}>
            <Space align="center" size={16}>
              <Avatar
                size={48}
                style={{ backgroundColor: "#f6ffed" }}
                icon={<FaRupeeSign size={22} color="#389e0d" />}
              />
              <Statistic
                title="Total Collection"
                value={stats.totalAmount || 0}
                formatter={(v) => `₹${Number(v).toLocaleString()}`}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Monthly chart */}
      <Card
        title="Monthly Collection"
        size="small"
        bordered
        style={{ borderRadius: 10, marginBottom: 24 }}
      >
        {monthlyChartData.length === 0 ? (
          <Empty description="No monthly data yet" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip
                formatter={(value, name) =>
                  name === "amount"
                    ? [`₹${Number(value).toLocaleString()}`, "Amount"]
                    : [value, "Count"]
                }
              />
              <Legend />
              <Bar
                dataKey="amount"
                name="Amount"
                fill="#1677ff"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Search */}
      <Card
        size="small"
        title="Search Abhishek"
        bordered
        style={{ marginBottom: 24, borderRadius: 10 }}
      >
        <Form form={form} layout="inline" onFinish={onFinish}>
          <Form.Item name="search">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search name / email / mobile"
              allowClear
              style={{ width: 260 }}
            />
          </Form.Item>

          <Form.Item>
            <Select
              style={{ width: 220 }}
              placeholder="Filter by type"
              allowClear
              onChange={(value) => {
                setTypeOfAbhishek(value || "");
                setPage(1);
              }}
            >
              <Select.Option value="Abhishek">Abhishek</Select.Option>
              <Select.Option value="Panchamrit Abhishek">
                Panchamrit Abhishek
              </Select.Option>
            </Select>
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
        columns={columns}
        dataSource={data}
        bordered
        size="middle"
        scroll={{ x: 1400 }}
        locale={{
          emptyText: (
            <Empty
              description={
                search || typeOfAbhishek
                  ? "No records match your filters"
                  : "No abhishek bookings recorded yet"
              }
            />
          ),
        }}
        pagination={{
          current: abhState?.pagination?.page || page,

          total: abhState?.pagination?.total || 0,

          pageSize: limit,

          showSizeChanger: true,

          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} records`,

          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
      />

      <CustomModal
        open={open}
        hideModal={() => setOpen(false)}
        performAction={deleteAbhishek}
        title="Are you sure you want to delete this data?"
      />
    </Card>
  );
};

export default Abhishek;