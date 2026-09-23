// import React, { useEffect, useState } from "react";
// import {
//     TextField,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography,
//     Box,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Grid,
//     TablePagination
// } from "@mui/material";
// import axios from "axios";
// import moment from "moment";
// import { base_booking_url, base_booking_url2 } from "../../utils/base_url";
// import * as XLSX from "xlsx";
// import { MdDelete } from "react-icons/md";
// import { FaCloudDownloadAlt } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { config } from "../../utils/axiosconfig";

// // Reusable Input Field Component
// const InputField = ({ label, name, value, onChange, type = "text", sx }) => (
//     <TextField
//         label={label}
//         variant="outlined"
//         name={name}
//         value={value}
//         onChange={onChange}
//         type={type}
//         fullWidth
//         sx={{ marginBottom: 2, ...sx }}
//     />
// );

// // Reusable Select Field Component
// const SelectField = ({ label, name, value, onChange, options, sx }) => (
//     <FormControl variant="outlined" fullWidth sx={{ marginBottom: 2, ...sx }}>
//         <InputLabel>{label}</InputLabel>
//         <Select name={name} value={value} onChange={onChange} label={label}>
//             {options.map((option, index) => (
//                 <MenuItem key={index} value={option.value}>
//                     {option.label}
//                 </MenuItem>
//             ))}
//         </Select>
//     </FormControl>
// );

// const BookingDashboard = () => {

//     const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));
//     console.log(getTokenFromLocalStorage, "opoo")

//     const [newBooking, setNewBooking] = useState({
//         name: "",
//         phone: "",
//         address: "",
//         abhishek_type: "",
//         amount: "",
//         batch_time: "",
//         hall: "",
//         bookBy: getTokenFromLocalStorage?.user?.email || "",
//         paymentStatus: "",
//     });

//     const [customType, setCustomType] = React.useState(false);
//     const [loading, setLoading] = React.useState(false);


//     const [filters, setFilters] = useState({
//         receipt_number_from: '',
//         receipt_number_to: '',
//         abhishek_type: '',
//         date_from: '',
//         date_to: ''
//     });

//     const [receiptNumber, setReceiptNumber] = useState("");
//     const [date, setDate] = useState("");
//     const [paymentStatus, setPaymentStatus] = useState("");
//     const [bookBy, setBookBy] = useState("");
//     const [bookings, setBookings] = useState([]);

//     const [totalBookings, setTotalBookings] = useState(0);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     const handleChangePage = (_, newPage) => setPage(newPage);
//     const handleChangeRowsPerPage = (e) => {
//         setRowsPerPage(parseInt(e.target.value, 10));
//         setPage(0);
//     };

//     const [error, setError] = useState("");


//     const batchTimes = [
//         { time: '7:00 AM to 8:15 AM', hall: 'H1' }, { time: '7:30 AM to 8:45 AM', hall: 'H2' },
//         { time: '8:30 AM to 9:45 AM', hall: 'H1' }, { time: '9:00 AM to 10:15 AM', hall: 'H2' },
//         { time: '9:00 AM to 10:15 AM', hall: 'H3' }, { time: '10:00 AM to 11:15 AM', hall: 'H1' },
//         { time: '10:30 AM to 11:45 AM', hall: 'H2' }, { time: '10:30 AM to 11:45 AM', hall: 'H3' },
//         { time: '11:30 AM to 12:45 PM', hall: 'H1' }, { time: '12:00 PM to 1:15 PM', hall: 'H2' },
//         { time: '12:10 PM to 1:30 PM', hall: 'H3' }, { time: '1:00 PM to 2:15 PM', hall: 'H1' },
//         { time: '1:30 PM to 2:45 PM', hall: 'H2' }, { time: '1:45 PM to 3:00 PM', hall: 'H3' },
//     ];


//     const fetchBookings = async (extraParams = {}) => {
//         try {
//             const params = {
//                 page: page + 1, // backend usually 1-based
//                 limit: rowsPerPage,
//                 ...extraParams,
//             };
//             const res = await axios.get(`${base_booking_url2}booking/viewAll`, {
//                 params,
//                 ...config,
//             });
//             // console.log(res, "ooooooppppp")
//             const list =
//                 res.data.bookings ??
//                 res.data.docs ??
//                 res.data.data ??
//                 res.data ??
//                 [];
//             const total =
//                 res.data.totalBookings ??
//                 res.data.totalDocs ??
//                 res.data.total ??
//                 list.length;
//             setBookings(list);
//             setTotalBookings(total);
//         } catch (err) {
//             setError(err.response?.data?.message || "Error fetching bookings");
//         }
//     };

//     useEffect(() => {
//         fetchBookings();
//     }, [page, rowsPerPage]);



//     // const handleChangeRec = (e) => {
//     //     setFilters({
//     //         ...filters,
//     //         [e.target.name]: e.target.value
//     //     });
//     // };

