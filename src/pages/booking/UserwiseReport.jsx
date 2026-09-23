// import React, { useEffect, useState } from 'react';
// import moment from 'moment';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
// import { config } from '../../utils/axiosconfig';
// import { base_booking_url2 } from '../../utils/base_url';

// const DAYS_PER_PAGE = 5;
// // https://api.mangalagrahmandir.in/api/v1/booking/
// const UserwiseReport = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');
//   const [groupedData, setGroupedData] = useState({});
//   const [filteredDays, setFilteredDays] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch bookings from API
//   useEffect(() => {
//     setLoading(true);
//     fetch(`${base_booking_url2}booking/viewAll`, config)
//       .then(res => res.json())
//       .then(data => setBookings(data.bookings || []))
//       .catch(() => setBookings([]))
//       .finally(() => setLoading(false));
//   }, []);

//   // Group bookings by day & bookedBy (only)
//   useEffect(() => {
//     const group = {};
//     bookings.forEach(b => {
//       const dateStr = moment(b.createdAt).format('YYYY-MM-DD');
//       if (!group[dateStr]) group[dateStr] = {};
//       const bookedBy = b.bookBy || 'Unknown';
//       if (!group[dateStr][bookedBy]) group[dateStr][bookedBy] = {
//         bookedBy, // email or id
//         bookings: [],
//         totalAmount: 0,
//         totalCount: 0,
//         abhishekTypeMap: {},
//       };
//       group[dateStr][bookedBy].bookings.push(b);
//       group[dateStr][bookedBy].totalAmount += Number(b.amount || 0);
//       group[dateStr][bookedBy].totalCount += 1;
//       const abhiType = b.abhishek_type || 'Other';
//       if (!group[dateStr][bookedBy].abhishekTypeMap[abhiType])
//         group[dateStr][bookedBy].abhishekTypeMap[abhiType] = 0;
//       group[dateStr][bookedBy].abhishekTypeMap[abhiType] += 1;
//     });
//     setGroupedData(group);
//     setFilteredDays(Object.keys(group).sort((a, b) => b.localeCompare(a)));
//     setCurrentPage(1);
//   }, [bookings]);

//   // Search filter
//   const getFilteredDays = () => {
//     if (!search.trim()) return filteredDays;
//     const q = search.toLowerCase();
//     return filteredDays.filter(day =>
//       Object.values(groupedData[day]).some(user =>
//         (user.bookedBy || '').toLowerCase().includes(q) ||
//         Object.keys(user.abhishekTypeMap).some(type => type.toLowerCase().includes(q)) ||
//         day.includes(q)
//       )
//     );
//   };

//   // Pagination logic
//   const allFilteredDays = getFilteredDays();
//   const totalPages = Math.ceil(allFilteredDays.length / DAYS_PER_PAGE);
//   const paginatedDays = allFilteredDays.slice(
//     (currentPage - 1) * DAYS_PER_PAGE,
//     currentPage * DAYS_PER_PAGE
//   );

//   // Bar chart: bookings per bookedBy (on paginated days)
//   const userBookingsData = (() => {
//     // { bookedBy: string, totalBookings: number, totalAmount: number }
//     const map = {};
//     paginatedDays.forEach(day => {
//       Object.values(groupedData[day] || {}).forEach(user => {
//         const key = user.bookedBy.slice(0,6) || 'Unknown';
//         if (!map[key]) map[key] = { bookedBy: key, totalBookings: 0, totalAmount: 0 };
//         map[key].totalBookings += user.totalCount;
//         map[key].totalAmount += user.totalAmount;
//       });
//     });
//     return Object.values(map).sort((a, b) => b.totalBookings - a.totalBookings);
//   })();

//   // Bar chart: bookings per day
//   const dayBookingsData = paginatedDays.map(day => ({
//     day: moment(day).format('DD MMM'),
//     totalBookings: Object.values(groupedData[day] || {}).reduce((sum, u) => sum + u.totalCount, 0),
//     totalAmount: Object.values(groupedData[day] || {}).reduce((sum, u) => sum + u.totalAmount, 0)
//   }));

//   // Improved PDF download for a single day
//   const downloadPDF = (day) => {
//     const doc = new jsPDF('landscape');

//     // Header Bar
//     doc.setFillColor(79, 70, 229); // Primary color
//     doc.rect(0, 0, doc.internal.pageSize.width, 24, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(22);
//     doc.text('Userwise Booking Report', doc.internal.pageSize.width / 2, 16, { align: 'center' });

