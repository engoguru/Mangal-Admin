import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { base_booking_url2 } from "../../utils/base_url";

function ScannerMain() {
  const [scannerOpen, setScannerOpen] = useState(false);

  // URL which came from QR
  const [scannedUrl, setScannedUrl] = useState("");

  // Booking returned by API
  const [booking, setBooking] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  // Error message
  const [errorMessage, setErrorMessage] = useState("");

  const scannerRef = useRef(null);
  const scannedRef = useRef(false);


  // =========================================================
  // OPEN SCANNER
  // =========================================================

  const openScanner = () => {
    setScannedUrl("");
    setBooking(null);
    setErrorMessage("");

    scannedRef.current = false;

    setScannerOpen(true);
  };


  // =========================================================
  // START QR SCANNER
  // =========================================================

  useEffect(() => {
    if (!scannerOpen) {
      return;
    }

    let scanner = null;
    let mounted = true;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode("qr-reader");

        scannerRef.current = scanner;
        scannedRef.current = false;

        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },

          // ===================================================
          // QR SCANNED
          // ===================================================

          async (decodedText) => {
            if (!mounted) {
              return;
            }

            if (scannedRef.current) {
              return;
            }

            scannedRef.current = true;

            console.log("--------------------------------");
            console.log("QR SCANNED");
            console.log(decodedText);
            console.log("--------------------------------");

            // Stop camera
            try {
              if (scanner) {
                await scanner.stop();
              }
            } catch (error) {
              console.log("Scanner stop error:", error);
            }

            scannerRef.current = null;

            // Save QR URL
            setScannedUrl(decodedText);

            // Close camera
            setScannerOpen(false);

            // Automatically load booking
            loadBooking(decodedText);
          },

          // Scanner continuously reports scan errors.
          // We don't need to show them.
          () => {}
        );
      } catch (error) {
        console.error("CAMERA ERROR:", error);

        if (!mounted) {
          return;
        }

        alert(
          "Unable to open camera.\n\nPlease allow camera permission and try again."
        );

        scannerRef.current = null;
        setScannerOpen(false);
      }
    };

    startScanner();

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      mounted = false;

      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((error) => {
            console.log("Scanner cleanup error:", error);
          });

        scannerRef.current = null;
      }
    };
  }, [scannerOpen]);


  // =========================================================
  // GET VERIFY URL
  // =========================================================
  //
  // QR example:
  //
  // https://your-domain.com/qr/verify/abhisheks/64abc123...
  //
  // We need:
  //
  // type = abhisheks
  // id   = 64abc123...
  //
  // =========================================================

  const getVerifyUrl = (qrUrl) => {
    try {
      const url = new URL(qrUrl);

      const parts = url.pathname
        .split("/")
        .filter(Boolean);

      const verifyIndex = parts.indexOf("verify");

      if (
        verifyIndex === -1 ||
        !parts[verifyIndex + 1] ||
        !parts[verifyIndex + 2]
      ) {
        return null;
      }

      const type = parts[verifyIndex + 1];
      const id = parts[verifyIndex + 2];

      return {
        type,
        id,
      };
    } catch (error) {
      console.error("QR URL PARSE ERROR:", error);

      return null;
    }
  };


  // =========================================================
  // LOAD BOOKING
  // =========================================================

  const loadBooking = async (qrUrl = scannedUrl) => {
    if (!qrUrl) {
      setErrorMessage("No QR code was scanned.");
      return;
    }

    const qrData = getVerifyUrl(qrUrl);

    if (!qrData) {
      setErrorMessage(
        "Invalid QR code. The QR must contain /qr/verify/:type/:id"
      );

      return;
    }

    const { type, id } = qrData;

    try {
      setLoading(true);
      setBooking(null);
      setErrorMessage("");

      // Use your API base URL.
      //
      // Example:
      // base_booking_url2 = https://example.com/api
      //
      const apiUrl = `${base_booking_url2}/qr/verify/${encodeURIComponent(
        type
      )}/${encodeURIComponent(id)}`;

      console.log("--------------------------------");
      console.log("VERIFY BOOKING");
      console.log("TYPE:", type);
      console.log("ID:", id);
      console.log("API URL:", apiUrl);
      console.log("--------------------------------");

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("VERIFY STATUS:", response.status);

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      console.log("VERIFY RESPONSE:", result);

      if (!response.ok || !result.success) {
        setErrorMessage(
          result?.message || "Unable to find this booking."
        );

        setBooking(null);

        return;
      }

      // Save returned booking
      setBooking({
        ...result.data,

        // Keep these so update can use them
        qrType: type,
        qrId: id,
      });
    } catch (error) {
      console.error("VERIFY ERROR:", error);

      setErrorMessage(
        error?.message || "Unable to load booking."
      );

      setBooking(null);
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // CHECK IN / UPDATE BOOKING
  // =========================================================
  //
  // PATCH:
  //
  // /qr/verify/:type/:id
  //
  // Backend changes:
  //
  // pending -> completed
  //
  // =========================================================

  const updateBooking = async () => {
    if (!booking) {
      return;
    }

    const type = booking.qrType;
    const id = booking.qrId;

    if (!type || !id) {
      setErrorMessage(
        "Booking information is incomplete."
      );

      return;
    }

    // Don't allow update if already completed
    if (booking.status === "completed") {
      return;
    }

    // Don't allow cancelled booking
    if (booking.status === "cancelled") {
      setErrorMessage(
        "This booking is cancelled."
      );

      return;
    }

    try {
      setCheckingIn(true);
      setErrorMessage("");

      const apiUrl = `${base_booking_url2}/qr/verify/${encodeURIComponent(
        type
      )}/${encodeURIComponent(id)}`;

      console.log("--------------------------------");
      console.log("CHECK-IN BOOKING");
      console.log("TYPE:", type);
      console.log("ID:", id);
      console.log("API URL:", apiUrl);
      console.log("--------------------------------");

      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log(
        "CHECK-IN STATUS:",
        response.status
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "CHECK-IN RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        setErrorMessage(
          result?.message ||
            "Unable to update booking."
        );

        return;
      }

      // Update booking immediately
      setBooking((previous) => ({
        ...previous,
        ...(result.data || {}),
        status:
          result?.data?.status || "completed",
      }));

    } catch (error) {
      console.error(
        "CHECK-IN ERROR:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to update booking."
      );
    } finally {
      setCheckingIn(false);
    }
  };


  // =========================================================
  // CLOSE SCANNER
  // =========================================================

  const closeScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.log(
          "Scanner close error:",
          error
        );
      }

      scannerRef.current = null;
    }

    scannedRef.current = false;

    setScannerOpen(false);
  };


  // =========================================================
  // SCAN AGAIN
  // =========================================================

  const scanAgain = () => {
    setScannedUrl("");
    setBooking(null);
    setErrorMessage("");

    scannedRef.current = false;

    setScannerOpen(true);
  };


  // =========================================================
  // STATUS BADGE
  // =========================================================

  const renderStatusBadge = () => {
    if (!booking?.status) {
      return null;
    }

    if (booking.status === "pending") {
      return (
        <span className="badge bg-warning text-dark">
          Pending
        </span>
      );
    }

    if (booking.status === "completed") {
      return (
        <span className="badge bg-success">
          Completed
        </span>
      );
    }

    if (booking.status === "cancelled") {
      return (
        <span className="badge bg-danger">
          Cancelled
        </span>
      );
    }

    return (
      <span className="badge bg-secondary">
        {booking.status}
      </span>
    );
  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="container-fluid">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="card shadow-sm border-0 mb-4"
        style={{
          borderTop: "4px solid #fd7e14",
        }}
      >
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <div>
              <span className="badge bg-warning-subtle text-warning-emphasis mb-2">
                Gate Check-in
              </span>

              <h3 className="mb-1">
                🎟️ Ticket Scanner
              </h3>

              <p className="text-muted mb-0">
                Scan visitor QR to verify booking
              </p>
            </div>

            <button
              type="button"
              className="btn btn-dark btn-lg"
              onClick={openScanner}
              disabled={
                scannerOpen ||
                loading ||
                checkingIn
              }
            >
              <i className="fa fa-qrcode me-2"></i>

              Scan Ticket
            </button>

          </div>

        </div>
      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {errorMessage && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <div>
            <i className="fa fa-exclamation-circle me-2"></i>

            {errorMessage}
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={() =>
              setErrorMessage("")
            }
          ></button>
        </div>
      )}


      {/* =====================================================
          SCANNER
      ====================================================== */}

      {scannerOpen && (
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <div>
                <h5 className="mb-1">
                  Scan QR Code
                </h5>

                <small className="text-muted">
                  Point the camera at the visitor QR code
                </small>
              </div>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={closeScanner}
              >
                Close
              </button>

            </div>

            <div
              id="qr-reader"
              style={{
                width: "100%",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            />

          </div>
        </div>
      )}


      {/* =====================================================
          LOADING BOOKING
      ====================================================== */}

      {loading && !scannerOpen && (
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body text-center py-5">

            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>

            <h5>
              Loading booking...
            </h5>

            <p className="text-muted mb-0">
              Please wait while we verify the QR code.
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          SCANNED URL
      ====================================================== */}

      {scannedUrl && !scannerOpen && !loading && (
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h5 className="mb-0">
                QR Scanned
              </h5>

              <span className="badge bg-success">
                Valid QR
              </span>

            </div>

            <div className="border rounded p-3 bg-light">

              <div className="small text-muted mb-2">
                Scanned URL
              </div>

              <div
                style={{
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  fontSize: "14px",
                }}
              >
                {scannedUrl}
              </div>

            </div>

          </div>
        </div>
      )}


      {/* =====================================================
          BOOKING DETAILS
      ====================================================== */}

      {booking && !loading && (
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

              <div>
                <h4 className="mb-1">
                  Booking Details
                </h4>

                <p className="text-muted mb-0">
                  Verify visitor information before check-in.
                </p>
              </div>

              <div>
                {renderStatusBadge()}
              </div>

            </div>


            {/* =================================================
                VISITOR INFORMATION
            ================================================== */}

            <div className="row g-3">

              {/* NAME */}

              <div className="col-md-6">
                <div className="border rounded p-3 h-100">

                  <div className="text-muted small">
                    Visitor Name
                  </div>

                  <div className="fw-semibold fs-5">
                    {booking.name || "-"}
                  </div>

                </div>
              </div>


              {/* MOBILE */}

              {booking.mobile_no && (
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">

                    <div className="text-muted small">
                      Mobile Number
                    </div>

                    <div className="fw-semibold">
                      {booking.mobile_no}
                    </div>

                  </div>
                </div>
              )}


              {/* PHONE */}

              {booking.phone && (
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">

                    <div className="text-muted small">
                      Phone Number
                    </div>

                    <div className="fw-semibold">
                      {booking.phone}
                    </div>

                  </div>
                </div>
              )}


              {/* EMAIL */}

              {booking.email && (
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">

                    <div className="text-muted small">
                      Email
                    </div>

                    <div className="fw-semibold">
                      {booking.email}
                    </div>

                  </div>
                </div>
              )}


              {/* BOOKING TYPE */}

              <div className="col-md-6">
                <div className="border rounded p-3 h-100">

                  <div className="text-muted small">
                    Abhishek Type
                  </div>

                  <div className="fw-semibold">
                    {booking.type || "-"}
                  </div>

                </div>
              </div>


              {/* RECEIPT */}

              <div className="col-md-6">
                <div className="border rounded p-3 h-100">

                  <div className="text-muted small">
                    Receipt Number
                  </div>

                  <div className="fw-semibold">
                    {booking.receipt || "-"}
                  </div>

                </div>
              </div>


              {/* SERIAL */}

              <div className="col-md-6">
                <div className="border rounded p-3 h-100">

                  <div className="text-muted small">
                    Serial Number
                  </div>

                  <div className="fw-semibold">
                    {booking.serial ?? "-"}
                  </div>

                </div>
              </div>


              {/* DATE */}

              {booking.date && (
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">

                    <div className="text-muted small">
                      Date
                    </div>

                    <div className="fw-semibold">
                      {new Date(
                        booking.date
                      ).toLocaleDateString()}
                    </div>

                  </div>
                </div>
              )}


              {/* BATCH TIME */}

              {booking.batchTime && (
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">

                    <div className="text-muted small">
                      Batch Time
                    </div>

                    <div className="fw-semibold">
                      {booking.batchTime}
                    </div>

                  </div>
                </div>
              )}


              {/* HALL */}

              {booking.hall && (
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">

                    <div className="text-muted small">
                      Hall
                    </div>

                    <div className="fw-semibold">
                      {booking.hall}
                    </div>

                  </div>
                </div>
              )}


              {/* AMOUNT */}

              {booking.amount !== undefined && (
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">

                    <div className="text-muted small">
                      Amount
                    </div>

                    <div className="fw-semibold">
                      ₹{booking.amount}
                    </div>

                  </div>
                </div>
              )}

            </div>


            {/* =================================================
                CHECK-IN ACTION
            ================================================== */}

            <div className="border-top mt-4 pt-4">

              {booking.status === "pending" && (
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                  <div>
                    <h6 className="mb-1">
                      Ready for Check-in
                    </h6>

                    <small className="text-muted">
                      Confirm the visitor details and check them in.
                    </small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-success btn-lg"
                    onClick={updateBooking}
                    disabled={checkingIn}
                  >
                    {checkingIn ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>

                        Checking In...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-check-circle me-2"></i>

                        Update / Check In
                      </>
                    )}
                  </button>

                </div>
              )}


              {/* COMPLETED */}

              {booking.status === "completed" && (
                <div className="alert alert-success mb-0">

                  <div className="d-flex align-items-center">

                    <i className="fa fa-check-circle fs-4 me-3"></i>

                    <div>
                      <strong>
                        Booking already checked in.
                      </strong>

                      <div className="small mt-1">
                        This ticket cannot be checked in again.
                      </div>
                    </div>

                  </div>

                </div>
              )}


              {/* CANCELLED */}

              {booking.status === "cancelled" && (
                <div className="alert alert-danger mb-0">

                  <div className="d-flex align-items-center">

                    <i className="fa fa-times-circle fs-4 me-3"></i>

                    <div>
                      <strong>
                        Booking is cancelled.
                      </strong>

                      <div className="small mt-1">
                        This ticket cannot be checked in.
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>


            {/* =================================================
                SCAN AGAIN
            ================================================== */}

            <div className="mt-4">

              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={scanAgain}
                disabled={checkingIn}
              >
                <i className="fa fa-qrcode me-2"></i>

                Scan Another Ticket
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ScannerMain;
