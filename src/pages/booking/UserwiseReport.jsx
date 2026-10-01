
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