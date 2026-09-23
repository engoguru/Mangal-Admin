// // import { Table, Form, Input, Button } from "antd";
// // import { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { AiFillDelete } from "react-icons/ai";
// // import CustomModal from "../../components/CustomModal";
// // import { Link } from "react-router-dom";
// // import { formatDate } from "../../utils";
// // import { IoIosMail } from "react-icons/io";
// // import axios from "axios";
// // import { base_url } from "../../utils/base_url";
// // import * as XLSX from "xlsx";
// // import jsPDF from "jspdf";
// // import { deleteDonateThunk, getAllDonates, searchDonateThunk } from "../../features/donate/donateSlice";

// // const columns = [
// //     {
// //       title: "S.No.",
// //       dataIndex: "key",
// //     },
// //     {
// //       title: "Receipt Number",
// //       dataIndex: "receipt",
// //     },
// //     {
// //       title: "Name",
// //       dataIndex: "name",
// //     },
// //     {
// //       title: "Amount",
// //       dataIndex: "amount",
// //     },
// //     {
// //       title: "Email",
// //       dataIndex: "email",
// //     },
// //     {
// //       title: "Phone",
// //       dataIndex: "phone",
// //     },
// //     {
// //       title: "Address",
// //       dataIndex: "address",
// //     },
// //     {
// //       title: "Date",
// //       dataIndex: "date",
// //     },
// //     {
// //       title: "Action",
// //       dataIndex: "action",
// //     },
// //   ];


// // const Donate = () => {
// //   const [open, setOpen] = useState(false);
// //   const [pnchId, setPnchId] = useState("");
// //   // const [confirmButtonColors, setConfirmButtonColors] = useState({}); // State to manage button colors for each item

// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     dispatch(getAllDonates());
// //   }, [dispatch]);

// //   const donState = useSelector((state) => state?.donate?.donate);

// //   const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));
// // // console.log(donState,"opo-donate",getTokenFromLocalStorage)
// //   const handleDownload = (donation ) => {
// //     const doc = new jsPDF();

// //     // Add a decorative header with a colored background
// //     doc.setFillColor(63, 81, 181); // Indigo background
// //     doc.rect(0, 0, 210, 30, "F");
// //     doc.setFont("helvetica", "bold");
// //     doc.setFontSize(20);
// //     doc.setTextColor(255, 255, 255); // White text
// //     doc.text("Mangal Grah Sewa Sanstha", 105, 15, { align: "center" });
// //     doc.text("Donation", 105, 25, { align: "center" });

// //     // Add a border around the main content area with reduced size
// //     doc.setDrawColor(200, 200, 200); // Light gray
// //     doc.rect(20, 40, 140, 160); // Reduced width and height

// //     // Set font and colors for content
// //     doc.setFont("helvetica", "normal");
// //     doc.setFontSize(12);
// //     doc.setTextColor(0, 0, 0); // Black text

// //     // Add personal details with structured layout
// //     const leftMargin = 30;
// //     let yPosition = 50;
// //     const lineSpacing = 10;

// //     const details = [
// //       { label: "Receipt Number", value: donation.receipt_number },
// //       { label: "Name", value: donation.name },
// //       { label: "Email", value: donation.email },
// //       { label: "Mobile No", value: donation.mobile_no },
// //       { label: "Date", value: new Date(donation.createdAt).toLocaleDateString() },
// //       { label: "Address", value: donation.address },
// //     ];

// //     details.forEach((item) => {
// //       doc.setFont("helvetica", "bold");
// //       doc.text(`${item.label}:`, leftMargin, yPosition);
// //       doc.setFont("helvetica", "normal");
// //       doc.text(`${item.value}`, leftMargin + 50, yPosition);
// //       yPosition += lineSpacing;
// //     });

// //     // Add a footer section with a motivational quote or thank-you note
// //     doc.setFont("helvetica", "italic");
// //     doc.setFontSize(10);
// //     doc.setTextColor(100, 100, 100); // Gray text
// //     doc.text("Thank you for donate!", 105, 230, { align: "center" }); // Adjusted to fit within the smaller box

