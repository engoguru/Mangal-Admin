// import { Table, Form, Input, Button, DatePicker, Card, Row, Col } from "antd";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AiFillDelete } from "react-icons/ai";
// import CustomModal from "../../components/CustomModal";
// import { Link } from "react-router-dom";
// import { deleteAbhishekThunk, getAllAbhisheks, searchAbhishekThunk } from "../../features/abhishek/abhishekSlice";
// import { formatDate } from "../../utils";
// import * as XLSX from "xlsx";
// import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
// import jsPDF from "jspdf";
// import { MdOutlineAppRegistration } from "react-icons/md";
// import { FaRupeeSign } from "react-icons/fa";

// const columns = [
//   {
//     title: "S.No.",
//     dataIndex: "key",
//   },
//   {
//     title: "Receipt Number",
//     dataIndex: "receipt",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Email",
//     dataIndex: "email",
//   },
//   {
//     title: "Phone",
//     dataIndex: "phone",
//   },
//   {
//     title: "Date Of Birth",
//     dataIndex: "dob",
//   },
//   {
//     title: "Relationship",
//     dataIndex: "relationship",
//   },
//   {
//     title: "Adhar Card No.",
//     dataIndex: "adhar",
//   },
//   {
//     title: "Visiting Date",
//     dataIndex: "visDate",
//   },
//   {
//     title: "Hall No.",
//     dataIndex: "hall",
//   },
//   {
//     title: "Batch Time",
//     dataIndex: "batch",
//   },
//   {
//     title: "Address",
//     dataIndex: "message",
//   },
//   {
//     title: "Date",
//     dataIndex: "date",
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//   },
// ];

// const pieData = [
//   { name: "Donations", value: 300 },
//   { name: "Bookings", value: 511 },
// ];

// const COLORS = ["#0088FE", "#FF8042"]; // Pie chart colors

// const Abhishek = () => {
//   const [open, setOpen] = useState(false);
//   const [abhId, setAbhId] = useState("");
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getAllAbhisheks());
//   }, [dispatch]);

//   const abhState = useSelector((state) => state?.abhishek?.abhishek);
//   const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));


//   const monthlyData = abhState?.reduce((acc, item) => {
//     const month = new Date(item.date).toLocaleString("en-US", { month: "long" }); // Use "long" for full month names
//     if (!acc[month]) {
//       acc[month] = 0;
//     }
//     acc[month] += 810; // Add the contribution for this booking
//     return acc;
//   }, {});
  
//   // Prepare chart data
//   const monthlyChartData = (monthlyData && Object.keys(monthlyData)?.map((month) => ({
//     name: month, // Full month name
//     amount: monthlyData[month], // Total amount for the month
//   }))) || [];

//   const totalCollection = abhState?.length * 810; 

//   const handleDownload = (abhishek) => {
//     const doc = new jsPDF();
  
//     // Add a decorative header with a colored background
//     doc.setFillColor(63, 81, 181); // Indigo background
//     doc.rect(0, 0, 210, 30, "F");
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(20);
//     doc.setTextColor(255, 255, 255); // White text
  
//     // Add a border around the main content area with reduced size
//     doc.setDrawColor(200, 200, 200); // Light gray
//     doc.rect(20, 40, 170, 180); // Reduced width and height
  
//     // Set font and colors for content
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0); // Black text
  
//     // Add personal details with structured layout
//     const leftMargin = 30;
//     let yPosition = 50;
//     const lineSpacing = 10;
  
//     const details = [
//       { label: "Receipt Number", value: abhishek.receipt_number },
//       { label: "Serial Number", value: abhishek.serial_number },
//       { label: "Name", value: abhishek.name },
//       { label: "Email", value: abhishek.email },
//       { label: "Mobile No", value: abhishek.mobile_no },
//       { label: "Aadhar No", value: abhishek.adhar_no },
//       { label: "Batch Time", value: abhishek.batch_time },
//       { label: "Hall", value: abhishek.hall },
//       { label: "Date", value: new Date(abhishek.date).toLocaleDateString() },
//       { label: "Message", value: abhishek.message },
//     ];
  
