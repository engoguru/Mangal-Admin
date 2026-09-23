// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import moment from "moment";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   ResponsiveContainer,
// //   Legend,
// // } from "recharts";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import "jspdf-autotable";
// // import { base_booking_url, base_booking_url2 } from "../../utils/base_url";
// // import { config } from "../../utils/axiosconfig";

// // const abhishekAmounts = {
// //   "Hawanatmak Shanti Abhishek": 6300,
// //   "Panchamrit Abhishek": 7200,
// //   "Nitya Mangal Prabhat Shri Mangal Abhishek Pooja": 5400,
// //   "Abhishek": 810,
// //   "Independent Special Abhishek": 5400,
// //   "Bhomyag": 9000,
// //   "Donation": 0,
// //   "Annadan": 0,
// // };

// // const BookingReport = () => {
// //   const [bookings, setBookings] = useState([]);
// //   const [filteredBookings, setFilteredBookings] = useState([]);
// //   const [totalBookings, setTotalBookings] = useState(0);
// //   const [error, setError] = useState(null);

// //   // Pagination States
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;
// //   const [pageSet, setPageSet] = useState(0);

// //   // Search State
// //   const [searchQuery, setSearchQuery] = useState("");

// //   useEffect(() => {
// //     const fetchBookings = async () => {
// //       try {
// //         // base_booking_url2
// //         const response = await axios.get(`${base_booking_url2}booking/viewAll`, config);
// //         setBookings(response.data.data);
// //         setFilteredBookings(response.data.bookings);
// //         setTotalBookings(response.data.totalBookings);
// //       } catch (err) {
// //         setError(err.response?.data?.message || "Error fetching bookings");
// //       }
// //     };
// //     fetchBookings();
// //   }, []);

// //   // Handle Search
// //  const handleSearch = (e) => {
// //   const query = e.target.value.toLowerCase();
// //   setSearchQuery(query);

// //   // Split query by space into keywords
// //   const keywords = query.split(" ").filter(Boolean);

// //   const filtered = bookings.filter((booking) => {
// //     const combined = Object.values(booking).join(" ").toLowerCase();
// //     // Check if all keywords are present in the booking
// //     return keywords.every((keyword) => combined.includes(keyword));
// //   });

// //   setFilteredBookings(filtered);
// //   setCurrentPage(1);
// // };

// //   // Pagination Logic
// //   const indexOfLastBooking = currentPage * itemsPerPage;
// //   const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
// //   const currentBookings = filteredBookings?.slice(
// //     indexOfFirstBooking,
// //     indexOfLastBooking
// //   );
// //   const totalPages = Math.ceil(filteredBookings?.length / itemsPerPage);

// //   // Pagination Controls
// //   const paginate = (pageNumber) => setCurrentPage(pageNumber);
// //   const nextPageSet = () => {
// //     setPageSet(pageSet + 1);
// //     setCurrentPage(pageSet * 10 + 1);
// //   };
// //   const prevPageSet = () => {
// //     setPageSet(pageSet - 1);
// //     setCurrentPage((pageSet - 1) * 10 + 1);
// //   };

// //   // Group bookings by Date, Month, and Year
// //   const groupByDate = filteredBookings?.reduce((acc, booking) => {
// //     const date = moment(booking.createdAt).format("YYYY-MM-DD");
// //     acc[date] = (acc[date] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const groupByMonth = filteredBookings?.reduce((acc, booking) => {
// //     const month = moment(booking.createdAt).format("YYYY-MM");
// //     acc[month] = (acc[month] || 0) + 1;
// //     return acc;
// //   }, {});

// //   const groupByYear = filteredBookings?.reduce((acc, booking) => {
// //     const year = moment(booking.createdAt).format("YYYY");
// //     acc[year] = (acc[year] || 0) + 1;
// //     return acc;
// //   }, {});

// //   // Prepare data for charts
// //   const dateData = Object.keys(groupByDate || {}).map((key) => ({
// //     date: key,
// //     count: groupByDate[key],
// //   }));
// //   const monthData = Object.keys(groupByMonth ||{}).map((key) => ({
// //     month: key,
// //     count: groupByMonth[key],
// //   }));
// //   const yearData = Object.keys(groupByYear ||{}).map((key) => ({
// //     year: key,
// //     count: groupByYear[key],
// //   }));

// //   // Generate PDF
// //   const downloadPDF = () => {
// //     const doc = new jsPDF("landscape");
// //     const addHeader = () => {
// //       doc.setFontSize(22);
// //       doc.text("Booking Report", doc.internal.pageSize.width / 2, 20, {
// //         align: "center",
// //       });
// //       doc.setFontSize(12);
// //       // doc.text(`📅 Report Date: ${moment().format("YYYY-MM-DD")}`, 14, 35);
// //       // doc.text(`✅ Total Bookings: ${filteredBookings.length}`, 14, 45);
// //     };

