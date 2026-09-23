import { Table, Form, Input, Button, DatePicker, Card, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import CustomModal from "../../components/CustomModal";
import { Link } from "react-router-dom";
import { deleteHawanatmakThunk, getAllHawanatmaks, searchHawanatmakThunk } from "../../features/hawanatmak/hawanatmakSlice";
import { formatDate } from "../../utils";
import { IoIosMail } from "react-icons/io";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { MdOutlineAppRegistration } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";

const columns = [
    {
      title: "S.No.",
      dataIndex: "key",
    },
    {
      title: "Receipt Number",
      dataIndex: "receipt",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Date Of Birth",
      dataIndex: "dob",
    },
    {
      title: "Relationship Status",
      dataIndex: "relationship",
    },
    {
      title: "Adhar Card No.",
      dataIndex: "adhar",
    },
    {
      title: "Visiting Date",
      dataIndex: "visDate",
    },
    {
      title: "Address",
      dataIndex: "message",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  

const Hawanatmak = () => {
  const [open, setOpen] = useState(false);
  const [hawanId, setHawanId] = useState("");
  // const [confirmButtonColors, setConfirmButtonColors] = useState({}); // State to manage button colors for each item

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllHawanatmaks());
  }, [dispatch]);

  const hawanState = useSelector((state) => state?.hawanatmak?.hawanatmak);
  const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));

  const monthlyData = hawanState?.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString("en-US", { month: "long" }); // Use "long" for full month names
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += 6300; // Add the contribution for this booking
    return acc;
  }, {});
  
  // Prepare chart data
  const monthlyChartData = (monthlyData && Object.keys(monthlyData)?.map((month) => ({
    name: month, // Full month name
    amount: monthlyData[month], // Total amount for the month
  }))) || [];

  const totalCollection = hawanState?.length * 6300; 

  const handleDownload = (hawan) => {
    const doc = new jsPDF();
  
    // Add a decorative header with a colored background
    doc.setFillColor(63, 81, 181); // Indigo background
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Mangal Grah Sewa Sanstha", 105, 15, { align: "center" });
    doc.text("Hawanatmak Shanti", 105, 25, { align: "center" });
  
    // Add a border around the main content area with reduced size
    doc.setDrawColor(200, 200, 200); // Light gray
    doc.rect(20, 40, 140, 160); // Reduced width and height
  
    // Set font and colors for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text
  
    // Add personal details with structured layout
    const leftMargin = 30;
    let yPosition = 50;
    const lineSpacing = 10;
  
    const details = [
      { label: "Receipt Number", value: hawan.receipt_number },
      { label: "Serial Number", value: hawan.serial_number },
      { label: "Name", value: hawan.name },
      { label: "Email", value: hawan.email },
      { label: "Mobile No", value: hawan.mobile_no },
      { label: "Date Of Birth", value: hawan.dob },
      { label: "Relationship Status", value: hawan.relationship },
      { label: "Aadhar No", value: hawan.adhar_no },
      { label: "Date", value: new Date(hawan.date).toLocaleDateString() },
      { label: "Message", value: hawan.message },
    ];
  
    details.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${item.label}:`, leftMargin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.value}`, leftMargin + 50, yPosition);
      yPosition += lineSpacing;
    });
  
    // Add a footer section with a motivational quote or thank-you note
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray text
    doc.text("Thank you for visit!", 105, 230, { align: "center" }); // Adjusted to fit within the smaller box
  
    // Save the PDF with a clear file name
    doc.save(`Slip_${hawan.name}_${hawan.receipt_number}.pdf`);
  };

  // const handleConfirmClick = async (hawanatmak) => {
  //   try {
  //     // Send email
  //     const response = await axios.get(`${base_url}/hawanatmak/send-confirmation-email/${hawanatmak.id}`, { email: hawanatmak.email, name: hawanatmak.name });

  //     if (response.status === 200) {
  //       setConfirmButtonColors(prev => ({ ...prev, [hawanatmak.id]: 'green' })); // Change button color to green on success
  //     } else {
  //       setConfirmButtonColors(prev => ({ ...prev, [hawanatmak.id]: 'red' })); // Change button color to red on failure
  //     }
  //   } catch (error) {
  //     console.error("Email send failed", error);
  //     setConfirmButtonColors(prev => ({ ...prev, [hawanatmak.id]: 'red' })); // Change button color to red on error
  //   }
  // };



    const prepareDataSource = (data) => {
      return data?.slice().reverse().map((hawan, index) => ({
        key: index,
        receipt: hawan.receipt_number,
        name: hawan.name,
        email: (
          <Link to={`mailto:${hawan.email}`}>{hawan.email}</Link>
        ),
        phone: (
          <Link to={`tel:+91${hawan.mobile_no}`}>{hawan.mobile_no}</Link>
        ),
        adhar: hawan.adhar_no,
        dob: <p>{formatDate(new Date(hawan.dob))}</p>,
        relationship: hawan.relationship,
        visDate: <p>{formatDate(new Date(hawan.date))}</p>,
        message: hawan.message,
        date: <p>{formatDate(new Date(hawan.created_at))}</p>,
        action: (
          <div className="d-flex">
            {getTokenFromLocalStorage?.admin.role !== "subadmin" && (
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(hawan.id)}
            >
              <AiFillDelete />
            </button>
          )}
            <button
               onClick={() => handleDownload(hawan)}
              className="ant-btn ant-btn-primary"
            >
              Download Slip
            </button>
          </div>
        ),
      }));
    };
  
    const data = prepareDataSource(hawanState);

  const showModal = (e) => {
    setOpen(true);
    setHawanId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteHawan = (e) => {
    dispatch(deleteHawanatmakThunk(e))
    setOpen(false);
    setTimeout(() => {
      dispatch(getAllHawanatmaks());
    }, 100);
  };

  const onFinish = (values) => {
    dispatch(searchHawanatmakThunk(values));
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      hawanState.map((item, index) => ({
        "S.No": index + 1,
        Receipt_Number: item.receipt_number,
        Name: item.name,
        Phone: item.mobile_no,
        Email: item.email,
        "Date Of Birth": item.dob,
        Relationship: item.relationship,
        Adhar_Number: item.adhar_no,
        Visting_date: formatDate(new Date(item.date)),
        Address: item.message,
        Date: formatDate(new Date(item.created_at)),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hawanatmak Bookings");
    XLSX.writeFile(workbook, "Hawanatmak_Booking_Details.xlsx");
  };

  return (
    <>
      <div>
        <h3 className="mb-4 title">Hawanatmak Shanti Registration</h3>
        <div className="" style={{backgroundColor: "#fff", padding:"8px 25px"}}>
          {/* Dashboard Section */}
        <Row gutter={16} className="mb-4" >
          <Col span={6} >
            <Card title="Total Bookings" bordered style={{backgroundColor: "#ccc"}}>
              <div className="d-flex ms-auto">
              <h4><MdOutlineAppRegistration style={{marginRight: "100px", color:"red"}} /></h4> 
              <h5 style={{color:"green"}}>{hawanState?.length || 0}</h5>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Total Collection" bordered style={{backgroundColor: "#ccc"}}>
              <div className="d-flex ms-auto">
              <h4><FaRupeeSign style={{marginRight: "70px", color:"red"}} /></h4> 
              <h5 style={{color:"green"}}>{totalCollection}</h5>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
    
        <Col span={12}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <XAxis dataKey="name" /> {/* Use 'name' for the month */}
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
        </div>
        <div className="search-form-container">
        <Form layout="inline" onFinish={onFinish} className="search-form">
          <Form.Item name="name" label="Name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="adhar_no" label="Adhar No">
            <Input placeholder="Adhar No" />
          </Form.Item>
          <Form.Item name="mobile_no" label="Mobile No">
            <Input placeholder="Mobile No" />
          </Form.Item>
          <Form.Item name="receipt_number" label="Receipt Number">
            <Input placeholder="By Receipt ID" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
        </div>
        
        <Button type="primary" onClick={downloadExcel} style={{ marginBottom: "20px" }}>
          Download Excel
        </Button>
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteHawan(hawanId)}
        title="Are you sure you want to delete this Data?"
      />
    </>
  )
}

export default Hawanatmak