//     details.forEach((item) => {
//       doc.setFont("helvetica", "bold");
//       doc.text(`${item.label}:`, leftMargin, yPosition);
//       doc.setFont("helvetica", "normal");
//       doc.text(item.value, leftMargin + 50, yPosition);
//       yPosition += lineSpacing;
//     });
  
//     // Add a footer section with a motivational quote or thank-you note
//     doc.setFont("helvetica", "italic");
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100); // Gray text
//     doc.text("Thank you for visit!", 105, 230, { align: "center" });
  
//     // Save the PDF with a clear file name
//     doc.save(`Slip_${abhishek.name}_${abhishek.receipt_number}.pdf`);
//   };

//   const prepareDataSource = (data) => {
//     return data?.slice().reverse().map((abhishek, index) => ({
//       key: index,
//       receipt: abhishek.receipt_number,
//       name: abhishek.name,
//       email: (
//         <Link to={`mailto:${abhishek.email}`}>{abhishek.email}</Link>
//       ),
//       phone: (
//         <Link to={`tel:+91${abhishek.mobile_no}`}>{abhishek.mobile_no}</Link>
//       ),
//       dob: <p>{formatDate(new Date(abhishek.dob))}</p>,
//       relationship: abhishek.relationship,
//       adhar: abhishek.adhar_no,
//       visDate: <p>{formatDate(new Date(abhishek.date))}</p>,
//       hall: abhishek.hall,
//       batch: abhishek.batch_time,
//       message: abhishek.message,
//       date: <p>{formatDate(new Date(abhishek.created_at))}</p>,
//       action: (
//         <div className="d-flex">
//           {getTokenFromLocalStorage?.admin.role !== "subadmin" && (
//             <button
//               className="ms-3 fs-3 text-danger bg-transparent border-0"
//               onClick={() => showModal(abhishek.id)}
//             >
//               <AiFillDelete />
//             </button>
//           )}
//           <button
//              onClick={() => handleDownload(abhishek)}
//             className="ant-btn ant-btn-primary"
//           >
//             Download Slip
//           </button>
//         </div>
//       ),
//     }));
//   };

//   const data = prepareDataSource(abhState);

//   const showModal = (id) => {
//     setOpen(true);
//     setAbhId(id);
//   };

//   const hideModal = () => {
//     setOpen(false);
//   };

//   const deleteAbhishek = (id) => {
//     dispatch(deleteAbhishekThunk(id));
//     setOpen(false);
//     setTimeout(() => {
//       dispatch(getAllAbhisheks());
//     }, 100);
//   };