//     // Subtitle
//     doc.setFontSize(13);
//     doc.setTextColor(60,60,60);
//     doc.text(`Date: ${moment(day).format('DD MMM YYYY')}`, 14, 32);
//     doc.text(`Generated: ${moment().format('DD MMM YYYY, HH:mm')}`, 14, 40);

//     // Table data
//     const tableRows = [];
//     let grandTotalAmount = 0;
//     let grandTotalCount = 0;

//     Object.values(groupedData[day]).forEach((user, idx) => {
//       const abhishekDetails = Object.entries(user.abhishekTypeMap)
//         .map(([type, cnt]) => `${type} (${cnt})`)
//         .join(", ");
//       tableRows.push([
//         idx + 1,
//         user.bookedBy,
//         user.totalCount,
//         abhishekDetails,
//         `${user.totalAmount.toLocaleString()}`,
//       ]);
//       grandTotalAmount += user.totalAmount;
//       grandTotalCount += user.totalCount;
//     });

//     // Main table
//     autoTable(doc, {
//       head: [[
//         '#',
//         'Booked By (Email)',
//         'Total Bookings',
//         'Abhishek Types (Count)',
//         'Total Amount'
//       ]],
//       body: tableRows,
//       startY: 48,
//       theme: 'grid',
//       headStyles: {
//         fillColor: [79, 70, 229],
//         textColor: [255,255,255],
//         fontStyle: 'bold',
//         halign: 'center',
//         fontSize: 12,
//       },
//       bodyStyles: {
//         fontSize: 11,
//         halign: 'center'
//       },
//       columnStyles: {
//         0: { cellWidth: 15, halign: 'center' },
//         1: { cellWidth: 60, halign: 'left' },
//         2: { cellWidth: 35, halign: 'center' },
//         3: { cellWidth: 70, halign: 'left' },
//         4: { cellWidth: 35, halign: 'left', fontStyle: 'bold' },
//       },
//     });

//     // Grand total row with highlight
//     autoTable(doc, {
//       body: [[
//         '',
//         { content: 'Grand Total', styles: { halign: 'right', fontStyle: 'bold', fillColor: [245, 245, 220] } },
//         { content: grandTotalCount, styles: { fontStyle: 'bold', textColor: [34,197,94] } },
//         '',
//         { content: `Total Amount - ${grandTotalAmount.toLocaleString()}`, styles: { fontStyle: 'bold', textColor: [34,197,94], halign: 'right', fillColor: [245, 245, 220] } }
//       ]],
//       startY: doc.lastAutoTable.finalY + 4,
//       theme: 'plain',
//       styles: { fontSize: 13 },
//       tableLineWidth: 0,
//     });

//     // Footer
//     const pageHeight = doc.internal.pageSize.height;
//     doc.setFontSize(10);
//     doc.setTextColor(140,140,140);
//     doc.text(
//       `Generated by Mangal Grah Seva Sanstha | Page 1`,
//       doc.internal.pageSize.width / 2,
//       pageHeight - 8,
//       { align: 'center' }
//     );

//     doc.save(`Userwise-Booking-Report-${day}.pdf`);
//   };

//   // Pagination controls
//     const handlePageChange = (direction) => {
//         if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
//         if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
//     };

//   return (
//     <div className="container py-4">
//       <div className="card shadow mb-4">
//         <div className="card-body row g-3 align-items-center justify-content-between">
//           <div className="col-auto flex-grow-1">
//             <h2 className="text-primary fw-bold mb-0">
//               <span role="img" aria-label="users">👥</span> Userwise Booking Daywise Report
//             </h2>
//           </div>
//           <div className="col-auto" style={{ minWidth: 300 }}>
//             <input
//               className="form-control"
//               type="search"
//               placeholder="Search bookedBy, abhishek, date..."
//               value={search}
//               onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
//               style={{ maxWidth: 320 }}
//             />
//           </div>
//         </div>
//       </div>
//       {loading && (
//         <div className="alert alert-info text-center my-4">
//           <span className="spinner-border spinner-border-sm me-2"></span>
//           Loading...
//         </div>
//       )}

