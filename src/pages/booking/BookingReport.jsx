
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