// //     const addFooter = (pageNumber) => {
// //       const pageHeight = doc.internal.pageSize.height;
// //       doc.setFontSize(10);
// //       doc.text(
// //         `Page ${pageNumber}`,
// //         doc.internal.pageSize.width - 20,
// //         pageHeight - 10
// //       );
// //       doc.text(
// //         "Generated by Mangal Grah Seva Sanstha ©",
// //         14,
// //         pageHeight - 6
// //       );
// //     };

// //     const tableColumn = [
// //       "Receipt No.",
// //       "Serial No.",
// //       "Booked By",
// //       "Name",
// //       "Phone",
// //       "Address",
// //       "Abhishek Type",
// //       "Batch Time",
// //       "Hall",
// //       "Amount",
// //       "Payment Status",
// //       "Booking Date",
// //     ];

// //     const tableRows = [];
// //     filteredBookings.forEach((booking) => {
// //       const bookingData = [
// //         booking.receipt_number || "N/A",
// //         booking.serial_number || "N/A",
// //         booking.bookBy || "N/A",
// //         booking.name || "N/A",
// //         booking.phone || "N/A",
// //         booking.address || "N/A",
// //         booking.abhishek_type || "N/A",
// //         booking.batch_time || "N/A",
// //         booking.hall || "N/A",
// //         `₹${booking.amount || 0}`,
// //         booking.paymentStatus || "Pending",
// //         moment(booking.createdAt).format("YYYY-MM-DD HH:mm"),
// //       ];
// //       tableRows.push(bookingData);
// //     });

// //     const chunkSize = 20;
// //     let pageNumber = 1;
// //     for (let i = 0; i < tableRows.length; i += chunkSize) {
// //       if (i !== 0) doc.addPage();
// //       addHeader();
// //       autoTable(doc, {
// //         head: [tableColumn],
// //         body: tableRows.slice(i, i + chunkSize),
// //         startY: 65,
// //         theme: "grid",
// //         headStyles: {
// //           fillColor: "#4F46E5",
// //           textColor: "#FFFFFF",
// //         },
// //       });
// //       addFooter(pageNumber);
// //       pageNumber++;
// //     }

// //     doc.save("booking-report.pdf");
// //   };


// // const generateSummaryPDF = () => {
// //   const summaryData = {};

// //   filteredBookings.forEach((booking) => {
// //     const type = booking.abhishek_type
// //       ? booking.abhishek_type.toLowerCase().trim()
// //       : "unknown";
// //     const normalizedType =
// //       Object.keys(abhishekAmounts).find(
// //         (key) => key.toLowerCase().trim() === type
// //       ) || booking.abhishek_type;

// //     if (!summaryData[normalizedType]) {
// //       summaryData[normalizedType] = {
// //         count: 0,
// //         amount: 0,
// //         firstReceipt: booking.receipt_number,
// //         lastReceipt: booking.receipt_number,
// //       };
// //     }

// //     summaryData[normalizedType].count += 1;

// //     // Check if there's a specific amount provided in the booking data
// //     const bookingAmount =
// //       parseFloat(booking.amount) || abhishekAmounts[normalizedType] || 0;

// //     summaryData[normalizedType].amount += bookingAmount;

// //     // Update first and last receipt numbers
// //     if (booking.receipt_number < summaryData[normalizedType].firstReceipt) {
// //       summaryData[normalizedType].firstReceipt = booking.receipt_number;
// //     }
// //     if (booking.receipt_number > summaryData[normalizedType].lastReceipt) {
// //       summaryData[normalizedType].lastReceipt = booking.receipt_number;
// //     }
// //   });

// //   const doc = new jsPDF();
// //   doc.setFontSize(18);
// //   doc.text("Summary Report", 105, 15, { align: "center" });

// //   // Prepare rows for the summary
// //   const summaryRows = Object.keys(summaryData).map((type) => [
// //     type,
// //     summaryData[type].firstReceipt,
// //     summaryData[type].lastReceipt,
// //     summaryData[type].count,
// //     `₹${summaryData[type].amount.toLocaleString()}`,
// //   ]);

// //   // Add summary table
// //   autoTable(doc, {
// //     head: [
// //       [
// //         "Abhishek Type",
// //         "From Receipt No.",
// //         "To Receipt No.",
// //         "Total Count",
// //         "Total Amount",
// //       ],
// //     ],
// //     body: summaryRows,
// //     startY: 25,
// //   });