//     // const handleGenerateReport = async () => {
//     //     try {
//     //         const response = await axios.get(`${base_booking_url}/booking/download-receipt-pdf`, {
//     //             params: filters,
//     //             responseType: 'blob',
//     //             ...config 
//     //         });

//     //         if (response.data) {
//     //             const blob = new Blob([response.data], { type: 'application/pdf' });
//     //             const link = document.createElement('a');
//     //             link.href = URL.createObjectURL(blob);
//     //             link.download = 'Booking_Summary_Report.pdf';
//     //             link.click();
//     //         } else {
//     //             console.error("PDF data is empty");
//     //         }
//     //     } catch (error) {
//     //         console.error('Error generating report:', error);
//     //     }
//     // };



//     useEffect(() => {
//         // Find the hall based on the selected batch time
//         const selectedBatch = batchTimes.find(batch => batch.time === newBooking.batch_time);
//         if (selectedBatch) {
//             setNewBooking(prevState => ({ ...prevState, hall: selectedBatch.hall }));
//         }
//     }, [newBooking.batch_time]);

//     const handleChange = (e) => {
//         setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
//     };

//     //     useEffect(() => {
//     //         const fetchBookings = async () => {
//     //             try {
//     //                 const response = await axios.get(`${base_booking_url}/booking/`, config);
//     //                 setBookings(response.data.bookings);
//     //                 setTotalBookings(response.data.totalBookings);
//     //             } catch (err) {
//     //                 setError(err.response?.data?.message || "Error fetching bookings");
//     //             }
//     //         };
//     //         fetchBookings();
//     // }, []);

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${base_booking_url}/booking/${id}`, config);
//             setBookings(bookings.filter((booking) => booking._id !== id));
//             setTotalBookings(totalBookings - 1);
//             window.location.reload();  // This will reload the page
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to delete booking!");
//         }
//     };

//     const downloadBookingPDF = async (id) => {
//         try {
//             const response = await axios.get(`${base_booking_url2}booking/${id}/download`, {
//                 responseType: "blob",
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `${id}_Booking.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to download booking!");
//         }
//     };

//     const downloadExcel = () => {
//         const data = bookings.map((booking) => ({
//             "Receipt Number": booking.receipt_number,
//             "Serial Number": booking.serial_number,
//             Name: booking.name,
//             Phone: booking.phone,
//             Address: booking.address,
//             "Abhishek Type": booking.abhishek_type,
//             Amount: booking.amount,
//             "Batch Time": booking.batch_time,
//             Hall: booking.hall,
//             "Payment Status": booking.paymentStatus,
//             "Created At": moment(booking.createdAt).format("YYYY-MM-DD HH:mm"),
//         }));
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Bookings");
//         XLSX.writeFile(wb, "Bookings_Data.xlsx");
//     };

//     const handleCreateBooking = async () => {
//         setLoading(true);
//         try {
//             // Step 1: Create the booking
//             //   base_booking_url2
//             const response = await axios.post(`${base_booking_url2}booking/create`, newBooking, config);
//             const createdBooking = response.data.booking;

//             // Update booking state
//             setBookings([response.data.booking, ...bookings]);
//             setTotalBookings(totalBookings + 1);

//             // Reset the newBooking state
//             setNewBooking({
//                 receipt_number: "",
//                 serial_number: "",
//                 name: "",
//                 phone: "",
//                 address: "",
//                 abhishek_type: "",
//                 amount: "",
//                 bookBy: getTokenFromLocalStorage?.admin.email || "", // Reset with default authState.email,
//                 paymentStatus: "",
//             });

//             // Clear any existing errors
//             setError("");

//             // Step 2: Fetch the PDF
//             const pdfResponse = await axios.get(`${base_booking_url2}/booking/${createdBooking._id}/download`, {
//                 responseType: "blob",
//             });

//             // Create a blob from the fetched PDF data
//             const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
//             const url = URL.createObjectURL(blob);

//             // Step 3: Open the PDF in a new tab and initiate the print dialog
//             const pdfWindow = window.open(url);
//             if (pdfWindow) {
//                 pdfWindow.onload = () => {
//                     // Ensure content fits on one page
//                     pdfWindow.document.body.style.transform = 'scale(0.85)';  // Adjust scale as necessary
//                     pdfWindow.document.body.style.transformOrigin = 'top left';
//                     pdfWindow.document.body.style.margin = '0';  // Remove margins to fit content

//                     // Apply print styles
//                     const style = pdfWindow.document.createElement("style");
//                     style.innerHTML = `
//                 @page {
//                   size: A4;
//                   margin: 0;  // No margin for print
//                 }
//                 body {
//                   width: 100%;
//                   height: 100%;
//                   overflow: hidden;
//                   font-size: 10pt;  // Adjust font size for print
//                 }
//               `;
//                     pdfWindow.document.head.appendChild(style);