//   const onFinish = (values) => {
//     dispatch(searchAbhishekThunk(values));
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       abhState?.map((item, index) => ({
//         "S.No": index + 1,
//         Receipt_Number: item.receipt_number,
//         Name: item.name,
//         Phone: item.mobile_no,
//         Email: item.email,
//         'Date Of Birth': item.Dob,
//         Relationship: item.relationship,
//         Adhar_Number: item.adhar_no,
//         Visiting_Date: formatDate(new Date(item.date)),
//         Hall_Number: item.hall,
//         Batch: item.batch_time,
//         Address: item.message,
//         Date: formatDate(new Date(item.created_at)),
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Abhishek Bookings");
//     XLSX.writeFile(workbook, "Abhishek_Booking_Details.xlsx");
//   };

//   return (
//     <>
//       <div>
//         <h3 className="mb-4 title">Abhishek Dashboard</h3>

//         <div className="" style={{backgroundColor: "#fff", padding:"8px 25px"}}>
//           {/* Dashboard Section */}
//         <Row gutter={16} className="mb-4" >
//           <Col span={6} >
//             <Card title="Total Bookings" bordered style={{backgroundColor: "#ccc"}}>
//               <div className="d-flex ms-auto">
//               <h4><MdOutlineAppRegistration style={{marginRight: "100px", color:"red"}} /></h4> 
//               <h5 style={{color:"green"}}>{abhState?.length || 0}</h5>
//               </div>
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card title="Total Collection" bordered style={{backgroundColor: "#ccc"}}>
//               <div className="d-flex ms-auto">
//               <h4><FaRupeeSign style={{marginRight: "70px", color:"red"}} /></h4> 
//               <h5 style={{color:"green"}}>{totalCollection}</h5>
//               </div>
//             </Card>
//           </Col>
//         </Row>

//         {/* Charts Section */}
    
//           <Col span={12}>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={monthlyChartData}>
//                 <XAxis dataKey="name" /> {/* Use 'name' for the month */}
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="amount" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Col>
//         </div>


//         <div className="search-form-container">
//       {/* Search Form */}
//       <Form layout="inline" onFinish={onFinish} className="search-form">
//         <Form.Item label="Name" name="name">
//           <Input placeholder="Name" />
//         </Form.Item>
//         <Form.Item label="Adhar No" name="adhar_no">
//           <Input placeholder="Adhar No" />
//         </Form.Item>
//         <Form.Item label="Mobile No" name="mobile_no">
//           <Input placeholder="Mobile No" />
//         </Form.Item>
//         <Form.Item label="Receipt Number" name="receipt_number">
//           <Input placeholder="By Receipt ID" />
//         </Form.Item>
//         <Form.Item label="Enter Booking Date" name="date">
//           {/* <DatePicker /> */}
//           <Input placeholder="Enter Date" />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Search
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>

//         <Button type="primary" onClick={downloadExcel} className="ant-btn ant-btn-primary">
//           Download Excel
//         </Button>

//         {/* Table Section */}
//         <Table columns={columns} dataSource={data} />
//       </div>
//       <CustomModal
//         hideModal={hideModal}
//         open={open}
//         performAction={() => deleteAbhishek(abhId)}
//         title="Are you sure you want to delete this Data?"
//       />
//     </>
//   );
// };

// export default Abhishek;


















// import {
//   Table,
//   Form,
//   Input,
//   Button,
//   Card,
//   Row,
//   Col,
//   Select,
// } from "antd";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { AiFillDelete } from "react-icons/ai";
// import { FaRupeeSign } from "react-icons/fa";
// import { MdOutlineAppRegistration } from "react-icons/md";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
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
//       render:(_,__,index)=>
//       (page-1)*limit+index+1
//     },


//     {
//       title:"Receipt",
//       dataIndex:"receipt_number"
//     },


//     {
//       title:"Name",
//       dataIndex:"name"
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
//       dataIndex:"typeOfAbhishek"
//     },


//     {
//       title:"Amount",
//       render:(_,record)=>
//       `₹ ${record.amount || 0}`
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

//       render:(_,record)=>

//       user?.admin?.role !== "subadmin" &&

//       <Button
//         danger
//         type="text"
//         icon={<AiFillDelete size={20}/>}
//         onClick={()=>{
//           setAbhId(record._id);
//           setOpen(true);
//         }}
//       />

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

// <>

// <Card
//  bordered={false}
//  className="shadow-sm"
// >


// <h3>
//  Abhishek Dashboard
// </h3>



// <Row gutter={16}
// className="mb-4">


// <Col span={8}>

// <Card>

// <div className="d-flex justify-content-between">

// <MdOutlineAppRegistration
// size={35}
// color="red"
// />


// <h3>
// {stats.totalAbhishek || 0}
// </h3>


// </div>

// <p>
// Total Abhishek
// </p>


// </Card>

// </Col>




// <Col span={8}>

// <Card>

// <div className="d-flex justify-content-between">

// <FaRupeeSign
// size={35}
// color="green"
// />


// <h3>
// ₹ {stats.totalAmount || 0}
// </h3>


// </div>


// <p>
// Total Collection
// </p>


// </Card>

// </Col>


// </Row>




// <Card title="Monthly Collection">


// <ResponsiveContainer
// width="100%"
// height={300}
// >


// <BarChart
// data={monthlyChartData}
// >


// <XAxis dataKey="name"/>

// <YAxis/>

// <Tooltip/>


// <Bar
// dataKey="amount"
// fill="#1677ff"
// />


// </BarChart>


// </ResponsiveContainer>


// </Card>





// <Form
// layout="inline"
// className="my-4"
// onFinish={onFinish}
// >


// <Form.Item name="search">

// <Input
// placeholder="Search name/email/mobile"
// />

// </Form.Item>



// <Form.Item>

// <Select

// style={{width:200}}

// placeholder="Select Type"

// allowClear

// onChange={(value)=>
// {
// setTypeOfAbhishek(value || "");
// setPage(1);
// }}

// >

// <Select.Option value="Abhishek">
// Abhishek
// </Select.Option>


// <Select.Option value="Panchamrit Abhishek">
// Panchamrit Abhishek
// </Select.Option>


// </Select>


// </Form.Item>



// <Button
// type="primary"
// htmlType="submit"
// >
// Search
// </Button>



// <Button
// className="ms-2"
// onClick={downloadExcel}
// >
// Excel
// </Button>


// </Form>





// <Table

// rowKey="_id"

// columns={columns}

// dataSource={data}


// pagination={{

// current:
// abhState?.pagination?.page || page,


// total:
// abhState?.pagination?.total || 0,


// pageSize:
// limit,


// showSizeChanger:true,


// onChange:(p,l)=>{

// setPage(p);

// setLimit(l);

// }

// }}


// />


// </Card>




// <CustomModal

// open={open}

// hideModal={()=>setOpen(false)}

// performAction={deleteAbhishek}

// title="Are you sure you want to delete this data?"

// />


// </>

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
} from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import * as XLSX from "xlsx";

const { Title, Text } = Typography;


const Abhishek = () => {

  const dispatch = useDispatch();

  const [form] = Form.useForm();


  const [open,setOpen] = useState(false);
  const [abhId,setAbhId] = useState("");

  const [page,setPage] = useState(1);
  const [limit,setLimit] = useState(10);

  const [search,setSearch] = useState("");

  const [
    typeOfAbhishek,
    setTypeOfAbhishek
  ] = useState("");


  const abhState = useSelector(
    state => state.abhishek.abhishek
  );


  const user =
  JSON.parse(localStorage.getItem("user"));


  const data =
  abhState?.data || [];


  const stats =
  abhState?.stats || {};


  const monthlyStats =
  abhState?.monthlyStats || [];



  useEffect(()=>{

    dispatch(
      getAllAbhisheks({
        page,
        limit,
        search,
        typeOfAbhishek
      })
    );

  },[
    page,
    limit,
    search,
    typeOfAbhishek,
    dispatch
  ]);



  const columns=[

    {
      title:"#",
      width: 56,
      render:(_,__,index)=>
      (page-1)*limit+index+1
    },


    {
      title:"Receipt",
      dataIndex:"receipt_number",
      render: (v) => <Tag color="blue" style={{ fontFamily: "monospace" }}>{v}</Tag>
    },


    {
      title:"Name",
      dataIndex:"name",
      render: (v) => <Text strong>{v}</Text>
    },


    {
      title:"Email",
      render:(_,record)=>

      <Link to={`mailto:${record.email}`}>
        {record.email}
      </Link>

    },


    {
      title:"Mobile",
      render:(_,record)=>

      <Link to={`tel:${record.mobile_no}`}>
        {record.mobile_no}
      </Link>

    },


    {
      title:"Type",
      dataIndex:"typeOfAbhishek",
      render: (v) => v ? <Tag color="gold">{v}</Tag> : "-"
    },


    {
      title:"Amount",
      align: "right",
      render:(_,record)=>
      <Text strong style={{ color: "#389e0d" }}>₹{Number(record.amount || 0).toLocaleString()}</Text>
    },


    {
      title:"Hall",
      dataIndex:"hall"
    },


    {
      title:"Batch",
      dataIndex:"batch_time"
    },


    {
      title:"Date",
      render:(_,record)=>
      formatDate(record.createdAt)
    },


    {
      title:"Action",
      fixed: "right",
      width: 80,

      render:(_,record)=>

      user?.admin?.role !== "subadmin" &&

      <Tooltip title="Delete">
        <Button
          danger
          type="text"
          icon={<AiFillDelete size={18}/>}
          onClick={()=>{
            setAbhId(record._id);
            setOpen(true);
          }}
        />
      </Tooltip>

    }

  ];





  const monthlyChartData =
  monthlyStats.map(item=>({

    name:
    `${item._id.month}/${item._id.year}`,

    amount:item.totalAmount,

    count:item.totalAbhishek

  }));





  const deleteAbhishek = async()=>{


    await dispatch(
      deleteAbhishekThunk(abhId)
    );


    setOpen(false);


    dispatch(
      getAllAbhisheks({
        page,
        limit,
        search,
        typeOfAbhishek
      })
    );

  };





  const onFinish=(values)=>{

    setPage(1);

    setSearch(
      values.search || ""
    );

  };


  const resetSearch = () => {
    form.resetFields();
    setSearch("");
    setTypeOfAbhishek("");
    setPage(1);
  };





  const downloadExcel=()=>{


    const worksheet =
    XLSX.utils.json_to_sheet(

      data.map((item,index)=>({

        S_No:index+1,

        Receipt:item.receipt_number,

        Name:item.name,

        Email:item.email,

        Mobile:item.mobile_no,

        Type:item.typeOfAbhishek,

        Amount:item.amount,

        Date:
        formatDate(item.createdAt)

      }))

    );


    const workbook =
    XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Abhishek"
    );


    XLSX.writeFile(
      workbook,
      "abhishek.xlsx"
    );

  };





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
        Abhishek Dashboard
      </Title>
      <Text type="secondary">
        Bookings, collections and monthly trends
      </Text>
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
          <Statistic
            title="Total Abhishek"
            value={stats.totalAbhishek || 0}
          />
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
  <Card title="Monthly Collection" size="small" bordered style={{ borderRadius: 10, marginBottom: 24 }}>

    {monthlyChartData.length === 0 ? (
      <Empty description="No monthly data yet" />
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip formatter={(value, name) => name === "amount" ? [`₹${Number(value).toLocaleString()}`, "Amount"] : [value, "Count"]} />
          <Legend />
          <Bar dataKey="amount" name="Amount" fill="#1677ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}

  </Card>

  {/* Search */}
  <Card size="small" title="Search Abhishek" bordered style={{ marginBottom: 24, borderRadius: 10 }}>
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
    >

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
          <Select.Option value="Abhishek">
            Abhishek
          </Select.Option>
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
    scroll={{ x: 1300 }}
    locale={{
      emptyText: (
        <Empty
          description={
            search || typeOfAbhishek
              ? "No records match your filters"
              : "No abhishek bookings recorded yet"
          }
        />
      )
    }}
    pagination={{
      current:
      abhState?.pagination?.page || page,

      total:
      abhState?.pagination?.total || 0,

      pageSize:
      limit,

      showSizeChanger:true,

      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,

      onChange:(p,l)=>{
        setPage(p);
        setLimit(l);
      }
    }}
  />

  <CustomModal
    open={open}
    hideModal={()=>setOpen(false)}
    performAction={deleteAbhishek}
    title="Are you sure you want to delete this data?"
  />

</Card>

)

};


export default Abhishek;