// //   // Calculate Grand Total
// //   let grandTotalCount = 0;
// //   let grandTotalAmount = 0;

// //   Object.keys(summaryData).forEach((type) => {
// //     grandTotalCount += summaryData[type].count;
// //     grandTotalAmount += summaryData[type].amount;
// //   });

// //   // Add Grand Total Row
// //   autoTable(doc, {
// //     body: [
// //       [
// //         "Grand Total",
// //         "",
// //         "",
// //         grandTotalCount,
// //         `₹${grandTotalAmount.toLocaleString()}`,
// //       ],
// //     ],
// //     startY: summaryRows.length > 0 ? doc.lastAutoTable.finalY + 5 : 25,
// //     styles: {
// //       fontStyle: "bold",
// //       halign: "center",
// //     },
// //     columnStyles: {
// //       0: { halign: "left", fontStyle: "bold" },
// //       1: { halign: "center" },
// //       2: { halign: "center" },
// //       3: { halign: "center", fontStyle: "bold" },
// //       4: { halign: "right", fontStyle: "bold" },
// //     },
// //   });

// //   // Save the generated PDF
// //   doc.save("abhishek-summary-report.pdf");
// // };



// //   return (
// //     <div className="container my-5">
// //       <div className="card shadow p-3 mb-4">
// //         <div className="d-flex justify-content-between align-items-center">
// //           <h1 className="h3 fw-bold text-primary">📊 Booking Report Dashboard</h1>
// //           <button onClick={downloadPDF} className="btn btn-outline-primary">
// //             📥 Download Report as PDF
// //           </button>
// //         </div>
// //       </div>


// //       <div className="card shadow mb-4 p-3">
// //         <div className="d-flex justify-content-between align-items-center">
// //           <h1 className="h3 fw-bold text-primary">📊 Bookings Summary Report</h1>
// //           <div>
// //             <button
// //               onClick={generateSummaryPDF}
// //               className="btn btn-outline-success me-2"
// //             >
// //               📥 Download Summary PDF
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Search Bar */}
// //       <div className="mb-4">
// //         <input
// //           type="text"
// //           className="form-control p-3"
// //           placeholder="🔍 Search by Receipt No., Name, Phone, etc..."
// //           value={searchQuery}
// //           onChange={handleSearch}
// //         />
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="row mb-4">
// //         <div className="col-md-4 mb-3">
// //           <div className="card shadow border-primary">
// //             <div className="card-body text-center">
// //               <h5 className="card-title">📅 Total Bookings</h5>
// //               <p className="h3 text-primary">{filteredBookings?.length}</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="col-md-4 mb-3">
// //           <div className="card shadow border-success">
// //             <div className="card-body text-center">
// //               <h5 className="card-title">🕒 Month-wise Data</h5>
// //               <p className="h5 text-success">{monthData?.length} months recorded</p>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="col-md-4 mb-3">
// //           <div className="card shadow border-warning">
// //             <div className="card-body text-center">
// //               <h5 className="card-title">📆 Year-wise Data</h5>
// //               <p className="h5 text-warning">{yearData?.length} years recorded</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //        {/* Date Wise Chart */}
// //     <div className="card shadow mb-4">
// //       <div className="card-body">
// //         <h5 className="card-title mb-3">📅 Date-wise Bookings</h5>
// //         <ResponsiveContainer width="100%" height={300}>
// //           <BarChart data={dateData}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="date" />
// //             <YAxis />
// //             <Tooltip />
// //             <Legend />
// //             <Bar dataKey="count" fill="#4F46E5" />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </div>
// //     </div>

// //     {/* Month Wise Chart */}
// //     <div className="card shadow mb-4">
// //       <div className="card-body">
// //         <h5 className="card-title mb-3">📆 Month-wise Bookings</h5>
// //         <ResponsiveContainer width="100%" height={300}>
// //           <BarChart data={monthData}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="month" />
// //             <YAxis />
// //             <Tooltip />
// //             <Legend />
// //             <Bar dataKey="count" fill="#28A745" />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </div>
// //     </div>

// //     {/* Year Wise Chart */}
// //     <div className="card shadow mb-4">
// //       <div className="card-body">
// //         <h5 className="card-title mb-3">🗓️ Year-wise Bookings</h5>
// //         <ResponsiveContainer width="100%" height={300}>
// //           <BarChart data={yearData}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="year" />
// //             <YAxis />
// //             <Tooltip />
// //             <Legend />
// //             <Bar dataKey="count" fill="#FFC107" />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </div>
// //     </div>

