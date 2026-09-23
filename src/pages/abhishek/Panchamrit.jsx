import { Table, Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import CustomModal from "../../components/CustomModal";
import { Link } from "react-router-dom";
import { deletePanchamritThunk, getAllPanchamrits, searchPanchamritThunk } from "../../features/panchamrit/panchamritSlice";
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
  

const Panchamrit = () => {
  const [open, setOpen] = useState(false);
  const [pnchId, setPnchId] = useState("");
  // const [confirmButtonColors, setConfirmButtonColors] = useState({}); // State to manage button colors for each item

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPanchamrits());
  }, [dispatch]);

  const pnchState = useSelector((state) => state?.panchamrit?.panchamrit);
  const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));

  const handleDownload = (panch) => {
    const doc = new jsPDF();
  
    // Add a decorative header with a colored background
    doc.setFillColor(63, 81, 181); // Indigo background
    doc.rect(0, 0, 210, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Mangal Grah Sewa Sanstha", 105, 15, { align: "center" });
    doc.text("Panchamrit Abhishek", 105, 25, { align: "center" });
  
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
      { label: "Receipt Number", value: panch.receipt_number },
      { label: "Serial Number", value: panch.serial_number },
      { label: "Name", value: panch.name },
      { label: "Email", value: panch.email },
      { label: "Mobile No", value: panch.mobile_no },
      { label: "Aadhar No", value: panch.adhar_no },
      { label: "Date", value: new Date(panch.date).toLocaleDateString() },
      { label: "Message", value: panch.message },
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
    doc.save(`Slip_${panch.name}_${panch.receipt_number}.pdf`);
  };


  // const handleConfirmClick = async (panchamrit) => {
  //   try {
  //     // Send email
  //     const response = await axios.get(`${base_url}/panchamrit/send-confirmation-email/${panchamrit.id}`, { email: panchamrit.email, name: panchamrit.name });

  //     if (response.status === 200) {
  //       setConfirmButtonColors(prev => ({ ...prev, [panchamrit.id]: 'green' })); // Change button color to green on success
  //     } else {
  //       setConfirmButtonColors(prev => ({ ...prev, [panchamrit.id]: 'red' })); // Change button color to red on failure
  //     }
  //   } catch (error) {
  //     console.error("Email send failed", error);
  //     setConfirmButtonColors(prev => ({ ...prev, [panchamrit.id]: 'red' })); // Change button color to red on error
  //   }
  // };

  const data = pnchState?.slice().reverse().map((panch, index) => ({
    key: index,
    receipt: panch.receipt_number,
    name: panch.name,
    email: (
      <div>
        <Link to={`mailto:${panch.email}`}>{panch.email}</Link>
      </div>
    ),
    phone: (
      <div>
        <Link to={`tel:+91${panch.mobile_no}`}>{panch.mobile_no}</Link>
      </div>
    ),
    adhar: panch.adhar_no,
    visDate: <p>{formatDate(new Date(panch.date))}</p>,

    message: panch.message,
    date: <p>{formatDate(new Date(panch.created_at))}</p>,
    action: (
      <div className="d-flex">
         {getTokenFromLocalStorage?.admin.role !== "subadmin" && (
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(panch.id)}
            >
              <AiFillDelete />
            </button>
          )}
        <button
          onClick={() => handleDownload(panch)}
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
    setPnchId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deletePancha = (e) => {
    dispatch(deletePanchamritThunk(e))
    setOpen(false);
    setTimeout(() => {
      dispatch(getAllPanchamrits());
    }, 100);
  };

  const onFinish = (values) => {
    dispatch(searchPanchamritThunk(values));
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      pnchState.map((item, index) => ({
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Panchamrit Bookings");
    XLSX.writeFile(workbook, "Panchamrit_Booking_Details.xlsx");
  }


  return (
    <>
      <div>
        <h3 className="mb-4 title">Panchamrit Abhishek Registration</h3>
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
        performAction={() => deletePancha(pnchId)}
        title="Are you sure you want to delete this Data?"
      />
    </>
  )
}

export default Panchamrit