// //     // Save the PDF with a clear file name
// //     doc.save(`Slip_${donation.name}_${donation.receipt_number}.pdf`);
// //   };

// //   // const handleConfirmClick = async (special) => {
// //   //   try {
// //   //     // Send email
// //   //     const response = await axios.get(`${base_url}/special/send-confirmation-email/${special.id}`, { email: special.email, name: special.name });

// //   //     if (response.status === 200) {
// //   //       setConfirmButtonColors(prev => ({ ...prev, [special.id]: 'green' })); // Change button color to green on success
// //   //     } else {
// //   //       setConfirmButtonColors(prev => ({ ...prev, [special.id]: 'red' })); // Change button color to red on failure
// //   //     }
// //   //   } catch (error) {
// //   //     console.error("Email send failed", error);
// //   //     setConfirmButtonColors(prev => ({ ...prev, [special.id]: 'red' })); // Change button color to red on error
// //   //   }
// //   // };

// //   const data = donState?.data?.slice().reverse().map((donation, index) => ({
// //     key: index,
// //     receipt: donation.receipt_number,
// //     name: donation.name,
// //     amount: donation.amount,
// //     email: (
// //       <div>
// //         <Link to={`mailto:${donation.email}`}>{donation.email}</Link>
// //       </div>
// //     ),
// //     phone: (
// //       <div>
// //         <Link to={`tel:+91${donation.mobile_no}`}>{donation.mobile_no}</Link>
// //       </div>
// //     ),
// //     address: donation.address,
// //     date: <p>{formatDate(new Date(donation.createdAt))}</p>,
// //     action: (
// //       <div className="d-flex">
// //         {getTokenFromLocalStorage?.user.role !== "subadmin" && (
// //             <button
// //               className="ms-3 fs-3 text-danger bg-transparent border-0"
// //               onClick={() => showModal(donation.id)}
// //             >
// //               <AiFillDelete />
// //             </button>
// //           )}
// //         <button
// //           onClick={() => handleDownload(donation)}
// //           style={{
// //             padding: "10px",
// //             background: "blue",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "5px",
// //             marginLeft: "10px",
// //           }}
// //         >
// //           Download Slip
// //         </button>
// //       </div>
// //       ),
// //     }));

// //   const showModal = (e) => {
// //     setOpen(true);
// //     setPnchId(e);
// //   };

// //   const hideModal = () => {
// //     setOpen(false);
// //   };

// //   const deleteDonate = (e) => {
// //     dispatch(deleteDonateThunk(e))
// //     setOpen(false);
// //     setTimeout(() => {
// //       dispatch(getAllDonates());
// //     }, 100);
// //   };

// //   const onFinish = (values) => {
// //     dispatch(searchDonateThunk(values));
// //   };

// //   const downloadExcel = () => {
// //     const worksheet = XLSX.utils.json_to_sheet(
// //       donState.map((item, index) => ({
// //         "S.No": index + 1,
// //         Receipt_Number: item.receipt_number,
// //         Name: item.name,
// //         Amount: item.amount,
// //         Phone: item.mobile_no,
// //         Email: item.email,
// //         Address: item.address,
// //         Date: formatDate(new Date(item.created_at)),
// //       }))
// //     );
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Donation Detials");
// //     XLSX.writeFile(workbook, "Donation_Details.xlsx");
// //   }


// //   return (
// //     <>
// //       <div>
// //         <h3 className="mb-4 title">Donation</h3>
// //         <Button type="primary" onClick={downloadExcel} style={{ marginBottom: "20px" }}>
// //           Download Excel
// //         </Button>
// //         <Form layout="inline" onFinish={onFinish} className="mb-4">
// //           <Form.Item name="name" label="Name">
// //             <Input placeholder="Name" />
// //           </Form.Item>
// //           <Form.Item name="mobile_no" label="Mobile No">
// //             <Input placeholder="Mobile No" />
// //           </Form.Item>
// //           <Form.Item name="receipt_number" label="Receipt Number">
// //             <Input placeholder="By Receipt ID" />
// //           </Form.Item>
// //           <Form.Item>
// //             <Button type="primary" htmlType="submit">
// //               Search
// //             </Button>
// //           </Form.Item>
// //         </Form>
// //         <Table columns={columns} dataSource={data} />
// //       </div>
// //       <CustomModal
// //         hideModal={hideModal}
// //         open={open}
// //         performAction={() => deleteDonate(pnchId)}
// //         title="Are you sure you want to delete this Data?"
// //       />
// //     </>
// //   )
// // }