//                     // Trigger the print dialog
//                     pdfWindow.print();
//                 };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to create booking!");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = async () => {
//         const params = {};
//         if (receiptNumber) params.receipt_number = receiptNumber;
//         if (date) params.date = date;
//         if (paymentStatus) params.paymentStatus = paymentStatus;
//         if (bookBy) params.bookBy = bookBy;

//         try {
//             setError("");
//             const response = await axios.get(`${base_booking_url2}booking/viewAll`, { params, ...config });
//             console.log(response, "ir")
//             setBookings(response.data.data || []);
//             setTotalBookings(response.data.totalBookings || 0);
//         } catch (err) {
//             setBookings([]);
//             setTotalBookings(0);
//             setError(err.response?.data?.message || "Search failed!");
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewBooking((prev) => ({ ...prev, [name]: value }));
//     };

//     // Calculate Grand Total
//     const totalAmount = bookings.reduce((sum, booking) => sum + parseFloat(booking.amount || 0), 0);

//     const visibleRows =
//         bookings.length > rowsPerPage
//             ? bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             : bookings;

//     return (

//         <>

//             {/* <Box sx={{ padding: 2, backgroundColor: "#f4f4f4", borderRadius: 2 }}>
//             <Typography variant="h6">Generate Receipt Summary Report</Typography>
//             <Grid container spacing={2}>
//                 <Grid item xs={12} sm={4}>
//                     <InputField
//                         label="Receipt Number From"
//                         name="receipt_number_from"
//                         value={filters.receipt_number_from}
//                         onChange={handleChangeRec}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                     <InputField
//                         label="Receipt Number To"
//                         name="receipt_number_to"
//                         value={filters.receipt_number_to}
//                         onChange={handleChangeRec}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                     <InputField
//                         label="Abhishek Type"
//                         name="abhishek_type"
//                         value={filters.abhishek_type}
//                         onChange={handleChangeRec}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                     <InputField
//                         label="Date From"
//                         type="date"
//                         name="date_from"
//                         value={filters.date_from}
//                         onChange={handleChangeRec}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                     <InputField
//                         label="Date To"
//                         type="date"
//                         name="date_to"
//                         value={filters.date_to}
//                         onChange={handleChangeRec}
//                     />
//                 </Grid>
//             </Grid>
//             <Button variant="contained" color="primary" onClick={handleGenerateReport}>
//                 Generate Report
//             </Button>
//         </Box> */}



//             <Box sx={{ padding: 4 }}>
//                 <Typography variant="h4" sx={{ marginBottom: 2 }}>
//                     Booking Dashboard
//                 </Typography>



//                 {/* Create Booking Form */}
//                 <Typography variant="h6">Create New Booking</Typography>
//                 <Grid container spacing={2} sx={{ marginBottom: 4, backgroundColor: "white", padding: 3, borderRadius: 2 }}>
//                     {["name", "phone", "address", "abhishek_type", "amount"].map((field) => (
//                         <Grid item xs={12} sm={6} md={4} key={field}>
//                             {field === "abhishek_type" ? (
//                                 <div>
//                                     <FormControl fullWidth>
//                                         <InputLabel id={`${field}-label`}>Select Abhishek Type</InputLabel>
//                                         <Select
//                                             labelId={`${field}-label`}
//                                             name={field}
//                                             value={newBooking[field]}
//                                             onChange={(e) => {
//                                                 if (e.target.value === "custom") {
//                                                     setCustomType(true);
//                                                     setNewBooking({ ...newBooking, [field]: "" });
//                                                 } else {
//                                                     setCustomType(false);
//                                                     handleInputChange(e);
//                                                 }
//                                             }}
//                                         >
//                                             <MenuItem value="">Select Abhishek</MenuItem>
//                                             <MenuItem value="Abhishek">Abhishek</MenuItem>
//                                             <MenuItem value="Bhomyag">Bhomyag</MenuItem>
//                                             <MenuItem value="Independent Special Abhishek">Independent Special Abhishek</MenuItem>
//                                             <MenuItem value="Hawanatmak Shanti Abhishek">Hawanatmak Shanti Abhishek</MenuItem>
//                                             <MenuItem value="Panchamrit Abhishek">Panchamrit Abhishek</MenuItem>
//                                             <MenuItem value="Nitya Mangal Prabhat Shri Mangal Abhishek Pooja">Nitya Mangal Prabhat Shri Mangal Abhishek Pooja</MenuItem>
//                                             <MenuItem value="Donation">Donation</MenuItem>
//                                             <MenuItem value="Annadan">Annadan</MenuItem>
//                                             <MenuItem value="Satyanarayan">Satyanarayan</MenuItem>
//                                             <MenuItem value="Post Abhishek">Post Abhishek</MenuItem>