// //       {/* Bookings Table */}
// //       <div className="card shadow mb-4">
// //         <div className="card-body">
// //           <h5 className="card-title mb-3">📚 Booking Data</h5>
// //           <div className="table-responsive">
// //             <table className="table table-striped table-bordered">
// //               <thead className="table-dark">
// //                 <tr>
// //                   <th>Receipt No.</th>
// //                   <th>Serial No.</th>
// //                   <th>Booked By</th>
// //                   <th>Name</th>
// //                   <th>Phone</th>
// //                   <th>Address</th>
// //                   <th>Abhishek Type</th>
// //                   <th>Batch Time</th>
// //                   <th>Hall</th>
// //                   <th>Amount</th>
// //                   <th>Payment Status</th>
// //                   <th>Booking Date</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentBookings?.map((booking) => (
// //                   <tr key={booking.receipt_number}>
// //                     <td>{booking.receipt_number}</td>
// //                     <td>{booking.serial_number}</td>
// //                     <td>{booking.bookBy}</td>
// //                     <td>{booking.name}</td>
// //                     <td>{booking.phone}</td>
// //                     <td>{booking.address}</td>
// //                     <td>{booking.abhishek_type}</td>
// //                     <td>{booking.batch_time}</td>
// //                     <td>{booking.hall}</td>
// //                     <td>₹{booking.amount}</td>
// //                     <td>{booking.paymentStatus}</td>
// //                     <td>{moment(booking.createdAt).format("YYYY-MM-DD HH:mm")}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           <nav aria-label="Page navigation" className="mt-4">
// //             <ul className="pagination justify-content-center flex-wrap">
// //               <li className={`page-item ${pageSet === 0 ? "disabled" : ""}`}>
// //                 <button
// //                   onClick={prevPageSet}
// //                   className="page-link"
// //                   disabled={pageSet === 0}
// //                 >
// //                   ⏮️ Previous 10
// //                 </button>
// //               </li>
// //               {Array.from({ length: Math.min(10, totalPages - pageSet * 10) }).map(
// //                 (_, index) => {
// //                   const pageNumber = pageSet * 10 + index + 1;
// //                   return (
// //                     <li
// //                       key={pageNumber}
// //                       className={`page-item ${
// //                         currentPage === pageNumber ? "active" : ""
// //                       }`}
// //                     >
// //                       <button
// //                         onClick={() => paginate(pageNumber)}
// //                         className="page-link"
// //                       >
// //                         {pageNumber}
// //                       </button>
// //                     </li>
// //                   );
// //                 }
// //               )}
// //               <li
// //                 className={`page-item ${
// //                   (pageSet + 1) * 10 >= totalPages ? "disabled" : ""
// //                 }`}
// //               >
// //                 <button
// //                   onClick={nextPageSet}
// //                   className="page-link"
// //                   disabled={(pageSet + 1) * 10 >= totalPages}
// //                 >
// //                   Next 10 ⏭️
// //                 </button>
// //               </li>
// //             </ul>
// //           </nav>
// //         </div>
// //       </div>

// //       {/* Error Message */}
// //       {error && (
// //         <div className="alert alert-danger mt-4" role="alert">
// //           ❌ {error}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default BookingReport;












// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import moment from "moment";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// import { base_booking_url2 } from "../../utils/base_url";
// import { config } from "../../utils/axiosconfig";


// const BookingReport = () => {

//   const [analytics, setAnalytics] = useState({});
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);

//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);

//   const limit = 10;


//   const getData = async () => {
//     try {

//       const [analyticRes, bookingRes] = await Promise.all([

//         axios.get(
//           `${base_booking_url2}booking/analytic`,
//           config
//         ),

//         axios.get(
//           `${base_booking_url2}booking/viewAll`,
//           config
//         )

//       ]);


//       setAnalytics(analyticRes.data);

//       setBookings(bookingRes.data.data || []);

//       setFilteredBookings(
//         bookingRes.data.data || []
//       );


//     } catch (err) {

//       setError(
//         err.response?.data?.message ||
//         "Something went wrong"
//       );

//     }
//   };


//   useEffect(() => {

//     getData();

//   }, []);



//   const handleSearch = (e) => {

//     const value = e.target.value.toLowerCase();

//     setSearch(value);


//     if (!value) {

//       setFilteredBookings(bookings);
//       return;

//     }


//     const result = bookings.filter(item => {

//       return Object.values(item)
//         .join(" ")
//         .toLowerCase()
//         .includes(value);

//     });


//     setFilteredBookings(result);
//     setCurrentPage(1);

//   };



//   const start =
//     (currentPage - 1) * limit;


//   const currentBookings =
//     filteredBookings.slice(
//       start,
//       start + limit
//     );