// // export default Donate


// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Form,
//   Input,
//   Button,
//   Card,
//   Space,
//   Tag,
//   Tooltip,
// } from "antd";
// import {
//   DeleteOutlined,
//   DownloadOutlined,
//   SearchOutlined,
//   ReloadOutlined,
// } from "@ant-design/icons";

// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { AiFillDelete } from "react-icons/ai";

// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";

// import CustomModal from "../../components/CustomModal";
// import { formatDate } from "../../utils";

// import {
//   deleteDonateThunk,
//   getAllDonates,
// } from "../../features/donate/donateSlice";


// const Donate = () => {

//   const dispatch = useDispatch();

//   const [form] = Form.useForm();

//   const [open, setOpen] = useState(false);
//   const [donateId, setDonateId] = useState("");

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);


//   const donateState = useSelector(
//     (state) => state.donate.donate
//   );


//   const loading = useSelector(
//     (state) => state.donate.loading
//   );


//   const user = JSON.parse(localStorage.getItem("user"));


//   useEffect(() => {

//     dispatch(
//       getAllDonates({
//         page,
//         limit,
//         search
//       })
//     );

//   }, [
//     dispatch,
//     page,
//     limit,
//     search
//   ]);



//   const showModal = (id) => {
//     setDonateId(id);
//     setOpen(true);
//   }


//   const hideModal = () => {
//     setOpen(false);
//   }



//   const deleteDonate = () => {

//     dispatch(deleteDonateThunk(donateId));

//     setOpen(false);

//     setTimeout(() => {
//       dispatch(
//         getAllDonates({
//           page,
//           limit,
//           search
//         })
//       );
//     }, 300)

//   }



//   const handleSearch = (values) => {

//     let value =
//       values.name ||
//       values.mobile_no ||
//       values.receipt_number ||
//       "";

//     setSearch(value);
//     setPage(1);

//   }



//   const resetSearch = () => {

//     form.resetFields();

//     setSearch("");

//     setPage(1);

//   }



//   const downloadExcel = () => {


//     const rows =
//       donateState?.data?.map((item, index) => ({

//         "S.No": index + 1,

//         "Receipt Number":
//           item.receipt_number,

//         "Name":
//           item.name,

//         "Amount":
//           item.amount,

//         "Mobile":
//           item.mobile_no,

//         "Email":
//           item.email,

//         "Address":
//           item.address,

//         "Date":
//           formatDate(new Date(item.createdAt))

//       })) || [];



//     const sheet =
//       XLSX.utils.json_to_sheet(rows);


//     const workbook =
//       XLSX.utils.book_new();


//     XLSX.utils.book_append_sheet(
//       workbook,
//       sheet,
//       "Donations"
//     );


//     XLSX.writeFile(
//       workbook,
//       "Donation_Report.xlsx"
//     );

//   }




//   const downloadSlip = (item) => {


//     const pdf = new jsPDF();


//     pdf.setFillColor(
//       255,
//       193,
//       7
//     );

//     pdf.rect(
//       0,
//       0,
//       210,
//       35,
//       "F"
//     );


//     pdf.setFontSize(20);
//     pdf.text(
//       "Mangal Grah Mandir",
//       105,
//       15,
//       { align: "center" }
//     );


//     pdf.setFontSize(14);

//     pdf.text(
//       "Donation Receipt",
//       105,
//       25,
//       { align: "center" }
//     );



//     let y = 55;


//     const details = [

//       ["Receipt Number",
//         item.receipt_number],

//       ["Name",
//         item.name],

//       ["Amount",
//         `₹ ${item.amount}`],

//       ["Mobile",
//         item.mobile_no],

//       ["Email",
//         item.email],

//       ["Address",
//         item.address],

//       ["Date",
//         formatDate(new Date(item.createdAt))]

//     ];



