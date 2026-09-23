import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { base_booking_url } from "../../utils/base_url";
import * as XLSX from "xlsx";
import { MdDelete } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { config } from "../../utils/axiosconfig";

const InputField = ({ label, name, value, onChange, type = "text", sx }) => (
    <TextField
        label={label}
        variant="outlined"
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        fullWidth
        sx={{ marginBottom: 2, ...sx }}
    />
);


const SelectField = ({ label, name, value, onChange, options, sx }) => (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: 2, ...sx }}>
        <InputLabel>{label}</InputLabel>
        <Select name={name} value={value} onChange={onChange} label={label}>
            {options.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

const Prasad = () => {

    const [receiptNumber, setReceiptNumber] = useState("");
    const [date, setDate] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [bookBy, setBookBy] = useState("");
    const [bookings, setBookings] = useState([]);
    const [totalBookings, setTotalBookings] = useState(0);
    const [error, setError] = useState("");

    const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));
//   return getTokenFromLocalStorage?.token === undefined ? 
    console.log(getTokenFromLocalStorage?.admin.email, '66');


    const [newBooking, setNewBooking] = useState({
        name: "",
        persons: "",
        bookBy: getTokenFromLocalStorage?.admin.email || "",
        paymentStatus: "",
    });




    const [filters, setFilters] = useState({
        receipt_number_from: '',
        receipt_number_to: '',
        persons: '',
        date_from: '',
        date_to: ''
    });
    
    const handleChangeRec = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };
    
    const handleGenerateReport = async () => {
        try {
            const response = await axios.get(`${base_booking_url}/prasad/download-receipt-pdf`, {
                params: filters,
                responseType: 'blob',
                ...config
            });
    
            if (response.data) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Booking_Summary_Report.pdf';
                link.click();
            } else {
                console.error("PDF data is empty");
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };




    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${base_booking_url}/prasad/`, config);
                setBookings(response.data.bookings);
                setTotalBookings(response.data.totalBookings);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching bookings");
            }
        };
        fetchBookings();
}, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${base_booking_url}/prasad/${id}`, config);
            setBookings(bookings.filter((booking) => booking._id !== id));
            setTotalBookings(totalBookings - 1);
            window.location.reload();  // This will reload the page
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete booking!");
        }
    };

    const downloadBookingPDF = async (id) => {
        try {
            const response = await axios.get(`${base_booking_url}/prasad/${id}/download`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${id}_Prasad.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to download booking!");
        }
    };

    const downloadExcel = () => {
        const data = bookings.map((booking) => ({
            "Receipt Number": booking.receipt_number,
            "Serial Number": booking.serial_number,
            Name: booking.name,
            Persons: booking.persons,
            "Payment Status": booking.paymentStatus,
            "Created At": moment(booking.createdAt).format("YYYY-MM-DD HH:mm"),
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bookings");
        XLSX.writeFile(wb, "Bookings_Data.xlsx");
    };

    const handleCreateBooking = async () => {
        try {
          // Step 1: Create the booking
          const response = await axios.post(`${base_booking_url}/prasad/create`, newBooking, config);
          const createdBooking = response.data.booking;
      
          // Update booking state
          setBookings([response.data.booking, ...bookings]);
          setTotalBookings(totalBookings + 1);
      
          // Reset the newBooking state
          setNewBooking({
            receipt_number: "",
            serial_number: "",
            name: "",
            persons: "",
            bookBy: getTokenFromLocalStorage?.admin.email || "", // Reset with default authState.email,
            paymentStatus: "",
          });
      
          // Clear any existing errors
          setError("");
      
          // Step 2: Fetch the PDF
          const pdfResponse = await axios.get(`${base_booking_url}/prasad/${createdBooking._id}/download`, {
            responseType: "blob",
          });
      
          // Create a blob from the fetched PDF data
          const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
      
          // Step 3: Open the PDF in a new tab and initiate the print dialog
          const pdfWindow = window.open(url);
          if (pdfWindow) {
            pdfWindow.onload = () => {
              // Ensure content fits on one page
              pdfWindow.document.body.style.transform = 'scale(0.85)';  // Adjust scale as necessary
              pdfWindow.document.body.style.transformOrigin = 'top left';
              pdfWindow.document.body.style.margin = '0';  // Remove margins to fit content
      
              // Apply print styles
              const style = pdfWindow.document.createElement("style");
              style.innerHTML = `
                @page {
                  size: A4;
                  margin: 0;  // No margin for print
                }
                body {
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  font-size: 10pt;  // Adjust font size for print
                }
              `;
              pdfWindow.document.head.appendChild(style);
      
              // Trigger the print dialog
              pdfWindow.print();
            };
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to create booking!");
        }
      };

    const handleSearch = async () => {
        const params = {};
        if (receiptNumber) params.receipt_number = receiptNumber;
        if (date) params.date = date;
        if (paymentStatus) params.paymentStatus = paymentStatus;
        if (bookBy) params.bookBy = bookBy;

        try {
            setError("");
            const response = await axios.get(`${base_booking_url}/prasad`, { params, ...config });
            setBookings(response.data.bookings || []);
            setTotalBookings(response.data.totalBookings || 0);
        } catch (err) {
            setBookings([]);
            setTotalBookings(0);
            setError(err.response?.data?.message || "Search failed!");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBooking((prev) => ({ ...prev, [name]: value }));
    };

    // Calculate Grand Total
    const totalAmount = bookings.reduce((sum, booking) => sum + parseFloat(booking.amount || 0), 0);

  return (
    <>
        <Box sx={{ padding: 2, backgroundColor: "#f4f4f4", borderRadius: 2 }}>
            <Typography variant="h6">Generate Receipt Summary Report</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <InputField
                        label="Receipt Number From"
                        name="receipt_number_from"
                        value={filters.receipt_number_from}
                        onChange={handleChangeRec}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputField
                        label="Receipt Number To"
                        name="receipt_number_to"
                        value={filters.receipt_number_to}
                        onChange={handleChangeRec}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputField
                        label="Number Of Persons"
                        name="persons"
                        value={filters.persons}
                        onChange={handleChangeRec}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputField
                        label="Date From"
                        type="date"
                        name="date_from"
                        value={filters.date_from}
                        onChange={handleChangeRec}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputField
                        label="Date To"
                        type="date"
                        name="date_to"
                        value={filters.date_to}
                        onChange={handleChangeRec}
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                Generate Report
            </Button>
        </Box>

        <Box sx={{ padding: 4 }}>
                    <Typography variant="h4" sx={{ marginBottom: 2 }}>
                        Prasad Booking
                    </Typography>
        
        
        
                   {/* Create Booking Form */}
                    <Grid container spacing={2} sx={{ marginBottom: 4, backgroundColor: "white", padding: 3, borderRadius: 2 }}>
                    {["name", "persons"].map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field}>
           
                
                        <InputField
                            label={field.replace(/_/g, " ").toUpperCase()}
                            name={field}
                            value={newBooking[field]}
                            onChange={handleInputChange}
                        />
                
                    
                    
                    </Grid>
                    
                    ))}
            
        
                        <Grid item xs={12} sm={6} md={4}>
                            <SelectField
                                label="Payment Status"
                                name="paymentStatus"
                                value={newBooking.paymentStatus}
                                onChange={handleInputChange}
                                options={[
                                    { value: "online", label: "Online" },
                                    { value: "cash", label: "Cash" },
                                ]}
                            />
                        </Grid>
                        
                        
        
                        <InputField
                            name="bookBy"
                            value={getTokenFromLocalStorage?.admin.email}
                            //   onChange={handleInputChange}
                            fullWidth
                            />
        
        
                        
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleCreateBooking}>
                                Create Booking
                            </Button>
                        </Grid>
                    </Grid>
        
        
                    {/* Search Controls */}
                    <Typography variant="h6">Search Bookings</Typography>
                    <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <InputField label="Receipt Number" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button variant="contained" color="primary" onClick={handleSearch}>
                                Search
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <InputField
                                label="Select Date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button variant="contained" color="secondary" onClick={handleSearch}>
                                Get Daily Bookings
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <InputField
                                label="Book By"
                                type="text"
                                value={bookBy}
                                onChange={(e) => setBookBy(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button variant="contained" color="secondary" onClick={handleSearch}>
                                Book By
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SelectField
                                label="Payment Status"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                options={[
                                    { value: "", label: "Select Status" },
                                    { value: "online", label: "Online" },
                                    { value: "cash", label: "Cash" },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button variant="contained" color="primary" onClick={handleSearch}>
                                Search by Status
                            </Button>
                        </Grid>
                    </Grid>
        
                    {/* Error Message */}
                    {error && <Typography color="error">{error}</Typography>}
        
                      {/* Display Total Bookings and Amount */}
                      <Box sx={{ marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">
                            Total Bookings: {bookings.length}
                        </Typography>
                        <Typography variant="h6">
                            Grand Total Amount: ₹{totalAmount.toLocaleString()}
                        </Typography>
                    </Box>
        
                     {/* Download Excel */}
                     <Button variant="contained" color="secondary" startIcon={<FaCloudDownloadAlt />} onClick={downloadExcel}>
                        Download All Bookings as Excel
                    </Button>
        
                    {/* Booking List */}
                    <Box sx={{ marginBottom: 2 }}>
                        <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Receipt Number", "Serial Number", "Book By", "Name", "Number Of Persons", "Amount", "Payment Status", "Created At", "Actions"].map((header) => (
                                        <TableCell key={header}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking._id}>
                                        <TableCell>{booking.receipt_number}</TableCell>
                                        <TableCell>{booking.serial_number}</TableCell>
                                        <TableCell>{booking.bookBy}</TableCell>
                                        <TableCell>{booking.name}</TableCell>
                                        <TableCell>{booking.persons}</TableCell>
                                        <TableCell>{booking.amount}</TableCell>
                                        <TableCell>{booking.paymentStatus}</TableCell>
                                        <TableCell>{moment(booking.createdAt).format("YYYY-MM-DD HH:mm")}</TableCell>
                                        <TableCell className="d-flex gap-3">
                                           
                                            <FaCloudDownloadAlt onClick={() => downloadBookingPDF(booking._id)} style={{ cursor:"pointer", fontSize: "23px", color:"blue" }}/>
        
                                           {/* <button>
                                            Whatsapp
                                           </button> */}
        
                                            <MdDelete onClick={() => handleDelete(booking._id)} style={{ cursor:"pointer", fontSize:"23px", color: "red" }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Box>
        
                   
                </Box>
    </>
  )
}

export default Prasad