//   const totalPages =
//     Math.ceil(
//       filteredBookings.length / limit
//     );



//   const downloadPDF = () => {

//     const pdf = new jsPDF("landscape");


//     pdf.text(
//       "Booking Report",
//       140,
//       20
//     );


//     const rows = filteredBookings.map(item => [

//       item.receipt_number,
//       item.serial_number,
//       item.bookBy,
//       item.name,
//       item.phone,
//       item.address,
//       item.abhishek_type,
//       item.batch_time,
//       item.hall,
//       item.amount,
//       item.paymentStatus,
//       moment(item.createdAt)
//         .format("YYYY-MM-DD")

//     ]);



//     autoTable(pdf, {

//       head: [[

//         "Receipt",
//         "Serial",
//         "Booked By",
//         "Name",
//         "Phone",
//         "Address",
//         "Type",
//         "Batch",
//         "Hall",
//         "Amount",
//         "Payment",
//         "Date"

//       ]],

//       body: rows,

//       startY: 35

//     });


//     pdf.save(
//       "booking-report.pdf"
//     );

//   };



//   const downloadSummaryPDF = () => {

//     const pdf = new jsPDF();


//     pdf.text(
//       "Booking Summary",
//       80,
//       20
//     );


//     const rows =
//       analytics.abhishekSummary?.map(item => [

//         item.type,
//         item.firstReceipt,
//         item.lastReceipt,
//         item.count,
//         item.amount

//       ]) || [];



//     autoTable(pdf, {

//       head:[[

//         "Type",
//         "From",
//         "To",
//         "Count",
//         "Amount"

//       ]],

//       body:rows,

//       startY:30

//     });



//     pdf.save(
//       "summary-report.pdf"
//     );

//   };



//   const dateData =
//     analytics.dateWise || [];

//   const monthData =
//     analytics.monthWise || [];

//   const yearData =
//     analytics.yearWise || [];
//   return (
//     <div className="container my-5">

//       {error && (
//         <div className="alert alert-danger">
//           {error}
//         </div>
//       )}


//       {/* Header */}
//       <div className="card shadow p-3 mb-4">

//         <div className="d-flex justify-content-between align-items-center">

//           <h3 className="text-primary fw-bold">
//             📊 Booking Report Dashboard
//           </h3>


//           <button
//             className="btn btn-outline-primary"
//             onClick={downloadPDF}
//           >
//             📥 Download Report
//           </button>

//         </div>

//       </div>




//       {/* Summary PDF */}
//       <div className="card shadow p-3 mb-4">

//         <div className="d-flex justify-content-between">

//           <h4 className="text-primary">
//             Booking Summary
//           </h4>


//           <button
//             className="btn btn-outline-success"
//             onClick={downloadSummaryPDF}
//           >
//             📥 Download Summary
//           </button>

//         </div>

//       </div>





//       {/* Cards */}
//       <div className="row mb-4">


//         <div className="col-md-4 mb-3">

//           <div className="card shadow border-primary">

//             <div className="card-body text-center">

//               <h5>
//                 📅 Total Bookings
//               </h5>

//               <h2 className="text-primary">
//                 {analytics.summary?.totalBookings || 0}
//               </h2>

//             </div>

//           </div>

//         </div>



//         <div className="col-md-4 mb-3">

//           <div className="card shadow border-success">

//             <div className="card-body text-center">

//               <h5>
//                 💰 Total Amount
//               </h5>

//               <h2 className="text-success">
//                 ₹
//                 {analytics.summary?.grandTotalAmount || 0}
//               </h2>

//             </div>

//           </div>

//         </div>



//         <div className="col-md-4 mb-3">

//           <div className="card shadow border-warning">

//             <div className="card-body text-center">

//               <h5>
//                 📆 Months
//               </h5>

//               <h2 className="text-warning">
//                 {monthData.length}
//               </h2>

//             </div>

//           </div>

//         </div>


//       </div>





//       {/* Charts */}

//       <div className="card shadow mb-4">

//         <div className="card-body">

//           <h5>
//             📅 Date Wise Bookings
//           </h5>


//           <ResponsiveContainer
//             width="100%"
//             height={300}
//           >

//             <BarChart data={dateData}>

//               <CartesianGrid strokeDasharray="3 3"/>

//               <XAxis dataKey="date"/>

//               <YAxis/>

//               <Tooltip/>

//               <Legend/>

//               <Bar
//                 dataKey="count"
//                 fill="#4F46E5"
//               />

//             </BarChart>

//           </ResponsiveContainer>


//         </div>

//       </div>





//       <div className="card shadow mb-4">

//         <div className="card-body">

//           <h5>
//             📆 Month Wise Bookings
//           </h5>