//                                         </Select>
//                                     </FormControl>
//                                     {customType && (
//                                         <InputField
//                                             label="Enter Custom Type"
//                                             name={field}
//                                             value={newBooking[field]}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                         />
//                                     )}
//                                 </div>
//                             ) : (
//                                 <InputField
//                                     label={field.replace(/_/g, " ").toUpperCase()}
//                                     name={field}
//                                     value={newBooking[field]}
//                                     onChange={handleInputChange}
//                                 />
//                             )}


//                         </Grid>

//                     ))}


//                     <Grid item xs={12} sm={6} md={4}>
//                         <SelectField
//                             label="Payment Status"
//                             name="paymentStatus"
//                             value={newBooking.paymentStatus}
//                             onChange={handleInputChange}
//                             options={[
//                                 { value: "online", label: "Online" },
//                                 { value: "cash", label: "Cash" },
//                             ]}
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6} md={4}>
//                         <SelectField
//                             label="Batch Time"
//                             name="batch_time"
//                             value={newBooking.batch_time}
//                             onChange={handleInputChange}
//                             options={

//                                 batchTimes.map((batch, index) => {
//                                     return {
//                                         value: batch.time,
//                                         label: batch.time
//                                     }
//                                 })
//                                 // [
//                                 // { value: "online", label: "Online" },
//                                 // { value: "cash", label: "Cash" },
//                                 // ]
//                             }
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4}>
//                         <SelectField
//                             label="Hall No"
//                             name="hall"
//                             value={newBooking.hall}
//                             onChange={handleInputChange}
//                             options={

//                                 batchTimes.map((batch, index) => {
//                                     return {
//                                         value: batch.hall,
//                                         label: batch.hall
//                                     }
//                                 })
//                                 // [
//                                 // { value: "online", label: "Online" },
//                                 // { value: "cash", label: "Cash" },
//                                 // ]
//                             }
//                         />
//                     </Grid>

//                     <InputField
//                         name="bookBy"
//                         value={getTokenFromLocalStorage?.user.email}
//                         //   onChange={handleInputChange}
//                         fullWidth
//                     />



//                     <Grid item xs={12}>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handleCreateBooking}
//                             disabled={loading}
//                         >
//                             {loading ? "Creating..." : "Create Booking"}
//                         </Button>
//                     </Grid>
//                 </Grid>


//                 {/* Search Controls */}
//                 <Typography variant="h6">Search Bookings</Typography>
//                 <Grid container spacing={2} sx={{ marginBottom: 4 }}>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <InputField label="Receipt Number" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Button variant="contained" color="primary" onClick={handleSearch}>
//                             Search
//                         </Button>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <InputField
//                             label="Select Date"
//                             type="date"
//                             value={date}
//                             onChange={(e) => setDate(e.target.value)}
//                             InputLabelProps={{ shrink: true }}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Button variant="contained" color="secondary" onClick={handleSearch}>
//                             Get Daily Bookings
//                         </Button>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <InputField
//                             label="Book By"
//                             type="text"
//                             value={bookBy}
//                             onChange={(e) => setBookBy(e.target.value)}
//                             InputLabelProps={{ shrink: true }}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Button variant="contained" color="secondary" onClick={handleSearch}>
//                             Book By
//                         </Button>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <SelectField
//                             label="Payment Status"
//                             value={paymentStatus}
//                             onChange={(e) => setPaymentStatus(e.target.value)}
//                             options={[
//                                 { value: "", label: "Select Status" },
//                                 { value: "online", label: "Online" },
//                                 { value: "cash", label: "Cash" },
//                             ]}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Button variant="contained" color="primary" onClick={handleSearch}>
//                             Search by Status
//                         </Button>
//                     </Grid>
//                 </Grid>

//                 {/* Error Message */}
//                 {error && <Typography color="error">{error}</Typography>}

//                 {/* Display Total Bookings and Amount */}
//                 <Box sx={{ marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
//                     <Typography variant="h6">
//                         Total Bookings: {bookings.length}
//                     </Typography>
//                     <Typography variant="h6">
//                         Grand Total Amount: ₹{totalAmount.toLocaleString()}
//                     </Typography>
//                 </Box>

//                 {/* Download Excel */}
//                 <Button variant="contained" color="secondary" startIcon={<FaCloudDownloadAlt />} onClick={downloadExcel}>
//                     Download All Bookings as Excel
//                 </Button>

