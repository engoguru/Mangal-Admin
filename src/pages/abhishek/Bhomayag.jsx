import { Table, Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import CustomModal from "../../components/CustomModal";
import { Link } from "react-router-dom";
import { deleteBhomayagThunk, getAllBhomayags, searchBhomayagThunk } from "../../features/bhomayag/bhomayagSlice";
import { formatDate } from "../../utils";
import { IoIosMail } from "react-icons/io";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";


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
  

const Bhomayag = () => {
  const [open, setOpen] = useState(false);
  const [bhomId, setBhomId] = useState("");
  // const [confirmButtonColors, setConfirmButtonColors] = useState({}); // State to manage button colors for each item

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBhomayags());
  }, [dispatch]);

  const bhomState = useSelector((state) => state?.bhomayag?.bhomayag);
  const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));

  const handleDownload = (bhom) => {
    const doc = new jsPDF();
  
    // Add a decorative header with a colored background
    doc.setFillColor(63, 81, 181); // Indigo background
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Mangal Grah Sewa Sanstha", 105, 15, { align: "center" });
    doc.text("Bhomyag", 105, 25, { align: "center" });
  
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
      { label: "Receipt Number", value: bhom.receipt_number },
      { label: "Serial Number", value: bhom.serial_number },
      { label: "Name", value: bhom.name },
      { label: "Email", value: bhom.email },
      { label: "Mobile No", value: bhom.mobile_no },
      { label: "Aadhar No", value: bhom.adhar_no },
      { label: "Date", value: new Date(bhom.date).toLocaleDateString() },
      { label: "Message", value: bhom.message },
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
    doc.save(`Slip_${bhom.name}_${bhom.receipt_number}.pdf`);
  };

  // const handleConfirmClick = async (bhomyag) => {
  //   try {
  //     // Send email
  //     const response = await axios.get(`${base_url}/bhomyag/send-confirmation-email/${bhomyag.id}`, { email: bhomyag.email, name: bhomyag.name });

  //     if (response.status === 200) {
  //       setConfirmButtonColors(prev => ({ ...prev, [bhomyag.id]: 'green' })); // Change button color to green on success
  //     } else {
  //       setConfirmButtonColors(prev => ({ ...prev, [bhomyag.id]: 'red' })); // Change button color to red on failure
  //     }
  //   } catch (error) {
  //     console.error("Email send failed", error);
  //     setConfirmButtonColors(prev => ({ ...prev, [bhomyag.id]: 'red' })); // Change button color to red on error
  //   }
  // };

  const data = bhomState?.slice().reverse().map((bhom, index) => ({
    key: index,
    receipt: bhom.receipt_number,
    name: bhom.name,
    email: (
      <div>
        <Link to={`mailto:${bhom.email}`}>{bhom.email}</Link>
      </div>
    ),
    phone: (
      <div>
        <Link to={`tel:+91${bhom.mobile_no}`}>{bhom.mobile_no}</Link>
      </div>
    ),
    adhar: bhom.adhar_no,
    visDate: <p>{formatDate(new Date(bhom.date))}</p>,

    message: bhom.message,
    date: <p>{formatDate(new Date(bhom.created_at))}</p>,
    action: (
      <div className="d-flex">
        {getTokenFromLocalStorage?.admin.role !== "subadmin" && (
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(bhom.id)}
            >
              <AiFillDelete />
            </button>
          )}
        <button
          onClick={() => handleDownload(bhom)}
          style={{
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginLeft: "10px",
          }}
        >
          Download Slip
        </button>
      </div>
      ),
    }));

  const showModal = (e) => {
    setOpen(true);
    setBhomId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteBhomayag = (e) => {
    dispatch(deleteBhomayagThunk(e))
    setOpen(false);
    setTimeout(() => {
      dispatch(getAllBhomayags());
    }, 100);
  };

  const onFinish = (values) => {
    dispatch(searchBhomayagThunk(values));
  };


  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      bhomState.map((item, index) => ({
        "S.No": index + 1,
        Receipt_Number: item.receipt_number,
        Name: item.name,
        Phone: item.mobile_no,
        Email: item.email,
        Adhar_Number: item.adhar_no,
        Visting_date: formatDate(new Date(item.date)),
        Address: item.message,
        Date: formatDate(new Date(item.created_at)),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bhomyag Bookings");
    XLSX.writeFile(workbook, "Bhomyag_Booking_Details.xlsx");
  };

  return (
    <>
      <div>
        <h3 className="mb-4 title">Bhomyag Registration</h3>
        <Button type="primary" onClick={downloadExcel} style={{ marginBottom: "20px" }}>
          Download Excel
        </Button>
        <Form layout="inline" onFinish={onFinish} className="mb-4">
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
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteBhomayag(bhomId)}
        title="Are you sure you want to delete this Data?"
      />
    </>
  )
}

export default Bhomayag