//           <ResponsiveContainer
//             width="100%"
//             height={300}
//           >

//             <BarChart data={monthData}>


//               <CartesianGrid strokeDasharray="3 3"/>

//               <XAxis dataKey="month"/>

//               <YAxis/>

//               <Tooltip/>

//               <Legend/>


//               <Bar
//                 dataKey="count"
//                 fill="#28a745"
//               />


//             </BarChart>


//           </ResponsiveContainer>


//         </div>


//       </div>





//       <div className="card shadow mb-4">

//         <div className="card-body">


//           <h5>
//             🗓 Year Wise Bookings
//           </h5>



//           <ResponsiveContainer
//             width="100%"
//             height={300}
//           >

//             <BarChart data={yearData}>


//               <CartesianGrid strokeDasharray="3 3"/>

//               <XAxis dataKey="year"/>

//               <YAxis/>

//               <Tooltip/>

//               <Legend/>


//               <Bar
//                 dataKey="count"
//                 fill="#ffc107"
//               />


//             </BarChart>


//           </ResponsiveContainer>



//         </div>

//       </div>







//       {/* Abhishek Summary */}

//       <div className="card shadow mb-4">

//         <div className="card-body">


//           <h5>
//             🕉 Abhishek Summary
//           </h5>



//           <div className="table-responsive">

//             <table className="table table-bordered">

//               <thead className="table-dark">

//                 <tr>

//                   <th>Type</th>
//                   <th>From</th>
//                   <th>To</th>
//                   <th>Count</th>
//                   <th>Amount</th>

//                 </tr>

//               </thead>


//               <tbody>


//               {
//                 analytics.abhishekSummary?.map(
//                   (item,index)=>(

//                     <tr key={index}>

//                       <td>{item.type}</td>

//                       <td>{item.firstReceipt}</td>

//                       <td>{item.lastReceipt}</td>

//                       <td>{item.count}</td>

//                       <td>
//                         ₹{item.amount}
//                       </td>

//                     </tr>

//                   )
//                 )
//               }


//               </tbody>


//             </table>


//           </div>


//         </div>

//       </div>







//       {/* Payment Summary */}

//       <div className="card shadow mb-4">

//         <div className="card-body">


//           <h5>
//             💳 Payment Status
//           </h5>


//           <table className="table table-bordered">


//             <thead className="table-dark">

//               <tr>

//                 <th>Status</th>
//                 <th>Count</th>
//                 <th>Amount</th>

//               </tr>


//             </thead>



//             <tbody>


//             {
//               analytics.paymentStatus?.map(
//                 (item,index)=>(

//                   <tr key={index}>

//                     <td>
//                       {item.status}
//                     </td>

//                     <td>
//                       {item.count}
//                     </td>

//                     <td>
//                       ₹{item.amount}
//                     </td>

//                   </tr>

//                 )
//               )
//             }


//             </tbody>


//           </table>


//         </div>


//       </div>







//       {/* Booking List */}

//       <div className="card shadow mb-4">


//         <div className="card-body">


//           <div className="d-flex justify-content-between mb-3">


//             <h5>
//               📚 Booking Data
//             </h5>


//             <input

//               className="form-control w-25"

//               placeholder="Search..."

//               value={search}

//               onChange={handleSearch}

//             />


//           </div>





//           <div className="table-responsive">


//             <table className="table table-striped table-bordered">


//               <thead className="table-dark">


//                 <tr>

//                   <th>Receipt</th>
//                   <th>Serial</th>
//                   <th>Booked By</th>
//                   <th>Name</th>
//                   <th>Phone</th>
//                   <th>Address</th>
//                   <th>Type</th>
//                   <th>Batch</th>
//                   <th>Hall</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Date</th>

//                 </tr>


//               </thead>



//               <tbody>


//               {
//                 currentBookings.map(item=>(

//                   <tr key={item._id}>


//                     <td>{item.receipt_number}</td>

//                     <td>{item.serial_number}</td>

//                     <td>{item.bookBy}</td>

//                     <td>{item.name}</td>

//                     <td>{item.phone}</td>

//                     <td>{item.address}</td>

//                     <td>{item.abhishek_type}</td>

//                     <td>{item.batch_time}</td>

//                     <td>{item.hall}</td>

//                     <td>
//                       ₹{item.amount}
//                     </td>

//                     <td>
//                       {item.paymentStatus}
//                     </td>

//                     <td>
//                       {moment(item.createdAt)
//                       .format("YYYY-MM-DD HH:mm")}
//                     </td>


//                   </tr>

//                 ))
//               }


//               </tbody>


//             </table>


//           </div>