//                 {/* Booking List */}
//                 {/* <Box sx={{ marginBottom: 2 }}>
//                 <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             {["Receipt Number", "Serial Number", "Book By", "Name", "Phone", "Address", "Abhishek Type", "Batch Time", "Hall No.", "Amount", "Payment Status", "Created At", "Actions"].map((header) => (
//                                 <TableCell key={header}>{header}</TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {bookings.map((booking) => (
//                             <TableRow key={booking._id}>
//                                 <TableCell>{booking.receipt_number}</TableCell>
//                                 <TableCell>{booking.serial_number}</TableCell>
//                                 <TableCell>{booking.bookBy}</TableCell>
//                                 <TableCell>{booking.name}</TableCell>
//                                 <TableCell>{booking.phone}</TableCell>
//                                 <TableCell>{booking.address}</TableCell>
//                                 <TableCell>{booking.abhishek_type}</TableCell>
//                                 <TableCell>{booking.batch_time}</TableCell>
//                                 <TableCell>{booking.hall}</TableCell>
//                                 <TableCell>{booking.amount}</TableCell>
//                                 <TableCell>{booking.paymentStatus}</TableCell>
//                                 <TableCell>{moment(booking.createdAt).format("YYYY-MM-DD HH:mm")}</TableCell>
//                                 <TableCell className="d-flex gap-3">

//                                     <FaCloudDownloadAlt onClick={() => downloadBookingPDF(booking._id)} style={{ cursor:"pointer", fontSize: "23px", color:"blue" }}/>

//                                 {getTokenFromLocalStorage?.admin.role !== "subadmin" && (
//                                     <MdDelete onClick={() => handleDelete(booking._id)} style={{ cursor:"pointer", fontSize:"23px", color: "red" }} />
//                                 )}
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             </Box> */}

//                 {/* ───── Booking List with Pagination ───── */}
//                 <Box sx={{ my: 2 }}>
//                     {error && <div style={{ color: "red" }}>{error}</div>}
//                     <TableContainer component={Paper}>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     {[
//                                         "Receipt No.",
//                                         // "Serial No.",
//                                         "Book By",
//                                         "Name",
//                                         "Phone",
//                                         // "Address",
//                                         "Abhishek Type",
//                                         "Batch Time",
//                                         "Hall No.",
//                                         "Amount",
//                                         "Payment Status",
//                                         "Created At",
//                                         "Actions",
//                                     ].map((head) => (
//                                         <TableCell key={head} style={{ fontSize: "12px" }}>{head} </TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {visibleRows.map((b) => (
//                                     <TableRow key={b._id} hover
//                                         sx={{
//                                             "&:hover": {
//                                                 backgroundColor: "#c7cadac7",
//                                                 cursor: "pointer",
//                                             },
//                                         }}>
//                                         <TableCell>{b.receipt_number}</TableCell>
//                                         {/* <TableCell>{b.serial_number}</TableCell> */}
//                                         <TableCell>{b.bookBy}</TableCell>
//                                         <TableCell>{b.name}</TableCell>
//                                         <TableCell>{b.phone}</TableCell>
//                                         {/* <TableCell>{b.address}</TableCell> */}
//                                         <TableCell>{b.abhishek_type}</TableCell>
//                                         <TableCell>{b.batch_time}</TableCell>
//                                         <TableCell>{b.hall}</TableCell>
//                                         <TableCell>{b.amount}</TableCell>
//                                         <TableCell>{b.paymentStatus}</TableCell>
//                                         <TableCell>
//                                             {moment(b.createdAt).format("YY-MM-D")}
//                                         </TableCell>
//                                         <TableCell style={{ display: "flex", gap: 8 }}>
//                                             <FaCloudDownloadAlt
//                                                 onClick={() => downloadBookingPDF(b._id)}
//                                                 style={{ cursor: "pointer", fontSize: 22 }}
//                                             />
//                                             {getTokenFromLocalStorage?.admin?.role !== "subadmin" && (
//                                                 <MdDelete
//                                                     onClick={() => handleDelete(b._id)}
//                                                     style={{ cursor: "pointer", fontSize: 22, color: "red" }}
//                                                 />
//                                             )}
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     <TablePagination
//                         component="div"
//                         count={totalBookings}
//                         page={page}
//                         onPageChange={handleChangePage}
//                         rowsPerPage={rowsPerPage}
//                         onRowsPerPageChange={handleChangeRowsPerPage}
//                         rowsPerPageOptions={[5, 10, 25, 50]}
//                     />
//                 </Box>


//             </Box>
//         </>
//     );
// };

// export default BookingDashboard;



import React, { useEffect, useState } from "react";
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
    TablePagination,
    Card,
    CardHeader,
    CardContent,
    Divider,
    Chip,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
    Stack,
    Skeleton,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { base_booking_url, base_booking_url2 } from "../../utils/base_url";
import * as XLSX from "xlsx";
import { MdDelete } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { config } from "../../utils/axiosconfig";

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, type = "text", sx, InputLabelProps }) => (
    <TextField
        label={label}
        variant="outlined"
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        fullWidth
        size="small"
        InputLabelProps={InputLabelProps}
        sx={{ ...sx }}
    />
);