//       {/* CHARTS */}
//       {!loading && paginatedDays.length > 0 && (
//         <div className="row g-4 mb-4">
//           <div className="col-md-6">
//             <div className="card h-100 shadow-sm">
//               <div className="card-header fw-bold text-primary bg-light">📊 Bookings By Users</div>
//               <div className="card-body">
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart
//                     data={userBookingsData}
//                     layout="vertical"
//                     margin={{ top: 8, right: 24, bottom: 8 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis dataKey="bookedBy" type="category" width={90} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="totalBookings" fill="#4F46E5" name="Total Bookings">
//                       <LabelList dataKey="totalBookings" position="right" />
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="card h-100 shadow-sm">
//               <div className="card-header fw-bold text-success bg-light">📅 Bookings By Day</div>
//               <div className="card-body">
//                 <ResponsiveContainer className="charts_font" width="100%" height={400}>
//                   <BarChart
//                     data={dayBookingsData}
//                     margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="day" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="totalBookings" fill="#28A745" name="Total Bookings">
//                       <LabelList dataKey="totalBookings" position="top" />
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {!loading && paginatedDays.length === 0 && (
//         <div className="alert alert-info text-center my-4">
//           No data found.
//         </div>
//       )}

//       {paginatedDays.map(day => (
//         <div className="card shadow mb-4" key={day}>
//           <div
//             className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-light"
//             style={{ top: 70, zIndex: 5 }}
//           >
//             <div>
//               <strong>Date:</strong> {moment(day).format('DD MMM YYYY')}
//             </div>
//             <button className="btn btn-outline-success mt-2 mt-md-0" onClick={() => downloadPDF(day)}>
//               <span role="img" aria-label="download">📥</span> Download PDF
//             </button>
//           </div>
//           <div className="card-body p-0 table-responsive">
//             <table className="table table-striped table-bordered mb-0">
//               <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                 <tr>
//                   <th style={{ minWidth: 36 }}>#</th>
//                   <th style={{ minWidth: 130 }}>Booked By (Email)</th>
//                   <th style={{ minWidth: 75 }}>Total Bookings</th>
//                   <th style={{ minWidth: 160 }}>Abhishek Type (Count)</th>
//                   <th style={{ minWidth: 110 }}>Total Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.values(groupedData[day]).map((user, idx) => (
//                   <tr key={user.bookedBy + day}>
//                     <td>{idx + 1}</td>
//                     <td className="text-break">{user.bookedBy}</td>
//                     <td>{user.totalCount}</td>
//                     <td>
//                       {Object.entries(user.abhishekTypeMap)
//                         .map(([type, cnt]) => (
//                           <span key={type} className="badge bg-primary me-1 mb-1" style={{ fontSize: '90%' }}>
//                             {type} ({cnt})
//                           </span>
//                         ))}
//                     </td>
//                     <td>₹{user.totalAmount.toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <th colSpan={2} className="text-end">Grand Total</th>
//                   <th>
//                     {
//                       Object.values(groupedData[day])
//                         .reduce((sum, user) => sum + user.totalCount, 0)
//                     }
//                   </th>
//                   <th />
//                   <th>
//                     ₹{Object.values(groupedData[day])
//                         .reduce((sum, user) => sum + user.totalAmount, 0)
//                       .toLocaleString()}
//                   </th>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       ))}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <nav className="d-flex justify-content-center my-4">
//           <ul className="pagination pagination-lg mb-0">
//             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//               <button className="page-link" onClick={() => handlePageChange('prev')}>
//                 ← Prev
//               </button>
//             </li>
//             <li className="page-item disabled">
//               <span className="page-link bg-white text-primary" style={{ fontWeight: 600 }}>
//                 Page {currentPage} of {totalPages}
//               </span>
//             </li>
//             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//               <button className="page-link" onClick={() => handlePageChange('next')}>
//                 Next →
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </div>
//   );
// };

// export default UserwiseReport;




// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// import { config } from "../../utils/axiosconfig";
// import { base_booking_url2 } from "../../utils/base_url";


// const DAYS_PER_PAGE = 5;


// const UserwiseReport = () => {

//   const [report,setReport] = useState({});
//   const [loading,setLoading] = useState(false);
//   const [search,setSearch] = useState("");
//   const [page,setPage] = useState(1);


//   const getReport = async()=>{

//     try{

//       setLoading(true);

//       const res = await axios.get(
//         `${base_booking_url2}booking/userReport`,
//         config
//       );

//       setReport(res.data);

//     }catch(error){

//       setReport({});

//     }finally{

//       setLoading(false);

//     }

//   };


//   useEffect(()=>{

//     getReport();

//   },[]);



//   const days = report.days || [];



//   const filteredDays = days.filter(item=>{

//     if(!search) return true;

//     const value = search.toLowerCase();


//     return (
//       item.date.includes(value) ||
//       item.users.some(user=>
//         user.bookedBy
//         .toLowerCase()
//         .includes(value)
//       )
//     );

//   });



//   const totalPages = Math.ceil(
//     filteredDays.length / DAYS_PER_PAGE
//   );


//   const currentDays = filteredDays.slice(
//     (page-1)*DAYS_PER_PAGE,
//     page*DAYS_PER_PAGE
//   );



//   const downloadPDF = (day)=>{

//     const pdf = new jsPDF("landscape");


//     pdf.setFontSize(20);

//     pdf.text(
//       "Userwise Booking Report",
//       140,
//       15,
//       {
//         align:"center"
//       }
//     );


//     pdf.setFontSize(12);

//     pdf.text(
//       `Date : ${moment(day.date)
//       .format("DD MMM YYYY")}`,
//       15,
//       28
//     );



//     const rows = day.users.map(
//       (user,index)=>[

//         index+1,

//         user.bookedBy,

//         user.totalCount,

//         user.abhishekTypeMap
//         .map(
//           x=>`${x.type} (${x.count})`
//         )
//         .join(","),

//         user.totalAmount

//       ]
//     );



//     autoTable(pdf,{

//       head:[[
//         "#",
//         "Booked By",
//         "Bookings",
//         "Abhishek Type",
//         "Amount"
//       ]],

//       body:rows,

//       startY:40

//     });



//     pdf.save(
//       `Userwise-${day.date}.pdf`
//     );

//   };



//   const userChart =
//     report.chart?.userWise || [];


//   const dayChart =
//     report.chart?.dayWise || [];
//   return (
//     <div className="container py-4">

//       <div className="card shadow mb-4">
//         <div className="card-body d-flex justify-content-between align-items-center">
//           <h2 className="text-primary fw-bold mb-0">👥 Userwise Booking Report</h2>
//           <input className="form-control w-25" placeholder="Search user/date..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} />
//         </div>
//       </div>


//       {loading && <div className="alert alert-info text-center">Loading...</div>}


//       <div className="row mb-4">

//         <div className="col-md-3">
//           <div className="card shadow text-center p-3">
//             <h6>Total Bookings</h6>
//             <h3 className="text-primary">{report.summary?.totalBookings || 0}</h3>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow text-center p-3">
//             <h6>Total Amount</h6>
//             <h3 className="text-success">₹{report.summary?.totalAmount || 0}</h3>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow text-center p-3">
//             <h6>Total Users</h6>
//             <h3 className="text-warning">{report.summary?.totalUsers || 0}</h3>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow text-center p-3">
//             <h6>Total Days</h6>
//             <h3 className="text-danger">{report.summary?.totalDays || 0}</h3>
//           </div>
//         </div>

//       </div>



//       <div className="row mb-4">

//         <div className="col-md-6">
//           <div className="card shadow">
//             <div className="card-header bg-light text-primary fw-bold">
//               📊 User Wise Booking
//             </div>
//             <div className="card-body">

//               <ResponsiveContainer width="100%" height={350}>
//                 <BarChart data={userChart} layout="vertical">
//                   <CartesianGrid strokeDasharray="3 3"/>
//                   <XAxis type="number"/>
//                   <YAxis dataKey="bookedBy" type="category" width={100}/>
//                   <Tooltip/>
//                   <Legend/>
//                   <Bar dataKey="totalBookings" fill="#4F46E5">
//                     <LabelList dataKey="totalBookings" position="right"/>
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>

//             </div>
//           </div>
//         </div>


//         <div className="col-md-6">
//           <div className="card shadow">
//             <div className="card-header bg-light text-success fw-bold">
//               📅 Day Wise Booking
//             </div>

//             <div className="card-body">

//               <ResponsiveContainer width="100%" height={350}>
//                 <BarChart data={dayChart}>
//                   <CartesianGrid strokeDasharray="3 3"/>
//                   <XAxis dataKey="day"/>
//                   <YAxis/>
//                   <Tooltip/>
//                   <Legend/>
//                   <Bar dataKey="totalBookings" fill="#28A745">
//                     <LabelList dataKey="totalBookings" position="top"/>
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>

//             </div>

//           </div>
//         </div>

//       </div>




//       {currentDays.map(day=>(

//         <div className="card shadow mb-4" key={day.date}>

//           <div className="card-header d-flex justify-content-between align-items-center bg-light">

//             <strong>
//               Date: {moment(day.date).format("DD MMM YYYY")}
//             </strong>

//             <button className="btn btn-outline-success btn-sm" onClick={()=>downloadPDF(day)}>
//               📥 PDF
//             </button>

//           </div>


//           <div className="table-responsive">

//             <table className="table table-bordered table-striped mb-0">

//               <thead className="table-dark">

//                 <tr>
//                   <th>#</th>
//                   <th>Booked By</th>
//                   <th>Total Booking</th>
//                   <th>Abhishek Type</th>
//                   <th>Amount</th>
//                 </tr>

//               </thead>


//               <tbody>

//                 {day.users.map((user,index)=>(

//                   <tr key={user.bookedBy}>

//                     <td>{index+1}</td>

//                     <td>{user.bookedBy}</td>

//                     <td>{user.totalCount}</td>

//                     <td>
//                       {user.abhishekTypeMap.map(item=>(

//                         <span className="badge bg-primary me-1" key={item.type}>
//                           {item.type} ({item.count})
//                         </span>

//                       ))}
//                     </td>

//                     <td>₹{user.totalAmount}</td>

//                   </tr>

//                 ))}

//               </tbody>


//               <tfoot>

//                 <tr>

//                   <th colSpan="2" className="text-end">
//                     Grand Total
//                   </th>

//                   <th>
//                     {day.grandTotal.count}
//                   </th>

//                   <th></th>

//                   <th>
//                     ₹{day.grandTotal.amount}
//                   </th>

//                 </tr>

//               </tfoot>

//             </table>

//           </div>

//         </div>

//       ))}




//       {totalPages > 1 && (

//         <nav>

//           <ul className="pagination justify-content-center">

//             <li className={`page-item ${page===1?"disabled":""}`}>
//               <button className="page-link" onClick={()=>setPage(page-1)}>
//                 Prev
//               </button>
//             </li>


//             <li className="page-item disabled">
//               <span className="page-link">
//                 {page} / {totalPages}
//               </span>
//             </li>


//             <li className={`page-item ${page===totalPages?"disabled":""}`}>
//               <button className="page-link" onClick={()=>setPage(page+1)}>
//                 Next
//               </button>
//             </li>

//           </ul>

//         </nav>

//       )}

//     </div>
//   );
// };


// export default UserwiseReport;




import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import { config } from "../../utils/axiosconfig";
import { base_booking_url2 } from "../../utils/base_url";


const DAYS_PER_PAGE = 5;


const UserwiseReport = () => {

  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);


  const getReport = async () => {

    try {

      setLoading(true);
      setError(false);

      const res = await axios.get(
        `${base_booking_url2}booking/userReport`,
        config
      );

      setReport(res.data);

    } catch (error) {

      setReport({});
      setError(true);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    getReport();

  }, []);



  const days = report.days || [];



  const filteredDays = days.filter(item => {

    if (!search) return true;

    const value = search.toLowerCase();


    return (
      item.date.includes(value) ||
      item.users.some(user =>
        user.bookedBy
          .toLowerCase()
          .includes(value)
      )
    );

  });



  const totalPages = Math.ceil(
    filteredDays.length / DAYS_PER_PAGE
  );


  const currentDays = filteredDays.slice(
    (page - 1) * DAYS_PER_PAGE,
    page * DAYS_PER_PAGE
  );



  const downloadPDF = (day) => {

    const pdf = new jsPDF("landscape");


    pdf.setFontSize(20);

    pdf.text(
      "Userwise Booking Report",
      140,
      15,
      {
        align: "center"
      }
    );


    pdf.setFontSize(12);

    pdf.text(
      `Date : ${moment(day.date)
        .format("DD MMM YYYY")}`,
      15,
      28
    );



    const rows = day.users.map(
      (user, index) => [

        index + 1,

        user.bookedBy,

        user.totalCount,

        user.abhishekTypeMap
          .map(
            x => `${x.type} (${x.count})`
          )
          .join(","),

        user.totalAmount

      ]
    );



    autoTable(pdf, {

      head: [[
        "#",
        "Booked By",
        "Bookings",
        "Abhishek Type",
        "Amount"
      ]],

      body: rows,

      startY: 40

    });



    pdf.save(
      `Userwise-${day.date}.pdf`
    );

  };



  const userChart =
    report.chart?.userWise || [];


  const dayChart =
    report.chart?.dayWise || [];


  const hasReport = days.length > 0;


  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">👥 Userwise Booking Report</h2>
              <p className="text-muted mb-0">
                Track bookings, revenue and activity by user and day
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <input
                className="form-control"
                style={{ minWidth: 220 }}
                placeholder="Search user or date..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              <button
                className="btn btn-outline-primary"
                onClick={getReport}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="fa fa-rotate-right me-2"></i>
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap mb-4">
          <span>⚠️ Could not load the report. Please try again.</span>
          <button className="btn btn-sm btn-outline-danger" onClick={getReport}>
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mb-0">Fetching report data...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !hasReport && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body text-center py-5">
            <h5 className="mb-2">No bookings found</h5>
            <p className="text-muted mb-0">
              There is no report data available yet.
            </p>
          </div>
        </div>
      )}

      {!loading && hasReport && (
        <>
          {/* Summary cards */}
          <div className="row g-3 mb-4">

            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Bookings</h6>
                    <h3 className="text-primary fw-bold mb-0">
                      {report.summary?.totalBookings || 0}
                    </h3>
                  </div>
                  <span className="fs-2">📖</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Amount</h6>
                    <h3 className="text-success fw-bold mb-0">
                      ₹{report.summary?.totalAmount || 0}
                    </h3>
                  </div>
                  <span className="fs-2">💰</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Users</h6>
                    <h3 className="text-warning fw-bold mb-0">
                      {report.summary?.totalUsers || 0}
                    </h3>
                  </div>
                  <span className="fs-2">🧑‍🤝‍🧑</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Days</h6>
                    <h3 className="text-danger fw-bold mb-0">
                      {report.summary?.totalDays || 0}
                    </h3>
                  </div>
                  <span className="fs-2">📅</span>
                </div>
              </div>
            </div>

          </div>

          {/* Charts */}
          <div className="row g-3 mb-4">

            <div className="col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-primary">📊 User Wise Booking</span>
                  <span className="badge bg-primary-subtle text-primary">
                    {userChart.length} users
                  </span>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={userChart} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="bookedBy" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalBookings" fill="#4F46E5">
                        <LabelList dataKey="totalBookings" position="right" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-success">📅 Day Wise Booking</span>
                  <span className="badge bg-success-subtle text-success">
                    {dayChart.length} days
                  </span>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dayChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalBookings" fill="#28A745">
                        <LabelList dataKey="totalBookings" position="top" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* No search results */}
          {filteredDays.length === 0 && (
            <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap">
              <span>No results match "{search}"</span>
              <button className="btn btn-sm btn-outline-warning" onClick={() => setSearch("")}>
                Clear search
              </button>
            </div>
          )}

          {/* Day-wise tables */}
          {currentDays.map(day => (

            <div className="card shadow-sm border-0 mb-4" key={day.date}>

              <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                <strong>
                  📆 {moment(day.date).format("DD MMM YYYY")}
                </strong>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-secondary-subtle text-secondary">
                    {day.users.length} users
                  </span>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => downloadPDF(day)}
                  >
                    📥 Download PDF
                  </button>
                </div>
              </div>

              <div className="table-responsive">

                <table className="table table-bordered table-striped table-hover align-middle mb-0">

                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: 50 }}>#</th>
                      <th>Booked By</th>
                      <th>Total Booking</th>
                      <th>Abhishek Type</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {day.users.map((user, index) => (
                      <tr key={user.bookedBy}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{user.bookedBy}</td>
                        <td>{user.totalCount}</td>
                        <td>
                          {user.abhishekTypeMap.map(item => (
                            <span className="badge bg-primary-subtle text-primary me-1 mb-1" key={item.type}>
                              {item.type} ({item.count})
                            </span>
                          ))}
                        </td>
                        <td className="text-end fw-semibold">₹{user.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="table-light">
                      <th colSpan="2" className="text-end">
                        Grand Total
                      </th>
                      <th>{day.grandTotal.count}</th>
                      <th></th>
                      <th className="text-end">₹{day.grandTotal.amount}</th>
                    </tr>
                  </tfoot>

                </table>

              </div>

            </div>

          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-between align-items-center flex-wrap mt-4">

              <span className="text-muted small">
                Showing {currentDays.length} of {filteredDays.length} days
              </span>

              <ul className="pagination mb-0">

                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>
                    Prev
                  </button>
                </li>

                <li className="page-item disabled">
                  <span className="page-link">
                    {page} / {totalPages}
                  </span>
                </li>

                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    Next
                  </button>
                </li>

              </ul>

            </nav>
          )}
        </>
      )}

    </div>
  );
};


export default UserwiseReport;