//           {/* Pagination */}

//           <nav>


//             <ul className="pagination justify-content-center">


//             {
//               Array.from(
//                 {
//                   length: totalPages
//                 }
//               ).map(
//                 (_,index)=>(


//                 <li
//                   key={index}
//                   className={
//                     `page-item ${
//                     currentPage === index+1
//                     ? "active"
//                     : ""
//                     }`
//                   }
//                 >

//                   <button

//                     className="page-link"

//                     onClick={()=>setCurrentPage(index+1)}

//                   >

//                     {index+1}

//                   </button>


//                 </li>


//                 )
//               )
//             }


//             </ul>


//           </nav>



//         </div>


//       </div>


//     </div>
//   );

// };


// export default BookingReport;







import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { base_booking_url2 } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const PAGE_WINDOW = 5;

const PaymentBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();
  const map = {
    online: "bg-info-subtle text-info-emphasis",
    cash: "bg-success-subtle text-success-emphasis",
    pending: "bg-warning-subtle text-warning-emphasis",
  };
  return (
    <span className={`badge ${map[normalized] || "bg-secondary-subtle text-secondary-emphasis"}`}>
      {status || "Pending"}
    </span>
  );
};

const BookingReport = () => {

  const [analytics, setAnalytics] = useState({});
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;


  const getData = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticRes, bookingRes] = await Promise.all([

        axios.get(
          `${base_booking_url2}booking/analytic`,
          config
        ),

        axios.get(
          `${base_booking_url2}booking/viewAll`,
          config
        )

      ]);


      setAnalytics(analyticRes.data);

      setBookings(bookingRes.data.data || []);

      setFilteredBookings(
        bookingRes.data.data || []
      );


    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    getData();

  }, []);



  const handleSearch = (e) => {

    const value = e.target.value.toLowerCase();

    setSearch(value);


    if (!value) {

      setFilteredBookings(bookings);
      setCurrentPage(1);
      return;

    }


    const result = bookings.filter(item => {

      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(value);

    });


    setFilteredBookings(result);
    setCurrentPage(1);

  };



  const start =
    (currentPage - 1) * limit;


  const currentBookings =
    filteredBookings.slice(
      start,
      start + limit
    );


  const totalPages =
    Math.ceil(
      filteredBookings.length / limit
    ) || 1;


  // Windowed pagination so we never render hundreds of page buttons
  const windowStart = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(PAGE_WINDOW / 2),
      totalPages - PAGE_WINDOW + 1
    )
  );
  const pageNumbers = Array.from(
    { length: Math.min(PAGE_WINDOW, totalPages) },
    (_, i) => Math.max(1, windowStart) + i
  ).filter(n => n <= totalPages);



  const downloadPDF = () => {

    const pdf = new jsPDF("landscape");


    pdf.text(
      "Booking Report",
      140,
      20
    );


    const rows = filteredBookings.map(item => [

      item.receipt_number,
      item.serial_number,
      item.bookBy,
      item.name,
      item.phone,
      item.address,
      item.abhishek_type,
      item.batch_time,
      item.hall,
      item.amount,
      item.paymentStatus,
      moment(item.createdAt)
        .format("YYYY-MM-DD")

    ]);



    autoTable(pdf, {

      head: [[

        "Receipt",
        "Serial",
        "Booked By",
        "Name",
        "Phone",
        "Address",
        "Type",
        "Batch",
        "Hall",
        "Amount",
        "Payment",
        "Date"

      ]],

      body: rows,

      startY: 35

    });


    pdf.save(
      "booking-report.pdf"
    );

  };



  const downloadSummaryPDF = () => {

    const pdf = new jsPDF();


    pdf.text(
      "Booking Summary",
      80,
      20
    );


    const rows =
      analytics.abhishekSummary?.map(item => [

        item.type,
        item.firstReceipt,
        item.lastReceipt,
        item.count,
        item.amount

      ]) || [];



    autoTable(pdf, {

      head:[[

        "Type",
        "From",
        "To",
        "Count",
        "Amount"

      ]],

      body:rows,

      startY:30

    });



    pdf.save(
      "summary-report.pdf"
    );

  };



  const dateData =
    analytics.dateWise || [];

  const monthData =
    analytics.monthWise || [];

  const yearData =
    analytics.yearWise || [];

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-1">📊 Booking Report Dashboard</h3>
              <p className="text-muted mb-0">
                Analytics, summaries and exportable reports for all bookings
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button className="btn btn-outline-primary" onClick={downloadPDF} disabled={loading || filteredBookings.length === 0}>
                📥 Download Report
              </button>
              <button className="btn btn-outline-success" onClick={downloadSummaryPDF} disabled={loading}>
                📥 Download Summary
              </button>
              <button className="btn btn-outline-secondary" onClick={getData} disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "🔄 Refresh"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap mb-4">
          <span>⚠️ {error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={getData}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mb-0">Loading report data...</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary cards */}
          <div className="row g-3 mb-4">

            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Bookings</h6>
                    <h3 className="text-primary fw-bold mb-0">
                      {analytics.summary?.totalBookings || 0}
                    </h3>
                  </div>
                  <span className="fs-2">📅</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Amount</h6>
                    <h3 className="text-success fw-bold mb-0">
                      ₹{analytics.summary?.grandTotalAmount || 0}
                    </h3>
                  </div>
                  <span className="fs-2">💰</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Months Recorded</h6>
                    <h3 className="text-warning fw-bold mb-0">
                      {monthData.length}
                    </h3>
                  </div>
                  <span className="fs-2">📆</span>
                </div>
              </div>
            </div>

          </div>

          {/* Charts */}
          <div className="row g-3 mb-4">

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-bold">
                  📅 Date Wise Bookings
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-bold">
                  📆 Month Wise Bookings
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#28a745" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-bold">
                  🗓 Year Wise Bookings
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#ffc107" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* Abhishek + Payment summary side by side */}
          <div className="row g-3 mb-4">

            <div className="col-lg-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-bold">
                  🕉 Abhishek Summary
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th className="text-end">Count</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.abhishekSummary?.length > 0 ? (
                        analytics.abhishekSummary.map((item, index) => (
                          <tr key={index}>
                            <td className="fw-semibold">{item.type}</td>
                            <td>{item.firstReceipt}</td>
                            <td>{item.lastReceipt}</td>
                            <td className="text-end">{item.count}</td>
                            <td className="text-end">₹{item.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-3">
                            No summary data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-bold">
                  💳 Payment Status
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Status</th>
                        <th className="text-end">Count</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.paymentStatus?.length > 0 ? (
                        analytics.paymentStatus.map((item, index) => (
                          <tr key={index}>
                            <td><PaymentBadge status={item.status} /></td>
                            <td className="text-end">{item.count}</td>
                            <td className="text-end">₹{item.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center text-muted py-3">
                            No payment data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* Booking list */}
          <div className="card shadow-sm border-0 mb-4">

            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="fw-bold">📚 Booking Data</span>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-secondary-subtle text-secondary">
                  {filteredBookings.length} records
                </span>
                <input
                  className="form-control form-control-sm"
                  style={{ minWidth: 220 }}
                  placeholder="🔍 Search receipt, name, phone..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="card-body text-center py-5">
                <h6 className="mb-2">No bookings found</h6>
                <p className="text-muted mb-0">
                  {search ? `No results match "${search}"` : "There is no booking data available yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Receipt</th>
                        <th>Serial</th>
                        <th>Booked By</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Type</th>
                        <th>Batch</th>
                        <th>Hall</th>
                        <th className="text-end">Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentBookings.map(item => (
                        <tr key={item._id}>
                          <td className="font-monospace">{item.receipt_number}</td>
                          <td>{item.serial_number}</td>
                          <td>{item.bookBy}</td>
                          <td className="fw-semibold">{item.name}</td>
                          <td>{item.phone}</td>
                          <td>{item.address}</td>
                          <td>{item.abhishek_type}</td>
                          <td>{item.batch_time}</td>
                          <td>{item.hall}</td>
                          <td className="text-end fw-semibold">₹{item.amount}</td>
                          <td><PaymentBadge status={item.paymentStatus} /></td>
                          <td>{moment(item.createdAt).format("DD MMM YY, HH:mm")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="card-footer bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">

                  <span className="text-muted small">
                    Showing {start + 1}-{Math.min(start + limit, filteredBookings.length)} of {filteredBookings.length}
                  </span>

                  <nav>
                    <ul className="pagination pagination-sm mb-0">

                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                          Prev
                        </button>
                      </li>

                      {windowStart > 1 && (
                        <li className="page-item disabled d-none d-sm-block">
                          <span className="page-link">…</span>
                        </li>
                      )}

                      {pageNumbers.map(num => (
                        <li key={num} className={`page-item ${currentPage === num ? "active" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(num)}>
                            {num}
                          </button>
                        </li>
                      ))}

                      {windowStart + PAGE_WINDOW - 1 < totalPages && (
                        <li className="page-item disabled d-none d-sm-block">
                          <span className="page-link">…</span>
                        </li>
                      )}

                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                          Next
                        </button>
                      </li>

                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </>
      )}

    </div>
  );

};


export default BookingReport;