//     details.forEach(([key, value]) => {


//       pdf.setFont(
//         "helvetica",
//         "bold"
//       );

//       pdf.text(
//         `${key}:`,
//         20,
//         y
//       );


//       pdf.setFont(
//         "helvetica",
//         "normal"
//       );


//       pdf.text(
//         String(value || ""),
//         70,
//         y
//       );


//       y += 12;

//     });



//     pdf.setFontSize(12);

//     pdf.text(
//       "Thank you for your valuable donation.",
//       105,
//       250,
//       { align: "center" }
//     );


//     pdf.save(
//       `${item.receipt_number}.pdf`
//     );

//   }





//   const columns = [

//     {
//       title: "#",
//       render: (_, __, index) =>
//         (page - 1) * limit + index + 1
//     },


//     {
//       title: "Receipt",
//       dataIndex: "receipt_number",
//       render: (v) =>
//         <Tag color="blue">{v}</Tag>
//     },


//     {
//       title: "Name",
//       dataIndex: "name"
//     },


//     {
//       title: "Amount",
//       dataIndex: "amount",
//       render: (v) =>
//         <b>₹ {v}</b>
//     },


//     {
//       title: "Contact",
//       render: (_, item) =>
//         <>
//           <Link to={`mailto:${item.email}`}>
//             {item.email}
//           </Link>
//           <br />
//           <Link to={`tel:${item.mobile_no}`}>
//             {item.mobile_no}
//           </Link>
//         </>
//     },


//     {
//       title: "Date",
//       render: (_, item) =>
//         formatDate(
//           new Date(item.createdAt)
//         )
//     },


//     {
//       title: "Action",
//       fixed: "right",
//       render: (_, item) => (

//         <Space>


//           {
//             user?.user?.role !== "subadmin" &&

//             <Tooltip title="Delete">

//               <Button
//                 danger
//                 icon={<DeleteOutlined />}
//                 onClick={() =>
//                   showModal(item._id)
//                 }
//               />

//             </Tooltip>

//           }



//           <Tooltip title="Download">

//             <Button

//               type="primary"

//               icon={
//                 <DownloadOutlined />
//               }

//               onClick={() =>
//                 downloadSlip(item)
//               }

//             />

//           </Tooltip>


//         </Space>

//       )
//     }


//   ];



//   return (

//     <Card
//       bordered={false}
//       className="shadow-sm"

//     >


//       <div className="d-flex justify-content-between mb-4">

//         <h3>
//           Donation Management
//         </h3>


//         <Button
//           type="primary"
//           onClick={downloadExcel}
//         >
//           Export Excel
//         </Button>


//       </div>




//       <Form
//         form={form}
//         layout="inline"
//         onFinish={handleSearch}
//         className="mb-4"
//       >


//         <Form.Item name="name">

//           <Input
//             prefix={<SearchOutlined />}
//             placeholder="Search Name"
//           />

//         </Form.Item>



//         <Form.Item name="mobile_no">

//           <Input
//             placeholder="Mobile"
//           />

//         </Form.Item>



//         <Form.Item name="receipt_number">

//           <Input
//             placeholder="Receipt Number"
//           />

//         </Form.Item>



//         <Button type="primary" htmlType="submit" >
//           Search
//         </Button>
//         <Button
//           icon={<ReloadOutlined />}
//           onClick={resetSearch}
//           style={{marginLeft:"6px"}}
//         >
//           Reset
//         </Button>


//       </Form>




//       <Table

//         rowKey="_id"

//         loading={loading}

//         columns={columns}

//         dataSource={
//           donateState?.data || []
//         }


//         scroll={{
//           x: 1200
//         }}


//         pagination={{

//           current: page,

//           pageSize: limit,

//           total:
//             donateState?.pagination?.totalRecords,


//           showSizeChanger: true,


//           onChange: (p, l) => {

//             setPage(p);

//             setLimit(l);

//           }

//         }}


//       />



//       <CustomModal

//         open={open}

//         hideModal={hideModal}

//         performAction={deleteDonate}

//         title="Are you sure you want to delete this donation?"

//       />


//     </Card>

//   )

// }


// export default Donate;





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