// Reusable Select Field Component
const SelectField = ({ label, name, value, onChange, options, sx }) => (
    <FormControl variant="outlined" fullWidth size="small" sx={{ ...sx }}>
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

// Payment status chip
const PaymentStatusChip = ({ status }) => {
    if (!status) return <Chip label="Unknown" size="small" variant="outlined" />;
    const isOnline = status.toLowerCase() === "online";
    return (
        <Chip
            label={status.toUpperCase()}
            size="small"
            color={isOnline ? "info" : "success"}
            variant="filled"
        />
    );
};

const BookingDashboard = () => {

    const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"));

    const [newBooking, setNewBooking] = useState({
        name: "",
        phone: "",
        address: "",
        abhishek_type: "",
        amount: "",
        batch_time: "",
        hall: "",
        bookBy: getTokenFromLocalStorage?.user?.email || "",
        paymentStatus: "",
    });

    const [customType, setCustomType] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [tableLoading, setTableLoading] = React.useState(false);

    const [receiptNumber, setReceiptNumber] = useState("");
    const [date, setDate] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [bookBy, setBookBy] = useState("");
    const [bookings, setBookings] = useState([]);

    const [totalBookings, setTotalBookings] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const [error, setError] = useState("");

    const batchTimes = [
        { time: '7:00 AM to 8:15 AM', hall: 'H1' }, { time: '7:30 AM to 8:45 AM', hall: 'H2' },
        { time: '8:30 AM to 9:45 AM', hall: 'H1' }, { time: '9:00 AM to 10:15 AM', hall: 'H2' },
        { time: '9:00 AM to 10:15 AM', hall: 'H3' }, { time: '10:00 AM to 11:15 AM', hall: 'H1' },
        { time: '10:30 AM to 11:45 AM', hall: 'H2' }, { time: '10:30 AM to 11:45 AM', hall: 'H3' },
        { time: '11:30 AM to 12:45 PM', hall: 'H1' }, { time: '12:00 PM to 1:15 PM', hall: 'H2' },
        { time: '12:10 PM to 1:30 PM', hall: 'H3' }, { time: '1:00 PM to 2:15 PM', hall: 'H1' },
        { time: '1:30 PM to 2:45 PM', hall: 'H2' }, { time: '1:45 PM to 3:00 PM', hall: 'H3' },
    ];

    const fetchBookings = async (extraParams = {}) => {
        try {
            setTableLoading(true);
            const params = {
                page: page + 1, // backend usually 1-based
                limit: rowsPerPage,
                ...extraParams,
            };
            const res = await axios.get(`${base_booking_url2}booking/viewAll`, {
                params,
                ...config,
            });
            const list =
                res.data.bookings ??
                res.data.docs ??
                res.data.data ??
                res.data ??
                [];
            const total =
                res.data.totalBookings ??
                res.data.totalDocs ??
                res.data.total ??
                list.length;
            setBookings(list);
            setTotalBookings(total);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching bookings");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage]);

    useEffect(() => {
        // Find the hall based on the selected batch time
        const selectedBatch = batchTimes.find(batch => batch.time === newBooking.batch_time);
        if (selectedBatch) {
            setNewBooking(prevState => ({ ...prevState, hall: selectedBatch.hall }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newBooking.batch_time]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this booking? This cannot be undone.")) return;
        try {
            await axios.delete(`${base_booking_url}/booking/${id}`, config);
            setBookings(bookings.filter((booking) => booking._id !== id));
            setTotalBookings(totalBookings - 1);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete booking!");
        }
    };

//     const downloadBookingPDF = async (id) => {
//         try {
//             console.log("hit")
//             const response = await axios.get(
//                 `${base_booking_url2}booking/${id}/download`,
//                 {
//                     responseType: "blob",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
// console.log("response",response)
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `${id}_Booking.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to download booking!");
//         }
//     };



const downloadBookingPDF = async (id) => {
    try {
        console.log("🔥 Download clicked:", id);

        const response = await axios.get(
            `${base_booking_url2}booking/${id}/download`,
            {
                ...config,
                responseType: "blob",
            }
        );

        console.log("🔥 Response:", response);

        const blob = new Blob([response.data], {
            type: "application/pdf",
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${id}_Booking.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("❌ Download error:", err);
        setError(
            err.response?.data?.message ||
            "Failed to download booking!"
        );
    }
};

    const downloadExcel = () => {
        const data = bookings?.map((booking) => ({
            "Receipt Number": booking?.receipt_number,
            "Serial Number": booking?.serial_number,
            Name: booking?.name,
            Phone: booking?.phone,
            Address: booking?.address,
            "Abhishek Type": booking?.abhishek_type,
            Amount: booking?.amount,
            "Batch Time": booking?.batch_time,
            Hall: booking?.hall,
            "Payment Status": booking?.paymentStatus,
            "Created At": moment(booking?.createdAt).format("YYYY-MM-DD HH:mm"),
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bookings");
        XLSX.writeFile(wb, "Bookings_Data.xlsx");
    };

    const handleCreateBooking = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${base_booking_url2}booking/create`, newBooking, config);
            const createdBooking = response.data.booking;

            setBookings([response.data.booking, ...bookings]);
            setTotalBookings(totalBookings + 1);

            setNewBooking({
                name: "",
                phone: "",
                address: "",
                abhishek_type: "",
                amount: "",
                batch_time: "",
                hall: "",
                bookBy: getTokenFromLocalStorage?.user?.email || "",
                paymentStatus: "",
            });
            setCustomType(false);
            setError("");

            const pdfResponse = await axios.get(`${base_booking_url2}/booking/${createdBooking._id}/download`, {
                responseType: "blob",
            });

            const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const pdfWindow = window.open(url);
            if (pdfWindow) {
                pdfWindow.onload = () => {
                    pdfWindow.document.body.style.transform = 'scale(0.85)';
                    pdfWindow.document.body.style.transformOrigin = 'top left';
                    pdfWindow.document.body.style.margin = '0';

                    const style = pdfWindow.document.createElement("style");
                    style.innerHTML = `
                @page {
                  size: A4;
                  margin: 0;
                }
                body {
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  font-size: 10pt;
                }
              `;
                    pdfWindow.document.head.appendChild(style);
                    pdfWindow.print();
                };
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking!");
        } finally {
            setLoading(false);
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
            setTableLoading(true);
            const response = await axios.get(`${base_booking_url2}booking/viewAll`, { params, ...config });
            setBookings(response.data.data || []);
            setTotalBookings(response.data.totalBookings || 0);
            setPage(0);
        } catch (err) {
            setBookings([]);
            setTotalBookings(0);
            setError(err.response?.data?.message || "Search failed!");
        } finally {
            setTableLoading(false);
        }
    };

    const handleResetSearch = () => {
        setReceiptNumber("");
        setDate("");
        setPaymentStatus("");
        setBookBy("");
        setPage(0);
        fetchBookings();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBooking((prev) => ({ ...prev, [name]: value }));
    };

    // Calculate Grand Total
    const totalAmount = bookings?.reduce((sum, booking) => sum + parseFloat(booking?.amount || 0), 0);

    const visibleRows =
        bookings.length > rowsPerPage
            ? bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : bookings;

    const isSubadmin = getTokenFromLocalStorage?.admin?.role === "subadmin";

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f5f6fa", minHeight: "100vh" }}>

            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Booking Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Create, search, and manage abhishek bookings
                    </Typography>
                </Box>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            {/* Create Booking */}
            <Card sx={{ mb: 3 }} elevation={2}>
                <CardHeader
                    title="Create New Booking"
                    titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        {["name", "phone", "address", "abhishek_type", "amount"].map((field) => (
                            <Grid item xs={12} sm={6} md={4} key={field}>
                                {field === "abhishek_type" ? (
                                    <Stack spacing={1}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`${field}-label`}>Select Abhishek Type</InputLabel>
                                            <Select
                                                labelId={`${field}-label`}
                                                label="Select Abhishek Type"
                                                name={field}
                                                value={newBooking[field]}
                                                onChange={(e) => {
                                                    if (e.target.value === "custom") {
                                                        setCustomType(true);
                                                        setNewBooking({ ...newBooking, [field]: "" });
                                                    } else {
                                                        setCustomType(false);
                                                        handleInputChange(e);
                                                    }
                                                }}
                                            >
                                                <MenuItem value="">Select Abhishek</MenuItem>
                                                <MenuItem value="Abhishek">Abhishek</MenuItem>
                                                <MenuItem value="Bhomyag">Bhomyag</MenuItem>
                                                <MenuItem value="Independent Special Abhishek">Independent Special Abhishek</MenuItem>
                                                <MenuItem value="Hawanatmak Shanti Abhishek">Hawanatmak Shanti Abhishek</MenuItem>
                                                <MenuItem value="Panchamrit Abhishek">Panchamrit Abhishek</MenuItem>
                                                <MenuItem value="Nitya Mangal Prabhat Shri Mangal Abhishek Pooja">Nitya Mangal Prabhat Shri Mangal Abhishek Pooja</MenuItem>
                                                <MenuItem value="Donation">Donation</MenuItem>
                                                <MenuItem value="Annadan">Annadan</MenuItem>
                                                <MenuItem value="Satyanarayan">Satyanarayan</MenuItem>
                                                <MenuItem value="Post Abhishek">Post Abhishek</MenuItem>
                                                <MenuItem value="custom">Other (type manually)</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {customType && (
                                            <InputField
                                                label="Enter Custom Type"
                                                name={field}
                                                value={newBooking[field]}
                                                onChange={handleInputChange}
                                            />
                                        )}
                                    </Stack>
                                ) : (
                                    <InputField
                                        label={field.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                        name={field}
                                        value={newBooking[field]}
                                        onChange={handleInputChange}
                                    />
                                )}
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

                        <Grid item xs={12} sm={6} md={4}>
                            <SelectField
                                label="Batch Time"
                                name="batch_time"
                                value={newBooking.batch_time}
                                onChange={handleInputChange}
                                options={batchTimes.map((batch) => ({
                                    value: batch.time,
                                    label: batch.time,
                                }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <SelectField
                                label="Hall No"
                                name="hall"
                                value={newBooking.hall}
                                onChange={handleInputChange}
                                options={batchTimes.map((batch) => ({
                                    value: batch.hall,
                                    label: batch.hall,
                                }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <InputField
                                label="Booked By"
                                name="bookBy"
                                value={getTokenFromLocalStorage?.user?.email || ""}
                                onChange={() => { }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleCreateBooking}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {loading ? "Creating..." : "Create Booking"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Search */}
            <Card sx={{ mb: 3 }} elevation={2}>
                <CardHeader
                    title="Search Bookings"
                    titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <InputField
                                label="Receipt Number"
                                value={receiptNumber}
                                onChange={(e) => setReceiptNumber(e.target.value)}
                            />
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
                            <InputField
                                label="Booked By"
                                value={bookBy}
                                onChange={(e) => setBookBy(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SelectField
                                label="Payment Status"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                options={[
                                    { value: "", label: "All statuses" },
                                    { value: "online", label: "Online" },
                                    { value: "cash", label: "Cash" },
                                ]}
                            />
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={handleSearch}>
                            Search
                        </Button>
                        <Button variant="outlined" onClick={handleResetSearch}>
                            Reset
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Bookings on this page</Typography>
                                <Typography variant="h5" fontWeight={700}>{bookings.length}</Typography>
                            </Box>
                            <Typography variant="h4">📖</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Grand total amount</Typography>
                                <Typography variant="h5" fontWeight={700} color="success.main">
                                    ₹{totalAmount.toLocaleString()}
                                </Typography>
                            </Box>
                            <Typography variant="h4">💰</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total bookings (all pages)</Typography>
                                <Typography variant="h5" fontWeight={700} color="primary.main">
                                    {totalBookings}
                                </Typography>
                            </Box>
                            <Typography variant="h4">📊</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Booking List */}
            <Card elevation={2}>
                <CardHeader
                    title="All Bookings"
                    titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                    action={
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<FaCloudDownloadAlt />}
                            onClick={downloadExcel}
                            disabled={bookings.length === 0}
                        >
                            Export Excel
                        </Button>
                    }
                />
                <Divider />

                {tableLoading ? (
                    <Box sx={{ p: 3 }}>
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} height={40} sx={{ mb: 1 }} />
                        ))}
                    </Box>
                ) : bookings.length === 0 ? (
                    <Box sx={{ p: 5, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>No bookings found</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your search filters or create a new booking above.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {[
                                            "Receipt No.",
                                            "Book By",
                                            "Name",
                                            "Phone",
                                            "Abhishek Type",
                                            "Batch Time",
                                            "Hall No.",
                                            "Amount",
                                            "Payment Status",
                                            "Created At",
                                            "Actions",
                                        ].map((head) => (
                                            <TableCell key={head} sx={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>
                                                {head}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows?.map((b) => (
                                        <TableRow
                                            key={b?._id}
                                            hover
                                            sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                                        >
                                            <TableCell sx={{ fontFamily: "monospace" }}>{b?.receipt_number}</TableCell>
                                            <TableCell>{b?.bookBy}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{b?.name}</TableCell>
                                            <TableCell>{b?.phone}</TableCell>
                                            <TableCell>{b?.abhishek_type}</TableCell>
                                            <TableCell sx={{ whiteSpace: "nowrap" }}>{b?.batch_time}</TableCell>
                                            <TableCell>{b?.hall}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>₹{b?.amount}</TableCell>
                                            <TableCell><PaymentStatusChip status={b?.paymentStatus} /></TableCell>
                                            <TableCell>{moment(b?.createdAt).format("DD MMM YY")}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5}>
                                                    <Tooltip title="Download receipt PDF">
                                                        <IconButton size="small" color="primary" onClick={() => downloadBookingPDF(b?._id)}>
                                                            <FaCloudDownloadAlt size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {!isSubadmin && (
                                                        <Tooltip title="Delete booking">
                                                            <IconButton size="small" color="error" onClick={() => handleDelete(b?._id)}>
                                                                <MdDelete size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider />
                        <TablePagination
                            component="div"
                            count={totalBookings}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        />
                    </>
                )}
            </Card>
        </Box>
    );
};

export default BookingDashboard;