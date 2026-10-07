// // import React, { useEffect, useRef, useState } from "react";
// // import { Html5Qrcode } from "html5-qrcode";
// // import { base_booking_url2 } from "../../utils/base_url";

// // function ScannerMain() {
// //   const [scannerOpen, setScannerOpen] = useState(false);

// //   // URL which came from QR
// //   const [scannedUrl, setScannedUrl] = useState("");

// //   // Booking returned by API
// //   const [booking, setBooking] = useState(null);

// //   // Loading states
// //   const [loading, setLoading] = useState(false);
// //   const [checkingIn, setCheckingIn] = useState(false);

// //   // Error message
// //   const [errorMessage, setErrorMessage] = useState("");

// //   const scannerRef = useRef(null);
// //   const scannedRef = useRef(false);


// //   // =========================================================
// //   // OPEN SCANNER
// //   // =========================================================

// //   const openScanner = () => {
// //     setScannedUrl("");
// //     setBooking(null);
// //     setErrorMessage("");

// //     scannedRef.current = false;

// //     setScannerOpen(true);
// //   };


// //   // =========================================================
// //   // START QR SCANNER
// //   // =========================================================

// //   useEffect(() => {
// //     if (!scannerOpen) {
// //       return;
// //     }

// //     let scanner = null;
// //     let mounted = true;

// //     const startScanner = async () => {
// //       try {
// //         scanner = new Html5Qrcode("qr-reader");

// //         scannerRef.current = scanner;
// //         scannedRef.current = false;

// //         await scanner.start(
// //           {
// //             facingMode: "environment",
// //           },
// //           {
// //             fps: 10,
// //             qrbox: {
// //               width: 250,
// //               height: 250,
// //             },
// //           },

// //           // ===================================================
// //           // QR SCANNED
// //           // ===================================================

// //           async (decodedText) => {
// //             if (!mounted) {
// //               return;
// //             }

// //             if (scannedRef.current) {
// //               return;
// //             }

// //             scannedRef.current = true;

// //             console.log("--------------------------------");
// //             console.log("QR SCANNED");
// //             console.log(decodedText);
// //             console.log("--------------------------------");

// //             // Stop camera
// //             try {
// //               if (scanner) {
// //                 await scanner.stop();
// //               }
// //             } catch (error) {
// //               console.log("Scanner stop error:", error);
// //             }

// //             scannerRef.current = null;

// //             // Save QR URL
// //             setScannedUrl(decodedText);

// //             // Close camera
// //             setScannerOpen(false);

// //             // Automatically load booking
// //             loadBooking(decodedText);
// //           },

// //           // Scanner continuously reports scan errors.
// //           // We don't need to show them.
// //           () => {}
// //         );
// //       } catch (error) {
// //         console.error("CAMERA ERROR:", error);

// //         if (!mounted) {
// //           return;
// //         }

// //         alert(
// //           "Unable to open camera.\n\nPlease allow camera permission and try again."
// //         );

// //         scannerRef.current = null;
// //         setScannerOpen(false);
// //       }
// //     };

// //     startScanner();

// //     // =========================================================
// //     // CLEANUP
// //     // =========================================================

// //     return () => {
// //       mounted = false;

// //       if (scannerRef.current) {
// //         scannerRef.current
// //           .stop()
// //           .catch((error) => {
// //             console.log("Scanner cleanup error:", error);
// //           });

// //         scannerRef.current = null;
// //       }
// //     };
// //   }, [scannerOpen]);


// //   // =========================================================
// //   // GET VERIFY URL
// //   // =========================================================
// //   //
// //   // QR example:
// //   //
// //   // https://your-domain.com/qr/verify/abhisheks/64abc123...
// //   //
// //   // We need:
// //   //
// //   // type = abhisheks
// //   // id   = 64abc123...
// //   //
// //   // =========================================================

// //   const getVerifyUrl = (qrUrl) => {
// //     try {
// //       const url = new URL(qrUrl);

// //       const parts = url.pathname
// //         .split("/")
// //         .filter(Boolean);

// //       const verifyIndex = parts.indexOf("verify");

// //       if (
// //         verifyIndex === -1 ||
// //         !parts[verifyIndex + 1] ||
// //         !parts[verifyIndex + 2]
// //       ) {
// //         return null;
// //       }

// //       const type = parts[verifyIndex + 1];
// //       const id = parts[verifyIndex + 2];

// //       return {
// //         type,
// //         id,
// //       };
// //     } catch (error) {
// //       console.error("QR URL PARSE ERROR:", error);

// //       return null;
// //     }
// //   };


// //   // =========================================================
// //   // LOAD BOOKING
// //   // =========================================================

// //   const loadBooking = async (qrUrl = scannedUrl) => {
// //     if (!qrUrl) {
// //       setErrorMessage("No QR code was scanned.");
// //       return;
// //     }

// //     const qrData = getVerifyUrl(qrUrl);

// //     if (!qrData) {
// //       setErrorMessage(
// //         "Invalid QR code. The QR must contain /qr/verify/:type/:id"
// //       );

// //       return;
// //     }

// //     const { type, id } = qrData;

// //     try {
// //       setLoading(true);
// //       setBooking(null);
// //       setErrorMessage("");

// //       // Use your API base URL.
// //       //
// //       // Example:
// //       // base_booking_url2 = https://example.com/api
// //       //
// //       const apiUrl = `${base_booking_url2}/qr/verify/${encodeURIComponent(
// //         type
// //       )}/${encodeURIComponent(id)}`;

// //       console.log("--------------------------------");
// //       console.log("VERIFY BOOKING");
// //       console.log("TYPE:", type);
// //       console.log("ID:", id);
// //       console.log("API URL:", apiUrl);
// //       console.log("--------------------------------");

// //       const response = await fetch(apiUrl, {
// //         method: "GET",
// //         headers: {
// //           Accept: "application/json",
// //         },
// //       });

// //       console.log("VERIFY STATUS:", response.status);

// //       let result;

// //       try {
// //         result = await response.json();
// //       } catch {
// //         throw new Error("Server returned an invalid response.");
// //       }

// //       console.log("VERIFY RESPONSE:", result);

// //       if (!response.ok || !result.success) {
// //         setErrorMessage(
// //           result?.message || "Unable to find this booking."
// //         );

// //         setBooking(null);

// //         return;
// //       }

// //       // Save returned booking
// //       setBooking({
// //         ...result.data,

// //         // Keep these so update can use them
// //         qrType: type,
// //         qrId: id,
// //       });
// //     } catch (error) {
// //       console.error("VERIFY ERROR:", error);

// //       setErrorMessage(
// //         error?.message || "Unable to load booking."
// //       );

// //       setBooking(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };


// //   // =========================================================
// //   // CHECK IN / UPDATE BOOKING
// //   // =========================================================
// //   //
// //   // PATCH:
// //   //
// //   // /qr/verify/:type/:id
// //   //
// //   // Backend changes:
// //   //
// //   // pending -> completed
// //   //
// //   // =========================================================

// //   const updateBooking = async () => {
// //     if (!booking) {
// //       return;
// //     }

// //     const type = booking.qrType;
// //     const id = booking.qrId;

// //     if (!type || !id) {
// //       setErrorMessage(
// //         "Booking information is incomplete."
// //       );

// //       return;
// //     }

// //     // Don't allow update if already completed
// //     if (booking.status === "completed") {
// //       return;
// //     }

// //     // Don't allow cancelled booking
// //     if (booking.status === "cancelled") {
// //       setErrorMessage(
// //         "This booking is cancelled."
// //       );

// //       return;
// //     }

// //     try {
// //       setCheckingIn(true);
// //       setErrorMessage("");

// //       const apiUrl = `${base_booking_url2}/qr/verify/${encodeURIComponent(
// //         type
// //       )}/${encodeURIComponent(id)}`;

// //       console.log("--------------------------------");
// //       console.log("CHECK-IN BOOKING");
// //       console.log("TYPE:", type);
// //       console.log("ID:", id);
// //       console.log("API URL:", apiUrl);
// //       console.log("--------------------------------");

// //       const response = await fetch(apiUrl, {
// //         method: "PATCH",
// //         headers: {
// //           Accept: "application/json",
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       console.log(
// //         "CHECK-IN STATUS:",
// //         response.status
// //       );

// //       let result;

// //       try {
// //         result = await response.json();
// //       } catch {
// //         throw new Error(
// //           "Server returned an invalid response."
// //         );
// //       }

// //       console.log(
// //         "CHECK-IN RESPONSE:",
// //         result
// //       );

// //       if (!response.ok || !result.success) {
// //         setErrorMessage(
// //           result?.message ||
// //             "Unable to update booking."
// //         );

// //         return;
// //       }

// //       // Update booking immediately
// //       setBooking((previous) => ({
// //         ...previous,
// //         ...(result.data || {}),
// //         status:
// //           result?.data?.status || "completed",
// //       }));

// //     } catch (error) {
// //       console.error(
// //         "CHECK-IN ERROR:",
// //         error
// //       );

// //       setErrorMessage(
// //         error?.message ||
// //           "Unable to update booking."
// //       );
// //     } finally {
// //       setCheckingIn(false);
// //     }
// //   };


// //   // =========================================================
// //   // CLOSE SCANNER
// //   // =========================================================

// //   const closeScanner = async () => {
// //     if (scannerRef.current) {
// //       try {
// //         await scannerRef.current.stop();
// //       } catch (error) {
// //         console.log(
// //           "Scanner close error:",
// //           error
// //         );
// //       }

// //       scannerRef.current = null;
// //     }

// //     scannedRef.current = false;

// //     setScannerOpen(false);
// //   };


// //   // =========================================================
// //   // SCAN AGAIN
// //   // =========================================================

// //   const scanAgain = () => {
// //     setScannedUrl("");
// //     setBooking(null);
// //     setErrorMessage("");

// //     scannedRef.current = false;

// //     setScannerOpen(true);
// //   };


// //   // =========================================================
// //   // STATUS BADGE
// //   // =========================================================

// //   const renderStatusBadge = () => {
// //     if (!booking?.status) {
// //       return null;
// //     }

// //     if (booking.status === "pending") {
// //       return (
// //         <span className="badge bg-warning text-dark">
// //           Pending
// //         </span>
// //       );
// //     }

// //     if (booking.status === "completed") {
// //       return (
// //         <span className="badge bg-success">
// //           Completed
// //         </span>
// //       );
// //     }

// //     if (booking.status === "cancelled") {
// //       return (
// //         <span className="badge bg-danger">
// //           Cancelled
// //         </span>
// //       );
// //     }

// //     return (
// //       <span className="badge bg-secondary">
// //         {booking.status}
// //       </span>
// //     );
// //   };


// //   // =========================================================
// //   // RENDER
// //   // =========================================================

// //   return (
// //     <div className="container-fluid">

// //       {/* =====================================================
// //           HEADER
// //       ====================================================== */}

// //       <div
// //         className="card shadow-sm border-0 mb-4"
// //         style={{
// //           borderTop: "4px solid #fd7e14",
// //         }}
// //       >
// //         <div className="card-body">

// //           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

// //             <div>
// //               <span className="badge bg-warning-subtle text-warning-emphasis mb-2">
// //                 Gate Check-in
// //               </span>

// //               <h3 className="mb-1">
// //                 🎟️ Ticket Scanner
// //               </h3>

// //               <p className="text-muted mb-0">
// //                 Scan visitor QR to verify booking
// //               </p>
// //             </div>

// //             <button
// //               type="button"
// //               className="btn btn-dark btn-lg"
// //               onClick={openScanner}
// //               disabled={
// //                 scannerOpen ||
// //                 loading ||
// //                 checkingIn
// //               }
// //             >
// //               <i className="fa fa-qrcode me-2"></i>

// //               Scan Ticket
// //             </button>

// //           </div>

// //         </div>
// //       </div>


// //       {/* =====================================================
// //           ERROR
// //       ====================================================== */}

// //       {errorMessage && (
// //         <div
// //           className="alert alert-danger d-flex justify-content-between align-items-center"
// //           role="alert"
// //         >
// //           <div>
// //             <i className="fa fa-exclamation-circle me-2"></i>

// //             {errorMessage}
// //           </div>

// //           <button
// //             type="button"
// //             className="btn-close"
// //             onClick={() =>
// //               setErrorMessage("")
// //             }
// //           ></button>
// //         </div>
// //       )}


// //       {/* =====================================================
// //           SCANNER
// //       ====================================================== */}

// //       {scannerOpen && (
// //         <div className="card shadow-sm border-0 mb-4">

// //           <div className="card-body">

// //             <div className="d-flex justify-content-between align-items-center mb-3">

// //               <div>
// //                 <h5 className="mb-1">
// //                   Scan QR Code
// //                 </h5>

// //                 <small className="text-muted">
// //                   Point the camera at the visitor QR code
// //                 </small>
// //               </div>

// //               <button
// //                 type="button"
// //                 className="btn btn-outline-danger"
// //                 onClick={closeScanner}
// //               >
// //                 Close
// //               </button>

// //             </div>

// //             <div
// //               id="qr-reader"
// //               style={{
// //                 width: "100%",
// //                 maxWidth: "500px",
// //                 margin: "0 auto",
// //               }}
// //             />

// //           </div>
// //         </div>
// //       )}


// //       {/* =====================================================
// //           LOADING BOOKING
// //       ====================================================== */}

// //       {loading && !scannerOpen && (
// //         <div className="card shadow-sm border-0 mb-4">

// //           <div className="card-body text-center py-5">

// //             <div
// //               className="spinner-border text-primary mb-3"
// //               role="status"
// //             ></div>

// //             <h5>
// //               Loading booking...
// //             </h5>

// //             <p className="text-muted mb-0">
// //               Please wait while we verify the QR code.
// //             </p>

// //           </div>

// //         </div>
// //       )}


// //       {/* =====================================================
// //           SCANNED URL
// //       ====================================================== */}

// //       {scannedUrl && !scannerOpen && !loading && (
// //         <div className="card shadow-sm border-0 mb-4">

// //           <div className="card-body">

// //             <div className="d-flex justify-content-between align-items-center mb-3">

// //               <h5 className="mb-0">
// //                 QR Scanned
// //               </h5>

// //               <span className="badge bg-success">
// //                 Valid QR
// //               </span>

// //             </div>

// //             <div className="border rounded p-3 bg-light">

// //               <div className="small text-muted mb-2">
// //                 Scanned URL
// //               </div>

// //               <div
// //                 style={{
// //                   wordBreak: "break-all",
// //                   fontFamily: "monospace",
// //                   fontSize: "14px",
// //                 }}
// //               >
// //                 {scannedUrl}
// //               </div>

// //             </div>

// //           </div>
// //         </div>
// //       )}


// //       {/* =====================================================
// //           BOOKING DETAILS
// //       ====================================================== */}

// //       {booking && !loading && (
// //         <div className="card shadow-sm border-0 mb-4">

// //           <div className="card-body">

// //             {/* HEADER */}

// //             <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

// //               <div>
// //                 <h4 className="mb-1">
// //                   Booking Details
// //                 </h4>

// //                 <p className="text-muted mb-0">
// //                   Verify visitor information before check-in.
// //                 </p>
// //               </div>

// //               <div>
// //                 {renderStatusBadge()}
// //               </div>

// //             </div>


// //             {/* =================================================
// //                 VISITOR INFORMATION
// //             ================================================== */}

// //             <div className="row g-3">

// //               {/* NAME */}

// //               <div className="col-md-6">
// //                 <div className="border rounded p-3 h-100">

// //                   <div className="text-muted small">
// //                     Visitor Name
// //                   </div>

// //                   <div className="fw-semibold fs-5">
// //                     {booking.name || "-"}
// //                   </div>

// //                 </div>
// //               </div>


// //               {/* MOBILE */}

// //               {booking.mobile_no && (
// //                 <div className="col-md-6">
// //                   <div className="border rounded p-3 h-100">

// //                     <div className="text-muted small">
// //                       Mobile Number
// //                     </div>

// //                     <div className="fw-semibold">
// //                       {booking.mobile_no}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}


// //               {/* PHONE */}

// //               {booking.phone && (
// //                 <div className="col-md-6">
// //                   <div className="border rounded p-3 h-100">

// //                     <div className="text-muted small">
// //                       Phone Number
// //                     </div>

// //                     <div className="fw-semibold">
// //                       {booking.phone}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}


// //               {/* EMAIL */}

// //               {booking.email && (
// //                 <div className="col-md-6">
// //                   <div className="border rounded p-3 h-100">

// //                     <div className="text-muted small">
// //                       Email
// //                     </div>

// //                     <div className="fw-semibold">
// //                       {booking.email}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}


// //               {/* BOOKING TYPE */}

// //               <div className="col-md-6">
// //                 <div className="border rounded p-3 h-100">

// //                   <div className="text-muted small">
// //                     Abhishek Type
// //                   </div>

// //                   <div className="fw-semibold">
// //                     {booking.type || "-"}
// //                   </div>

// //                 </div>
// //               </div>


// //               {/* RECEIPT */}

// //               <div className="col-md-6">
// //                 <div className="border rounded p-3 h-100">

// //                   <div className="text-muted small">
// //                     Receipt Number
// //                   </div>

// //                   <div className="fw-semibold">
// //                     {booking.receipt || "-"}
// //                   </div>

// //                 </div>
// //               </div>


// //               {/* SERIAL */}

// //               <div className="col-md-6">
// //                 <div className="border rounded p-3 h-100">

// //                   <div className="text-muted small">
// //                     Serial Number
// //                   </div>

// //                   <div className="fw-semibold">
// //                     {booking.serial ?? "-"}
// //                   </div>

// //                 </div>
// //               </div>


// //               {/* DATE */}

// //               {booking.date && (
// //                 <div className="col-md-6">
// //                   <div className="border rounded p-3 h-100">

// //                     <div className="text-muted small">
// //                       Date
// //                     </div>

// //                     <div className="fw-semibold">
// //                       {new Date(
// //                         booking.date
// //                       ).toLocaleDateString()}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}


// //               {/* BATCH TIME */}

// //               {booking.batchTime && (
// //                 <div className="col-md-6">
// //                   <div className="border rounded p-3 h-100">

// //                     <div className="text-muted small">
// //                       Batch Time
// //                     </div>

// //                     <div className="fw-semibold">
// //                       {booking.batchTime}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}


// //               {/* HALL */}

// //               {booking.hall && (
// //                 <div className="col-md-6">
// //                   <div className="border rounded p-3 h-100">

// //                     <div className="text-muted small">
// //                       Hall
// //                     </div>

// //                     <div className="fw-semibold">
// //                       {booking.hall}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}


// //               {/* AMOUNT */}

// //               {booking.amount !== undefined && (
// //                 <div className="col-md-6">
// //                   <div className="border rounded p-3 h-100">

// //                     <div className="text-muted small">
// //                       Amount
// //                     </div>

// //                     <div className="fw-semibold">
// //                       ₹{booking.amount}
// //                     </div>

// //                   </div>
// //                 </div>
// //               )}

// //             </div>


// //             {/* =================================================
// //                 CHECK-IN ACTION
// //             ================================================== */}

// //             <div className="border-top mt-4 pt-4">

// //               {booking.status === "pending" && (
// //                 <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

// //                   <div>
// //                     <h6 className="mb-1">
// //                       Ready for Check-in
// //                     </h6>

// //                     <small className="text-muted">
// //                       Confirm the visitor details and check them in.
// //                     </small>
// //                   </div>

// //                   <button
// //                     type="button"
// //                     className="btn btn-success btn-lg"
// //                     onClick={updateBooking}
// //                     disabled={checkingIn}
// //                   >
// //                     {checkingIn ? (
// //                       <>
// //                         <span
// //                           className="spinner-border spinner-border-sm me-2"
// //                           role="status"
// //                         ></span>

// //                         Checking In...
// //                       </>
// //                     ) : (
// //                       <>
// //                         <i className="fa fa-check-circle me-2"></i>

// //                         Update / Check In
// //                       </>
// //                     )}
// //                   </button>

// //                 </div>
// //               )}


// //               {/* COMPLETED */}

// //               {booking.status === "completed" && (
// //                 <div className="alert alert-success mb-0">

// //                   <div className="d-flex align-items-center">

// //                     <i className="fa fa-check-circle fs-4 me-3"></i>

// //                     <div>
// //                       <strong>
// //                         Booking already checked in.
// //                       </strong>

// //                       <div className="small mt-1">
// //                         This ticket cannot be checked in again.
// //                       </div>
// //                     </div>

// //                   </div>

// //                 </div>
// //               )}


// //               {/* CANCELLED */}

// //               {booking.status === "cancelled" && (
// //                 <div className="alert alert-danger mb-0">

// //                   <div className="d-flex align-items-center">

// //                     <i className="fa fa-times-circle fs-4 me-3"></i>

// //                     <div>
// //                       <strong>
// //                         Booking is cancelled.
// //                       </strong>

// //                       <div className="small mt-1">
// //                         This ticket cannot be checked in.
// //                       </div>
// //                     </div>

// //                   </div>

// //                 </div>
// //               )}

// //             </div>


// //             {/* =================================================
// //                 SCAN AGAIN
// //             ================================================== */}

// //             <div className="mt-4">

// //               <button
// //                 type="button"
// //                 className="btn btn-outline-dark"
// //                 onClick={scanAgain}
// //                 disabled={checkingIn}
// //               >
// //                 <i className="fa fa-qrcode me-2"></i>

// //                 Scan Another Ticket
// //               </button>

// //             </div>

// //           </div>
// //         </div>
// //       )}

// //     </div>
// //   );
// // }

// // export default ScannerMain;
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { base_booking_url2 } from "../../utils/base_url";

function ScannerMain() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  // --------------------------------------------------
  // OPEN SCANNER
  // --------------------------------------------------

  const openScanner = () => {
    setBooking(null);
    setErrorMessage("");
    setLoading(false);
    setCheckingIn(false);

    scannedRef.current = false;
    setScannerOpen(true);
  };

  // --------------------------------------------------
  // PARSE QR URL
  // --------------------------------------------------

  const getVerifyDetails = (qrUrl) => {
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

  // --------------------------------------------------
  // CREATE API URL
  // --------------------------------------------------

  const getApiUrl = (type, id) => {
    const baseUrl = base_booking_url2.replace(/\/$/, "");

    return `${baseUrl}/qr/verify/${encodeURIComponent(
      type
    )}/${encodeURIComponent(id)}`;
  };

  // --------------------------------------------------
  // FETCH BOOKING DETAILS
  // --------------------------------------------------

  const loadBooking = async (qrUrl) => {
    setLoading(true);
    setErrorMessage("");
    setBooking(null);

    try {
      const qrDetails = getVerifyDetails(qrUrl);

      if (!qrDetails) {
        throw new Error(
          "Invalid QR code. Please scan a valid booking QR."
        );
      }

      const { type, id } = qrDetails;

      const apiUrl = getApiUrl(type, id);

      console.log("QR URL:", qrUrl);
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Booking details could not be found."
        );
      }

      if (!result.data) {
        throw new Error("Booking data not found.");
      }

      setBooking({
        ...result.data,
        qrType: type,
        qrId: id,
        verifyUrl: apiUrl,
      });
    } catch (error) {
      console.error("LOAD BOOKING ERROR:", error);

      setBooking(null);
      setErrorMessage(
        error.message ||
          "Something went wrong while fetching booking details."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // HANDLE QR SCAN
  // --------------------------------------------------

  const handleQrScan = async (decodedText) => {
    if (scannedRef.current) {
      return;
    }

    scannedRef.current = true;

    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
      }
    } catch (error) {
      console.log("Scanner stop:", error);
    }

    setScannerOpen(false);

    // Directly fetch booking from QR URL
    await loadBooking(decodedText);
  };

  // --------------------------------------------------
  // START / STOP SCANNER
  // --------------------------------------------------

  useEffect(() => {
    if (!scannerOpen) {
      return;
    }

    const scanner = new Html5Qrcode("qr-reader");

    scannerRef.current = scanner;
    scannedRef.current = false;

    const startScanner = async () => {
      try {
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
          async (decodedText) => {
            await handleQrScan(decodedText);
          },
          (errorMessage) => {
            // QR not detected yet.
            // Don't show this as an error to the user.
          }
        );
      } catch (error) {
        console.error("SCANNER START ERROR:", error);

        setScannerOpen(false);
        setErrorMessage(
          "Camera could not be started. Please allow camera permission and try again."
        );
      }
    };

    startScanner();

    return () => {
      const cleanupScanner = async () => {
        try {
          if (scannerRef.current) {
            const state = scannerRef.current.getState();

            if (state === 2) {
              await scannerRef.current.stop();
            }
          }
        } catch (error) {
          console.log("Scanner cleanup:", error);
        }

        scannerRef.current = null;
      };

      cleanupScanner();
    };
  }, [scannerOpen]);

  // --------------------------------------------------
  // UPDATE / CHECK IN
  // --------------------------------------------------

  const updateBooking = async () => {
    if (!booking?.qrType || !booking?.qrId) {
      return;
    }

    if (booking.status === "completed") {
      return;
    }

    if (booking.status === "cancelled") {
      return;
    }

    setCheckingIn(true);
    setErrorMessage("");

    try {
      const apiUrl = getApiUrl(
        booking.qrType,
        booking.qrId
      );

      console.log("CHECK-IN API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Check-in failed."
        );
      }

      if (!result.data) {
        throw new Error("Updated booking data not received.");
      }

      setBooking({
        ...result.data,
        qrType: booking.qrType,
        qrId: booking.qrId,
        verifyUrl: apiUrl,
      });
    } catch (error) {
      console.error("CHECK-IN ERROR:", error);

      setErrorMessage(
        error.message ||
          "Something went wrong while checking in."
      );
    } finally {
      setCheckingIn(false);
    }
  };

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------

  const renderStatusBadge = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (normalizedStatus === "completed") {
      return (
        <span className="badge bg-success fs-6 px-3 py-2">
          Completed
        </span>
      );
    }

    if (normalizedStatus === "cancelled") {
      return (
        <span className="badge bg-danger fs-6 px-3 py-2">
          Cancelled
        </span>
      );
    }

    if (normalizedStatus === "pending") {
      return (
        <span className="badge bg-warning text-dark fs-6 px-3 py-2">
          Pending
        </span>
      );
    }

    return (
      <span className="badge bg-secondary fs-6 px-3 py-2">
        {status || "Unknown"}
      </span>
    );
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // --------------------------------------------------
  // FORMAT AMOUNT
  // --------------------------------------------------

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "-";
    }

    const number = Number(amount);

    if (Number.isNaN(number)) {
      return amount;
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div className="container-fluid py-4">
      {/* PAGE HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            QR Scanner
          </h2>

          <p className="text-muted mb-0">
            Scan a booking QR code to view details
            and check in the devotee.
          </p>
        </div>

        {!scannerOpen && (
          <button
            type="button"
            className="btn btn-primary px-4"
            onClick={openScanner}
          >
            Scan QR Code
          </button>
        )}
      </div>

      {/* ERROR */}

      {errorMessage && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between"
          role="alert"
        >
          <div>
            <strong>Error:</strong>{" "}
            {errorMessage}
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage("")}
          />
        </div>
      )}

      {/* SCANNER */}

      {scannerOpen && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="text-center mb-3">
              <h5 className="fw-semibold mb-1">
                Scan Booking QR
              </h5>

              <p className="text-muted mb-0">
                Keep the QR code inside the square.
              </p>
            </div>

            <div
              id="qr-reader"
              className="mx-auto"
              style={{
                maxWidth: "500px",
              }}
            />

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={async () => {
                  try {
                    if (scannerRef.current) {
                      await scannerRef.current.stop();
                    }
                  } catch (error) {
                    console.log(error);
                  }

                  setScannerOpen(false);
                }}
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            />

            <h5 className="fw-semibold">
              Fetching Booking Details
            </h5>

            <p className="text-muted mb-0">
              Please wait while we verify the QR code.
            </p>
          </div>
        </div>
      )}

      {/* BOOKING DETAILS */}

      {!loading && booking && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            {/* HEADER */}

            <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
              <div>
                <h4 className="fw-bold mb-1">
                  Booking Details
                </h4>

                <p className="text-muted mb-0">
                  Booking information fetched from QR
                  verification.
                </p>
              </div>

              <div className="mt-2 mt-md-0">
                {renderStatusBadge(
                  booking.status
                )}
              </div>
            </div>

            {/* USER DETAILS */}

            <div className="mb-4">
              <h6 className="fw-bold mb-3">
                User Details
              </h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="bg-light rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Name
                    </small>

                    <div className="fw-semibold">
                      {booking.name || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-light rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Mobile
                    </small>

                    <div className="fw-semibold">
                      {booking.mobile_no ||
                        booking.phone ||
                        "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-light rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Email
                    </small>

                    <div className="fw-semibold text-break">
                      {booking.email || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-light rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Booking ID
                    </small>

                    <div className="fw-semibold text-break">
                      {booking._id ||
                        booking.qrId ||
                        "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ABHISHEK DETAILS */}

            <div className="mb-4">
              <h6 className="fw-bold mb-3">
                Abhishek Details
              </h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Abhishek Type
                    </small>

                    <div className="fw-semibold">
                      {booking.type || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Date
                    </small>

                    <div className="fw-semibold">
                      {formatDate(
                        booking.date
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Batch Time
                    </small>

                    <div className="fw-semibold">
                      {booking.batchTime || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      Hall
                    </small>

                    <div className="fw-semibold">
                      {booking.hall || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT / RECEIPT */}

            <div className="mb-4">
              <h6 className="fw-bold mb-3">
                Payment & Receipt
              </h6>

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="bg-light rounded p-3">
                    <small className="text-muted d-block mb-1">
                      Receipt Number
                    </small>

                    <div className="fw-semibold">
                      {booking.receipt || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="bg-light rounded p-3">
                    <small className="text-muted d-block mb-1">
                      Serial Number
                    </small>

                    <div className="fw-semibold">
                      {booking.serial || "-"}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="bg-light rounded p-3">
                    <small className="text-muted d-block mb-1">
                      Amount
                    </small>

                    <div className="fw-semibold">
                      {formatAmount(
                        booking.amount
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS + ACTION */}

            <div className="border-top pt-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <small className="text-muted d-block mb-1">
                    Current Status
                  </small>

                  <div>
                    {renderStatusBadge(
                      booking.status
                    )}
                  </div>

                  {booking.checkedInAt && (
                    <small className="text-muted d-block mt-2">
                      Checked in on{" "}
                      {formatDate(
                        booking.checkedInAt
                      )}
                    </small>
                  )}
                </div>

                <div>
                  {booking.status ===
                    "pending" && (
                    <button
                      type="button"
                      className="btn btn-success px-4 py-2"
                      onClick={updateBooking}
                      disabled={checkingIn}
                    >
                      {checkingIn ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />

                          Updating...
                        </>
                      ) : (
                        "Update / Check In"
                      )}
                    </button>
                  )}

                  {booking.status ===
                    "completed" && (
                    <div className="alert alert-success mb-0">
                      <strong>
                        ✓ Already Checked In
                      </strong>
                    </div>
                  )}

                  {booking.status ===
                    "cancelled" && (
                    <div className="alert alert-danger mb-0">
                      <strong>
                        Booking Cancelled
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SCAN ANOTHER */}

            <div className="text-center mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-primary px-4"
                onClick={openScanner}
              >
                Scan Another Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INITIAL EMPTY STATE */}

      {!scannerOpen &&
        !loading &&
        !booking &&
        !errorMessage && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <div
                className="mb-3"
                style={{
                  fontSize: "50px",
                }}
              >
                📱
              </div>

              <h5 className="fw-semibold">
                Ready to Scan
              </h5>

              <p className="text-muted mb-4">
                Scan the QR code printed on the
                booking receipt to view booking
                details.
              </p>

              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={openScanner}
              >
                Start Scanner
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default ScannerMain;



// import React, { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import axios from "axios";

// import { base_booking_url2 } from "../../utils/base_url";
// import { config } from "../../utils/axiosconfig";

// function ScannerMain() {
//   const [scannerOpen, setScannerOpen] = useState(false);
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [checkingIn, setCheckingIn] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [authorityMessage, setAuthorityMessage] = useState("");

//   const scannerRef = useRef(null);
//   const scannedRef = useRef(false);

//   const getApiUrl = (type, id) => {
//     const baseUrl = base_booking_url2.replace(/\/$/, "");
//     return `${baseUrl}/qr/verify/${encodeURIComponent(type)}/${encodeURIComponent(id)}`;
//   };

//   const getVerifyDetails = (qrUrl) => {
//     try {
//       const url = new URL(qrUrl);
//       const parts = url.pathname.split("/").filter(Boolean);
//       const index = parts.indexOf("verify");

//       if (index === -1 || !parts[index + 1] || !parts[index + 2]) {
//         return null;
//       }

//       return {
//         type: parts[index + 1],
//         id: parts[index + 2],
//       };
//     } catch {
//       return null;
//     }
//   };

//   const resetMessages = () => {
//     setErrorMessage("");
//     setAuthorityMessage("");
//   };

//   const openScanner = () => {
//     setBooking(null);
//     resetMessages();
//     setLoading(false);
//     setCheckingIn(false);
//     scannedRef.current = false;
//     setScannerOpen(true);
//   };

//   const loadBooking = async (qrUrl) => {
//     if (!qrUrl) {
//       setErrorMessage("No QR code was scanned.");
//       return;
//     }

//     const qrDetails = getVerifyDetails(qrUrl);

//     if (!qrDetails) {
//       setErrorMessage("Invalid QR code. Please scan a valid booking QR.");
//       return;
//     }

//     const { type, id } = qrDetails;
//     const apiUrl = getApiUrl(type, id);

//     setLoading(true);
//     setBooking(null);
//     resetMessages();

//     try {
//       console.log("GET:", apiUrl);

//       // Axios automatically uses your existing auth config.
//       const response = await axios.get(apiUrl, config);
//       const result = response.data;

//       console.log("VERIFY RESPONSE:", result);

//       if (!result.success) {
//         if (result.requiresAuthority) {
//           setAuthorityMessage(
//             result.message || "Please refer to higher authority."
//           );
//         } else {
//           setErrorMessage(
//             result.message || "Unable to find this booking."
//           );
//         }

//         if (result.data) {
//           setBooking({
//             ...result.data,
//             qrType: type,
//             qrId: id,
//             verifyUrl: apiUrl,
//           });
//         }

//         return;
//       }

//       if (!result.data) {
//         throw new Error("Booking data not found.");
//       }

//       setBooking({
//         ...result.data,
//         qrType: type,
//         qrId: id,
//         verifyUrl: apiUrl,
//       });
//     } catch (error) {
//       console.error("LOAD BOOKING ERROR:", error);

//       const data = error?.response?.data;

//       if (data?.data) {
//         setBooking({
//           ...data.data,
//           qrType: type,
//           qrId: id,
//           verifyUrl: apiUrl,
//         });
//       }

//       if (data?.requiresAuthority) {
//         setAuthorityMessage(
//           data.message || "Please refer to higher authority."
//         );
//       } else {
//         setErrorMessage(
//           data?.message ||
//             error?.message ||
//             "Unable to load booking details."
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQrScan = async (decodedText) => {
//     if (scannedRef.current) return;

//     scannedRef.current = true;

//     try {
//       if (scannerRef.current) {
//         await scannerRef.current.stop();
//       }
//     } catch (error) {
//       console.log("Scanner stop:", error);
//     }

//     scannerRef.current = null;
//     setScannerOpen(false);

//     await loadBooking(decodedText);
//   };

//   useEffect(() => {
//     if (!scannerOpen) return;

//     let mounted = true;

//     const scanner = new Html5Qrcode("qr-reader");
//     scannerRef.current = scanner;
//     scannedRef.current = false;

//     const start = async () => {
//       try {
//         await scanner.start(
//           { facingMode: "environment" },
//           {
//             fps: 10,
//             qrbox: { width: 250, height: 250 },
//             aspectRatio: 1,
//           },
//           async (decodedText) => {
//             if (mounted) {
//               await handleQrScan(decodedText);
//             }
//           },
//           () => {}
//         );
//       } catch (error) {
//         console.error("CAMERA ERROR:", error);

//         if (mounted) {
//           setScannerOpen(false);
//           setErrorMessage(
//             "Unable to open camera. Please allow camera permission and try again."
//           );
//         }

//         scannerRef.current = null;
//       }
//     };

//     start();

//     return () => {
//       mounted = false;

//       const stopScanner = async () => {
//         try {
//           if (scannerRef.current) {
//             await scannerRef.current.stop();
//           }
//         } catch (error) {
//           console.log("Scanner cleanup:", error);
//         }

//         scannerRef.current = null;
//       };

//       stopScanner();
//     };
//   }, [scannerOpen]);

//   const updateBooking = async () => {
//     if (!booking || checkingIn) return;

//     const { qrType: type, qrId: id } = booking;

//     if (!type || !id) {
//       setErrorMessage("Booking information is incomplete.");
//       return;
//     }

//     const status = String(booking.status || "").toLowerCase();

//     if (status === "completed") {
//       return;
//     }

//     if (status === "cancelled") {
//       setAuthorityMessage(
//         "This booking is cancelled. Please refer to higher authority."
//       );
//       return;
//     }

//     if (status !== "pending") {
//       setAuthorityMessage(
//         "This booking cannot be checked in. Please refer to higher authority."
//       );
//       return;
//     }

//     setCheckingIn(true);
//     resetMessages();

//     try {
//       const apiUrl = getApiUrl(type, id);

//       console.log("PATCH:", apiUrl);

//       // Same authenticated config used by your working Axios API.
//       const response = await axios.patch(apiUrl, {}, config);
//       const result = response.data;

//       console.log("CHECK-IN RESPONSE:", result);

//       if (!result.success) {
//         if (result.requiresAuthority) {
//           setAuthorityMessage(
//             result.message || "Please refer to higher authority."
//           );
//         } else {
//           setErrorMessage(
//             result.message || "Unable to update booking."
//           );
//         }

//         if (result.data) {
//           setBooking((prev) => ({
//             ...prev,
//             ...result.data,
//             qrType: type,
//             qrId: id,
//             verifyUrl: apiUrl,
//           }));
//         }

//         return;
//       }

//       if (!result.data) {
//         throw new Error("Updated booking data not received.");
//       }

//       setBooking({
//         ...result.data,
//         qrType: type,
//         qrId: id,
//         verifyUrl: apiUrl,
//       });
//     } catch (error) {
//       console.error("CHECK-IN ERROR:", error);

//       const data = error?.response?.data;

//       if (data?.data) {
//         setBooking((prev) => ({
//           ...prev,
//           ...data.data,
//           qrType: type,
//           qrId: id,
//         }));
//       }

//       if (data?.requiresAuthority) {
//         setAuthorityMessage(
//           data.message || "Please refer to higher authority."
//         );
//       } else {
//         setErrorMessage(
//           data?.message ||
//             error?.message ||
//             "Unable to update booking."
//         );
//       }
//     } finally {
//       setCheckingIn(false);
//     }
//   };

//   const closeScanner = async () => {
//     try {
//       if (scannerRef.current) {
//         await scannerRef.current.stop();
//       }
//     } catch (error) {
//       console.log("Scanner close:", error);
//     }

//     scannerRef.current = null;
//     scannedRef.current = false;
//     setScannerOpen(false);
//   };

//   const scanAgain = () => {
//     setBooking(null);
//     resetMessages();
//     setLoading(false);
//     setCheckingIn(false);
//     scannedRef.current = false;
//     setScannerOpen(true);
//   };

//   const formatDate = (date) => {
//     if (!date) return "-";

//     const value = new Date(date);

//     if (Number.isNaN(value.getTime())) return "-";

//     return value.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatDateTime = (date) => {
//     if (!date) return "-";

//     const value = new Date(date);

//     if (Number.isNaN(value.getTime())) return "-";

//     return value.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatAmount = (amount) => {
//     if (amount === null || amount === undefined || amount === "") {
//       return "-";
//     }

//     const value = Number(amount);

//     if (Number.isNaN(value)) return amount;

//     return `₹${value.toLocaleString("en-IN")}`;
//   };

//   const status = String(booking?.status || "").toLowerCase();

//   const statusBadge = () => {
//     if (status === "pending") {
//       return (
//         <span className="badge bg-warning text-dark px-3 py-2">
//           Pending
//         </span>
//       );
//     }

//     if (status === "completed") {
//       return (
//         <span className="badge bg-success px-3 py-2">
//           Completed
//         </span>
//       );
//     }

//     if (status === "cancelled") {
//       return (
//         <span className="badge bg-danger px-3 py-2">
//           Cancelled
//         </span>
//       );
//     }

//     return (
//       <span className="badge bg-secondary px-3 py-2">
//         {booking?.status || "Unknown"}
//       </span>
//     );
//   };

//   const field = (label, value, className = "col-12 col-md-6") => (
//     <div className={className}>
//       <div className="border rounded p-3 h-100">
//         <small className="text-muted d-block mb-1">{label}</small>
//         <div className="fw-semibold text-break">
//           {value || "-"}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="container-fluid py-3 py-md-4">
//       {/* HEADER */}
//       <div className="card border-0 shadow-sm mb-3">
//         <div className="card-body p-3 p-md-4">
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
//             <div>
//               <span className="badge bg-warning text-dark mb-2">
//                 Gate Check-in
//               </span>

//               <h3 className="fw-bold mb-1">Ticket Scanner</h3>

//               <p className="text-muted mb-0">
//                 Scan a visitor QR code to verify the booking.
//               </p>
//             </div>

//             {!scannerOpen && (
//               <button
//                 className="btn btn-dark btn-lg"
//                 onClick={openScanner}
//                 disabled={loading || checkingIn}
//               >
//                 <i className="fa fa-qrcode me-2" />
//                 Scan Ticket
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ERROR */}
//       {errorMessage && (
//         <div className="alert alert-danger d-flex align-items-start gap-2">
//           <i className="fa fa-exclamation-circle fs-5 mt-1" />

//           <div className="flex-grow-1">
//             <strong>Unable to process</strong>
//             <div className="mt-1">{errorMessage}</div>
//           </div>

//           <button
//             className="btn-close"
//             onClick={() => setErrorMessage("")}
//           />
//         </div>
//       )}

//       {/* AUTHORITY */}
//       {authorityMessage && (
//         <div className="alert alert-warning d-flex align-items-start gap-2">
//           <i className="fa fa-user-shield fs-5 mt-1" />

//           <div className="flex-grow-1">
//             <strong>Please Refer to Higher Authority</strong>
//             <div className="mt-1">{authorityMessage}</div>
//           </div>

//           <button
//             className="btn-close"
//             onClick={() => setAuthorityMessage("")}
//           />
//         </div>
//       )}

//       {/* SCANNER */}
//       {scannerOpen && (
//         <div className="card border-0 shadow-sm mb-3">
//           <div className="card-body p-3 p-md-4">
//             <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-3">
//               <div>
//                 <h5 className="fw-semibold mb-1">Scan QR Code</h5>
//                 <small className="text-muted">
//                   Keep the QR code inside the scanning box.
//                 </small>
//               </div>

//               <button
//                 className="btn btn-outline-danger"
//                 onClick={closeScanner}
//               >
//                 Close
//               </button>
//             </div>

//             <div
//               id="qr-reader"
//               style={{
//                 width: "100%",
//                 maxWidth: "420px",
//                 margin: "0 auto",
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* LOADING */}
//       {loading && (
//         <div className="card border-0 shadow-sm mb-3">
//           <div className="card-body text-center py-5">
//             <div className="spinner-border text-primary mb-3" />

//             <h5 className="fw-semibold mb-1">
//               Verifying Booking
//             </h5>

//             <p className="text-muted mb-0">
//               Please wait...
//             </p>
//           </div>
//         </div>
//       )}

//       {/* BOOKING */}
//       {booking && !loading && (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body p-3 p-md-4">
//             {/* TITLE */}
//             <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2 border-bottom pb-3 mb-4">
//               <div>
//                 <h4 className="fw-bold mb-1">Booking Details</h4>
//                 <p className="text-muted mb-0">
//                   Visitor information
//                 </p>
//               </div>

//               {statusBadge()}
//             </div>

//             {/* VISITOR */}
//             <h6 className="fw-bold mb-3">Visitor Details</h6>

//             <div className="row g-3">
//               {field("Visitor Name", booking.name)}
//               {field(
//                 "Mobile Number",
//                 booking.mobile_no || booking.phone
//               )}
//               {field("Email", booking.email)}
//               {field(
//                 "Booking ID",
//                 booking._id || booking.qrId
//               )}
//             </div>

//             {/* ABHISHEK */}
//             <h6 className="fw-bold mt-4 mb-3">
//               Abhishek Details
//             </h6>

//             <div className="row g-3">
//               {field(
//                 "Abhishek Type",
//                 booking.type || booking.typeOfAbhishek
//               )}
//               {field("Visit Date", formatDate(booking.date))}
//               {field(
//                 "Batch Time",
//                 booking.batchTime || booking.batch_time
//               )}
//               {field("Hall", booking.hall)}
//             </div>

//             {/* RECEIPT */}
//             <h6 className="fw-bold mt-4 mb-3">
//               Receipt Details
//             </h6>

//             <div className="row g-3">
//               {field(
//                 "Receipt Number",
//                 booking.receipt || booking.receipt_number,
//                 "col-12 col-md-4"
//               )}

//               {field(
//                 "Serial Number",
//                 booking.serial ?? booking.serial_number,
//                 "col-12 col-md-4"
//               )}

//               {field(
//                 "Amount",
//                 formatAmount(booking.amount),
//                 "col-12 col-md-4"
//               )}
//             </div>

//             {/* CHECK-IN INFO */}
//             {(booking.checkedInAt ||
//               booking.statusUpdatedBy) && (
//               <>
//                 <h6 className="fw-bold mt-4 mb-3">
//                   Check-in Information
//                 </h6>

//                 <div className="row g-3">
//                   {booking.checkedInAt &&
//                     field(
//                       "Checked In At",
//                       formatDateTime(booking.checkedInAt)
//                     )}

//                   {booking.statusUpdatedBy &&
//                     field(
//                       "Status Updated By",
//                       typeof booking.statusUpdatedBy === "object"
//                         ? booking.statusUpdatedBy.name ||
//                             booking.statusUpdatedBy.email ||
//                             booking.statusUpdatedBy._id
//                         : booking.statusUpdatedBy
//                     )}
//                 </div>
//               </>
//             )}

//             {/* ACTION MESSAGE */}
//             {status === "completed" && (
//               <div className="alert alert-success mt-4 mb-0">
//                 <strong>
//                   <i className="fa fa-check-circle me-2" />
//                   Already Checked In
//                 </strong>

//                 <div className="mt-1">
//                   This ticket has already been checked in.
//                 </div>
//               </div>
//             )}

//             {status === "cancelled" && (
//               <div className="alert alert-danger mt-4 mb-0">
//                 <strong>
//                   <i className="fa fa-times-circle me-2" />
//                   Booking Cancelled
//                 </strong>

//                 <div className="mt-1">
//                   This booking cannot be checked in. Please
//                   refer to higher authority.
//                 </div>
//               </div>
//             )}

//             {status === "pending" && !authorityMessage && (
//               <div className="border-top mt-4 pt-4">
//                 <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
//                   <div>
//                     <h6 className="fw-bold mb-1">
//                       Ready for Check-in
//                     </h6>

//                     <small className="text-muted">
//                       Verify the visitor details before
//                       checking in.
//                     </small>
//                   </div>

//                   <button
//                     className="btn btn-success btn-lg"
//                     onClick={updateBooking}
//                     disabled={checkingIn}
//                   >
//                     {checkingIn ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Checking In...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fa fa-check-circle me-2" />
//                         Check In
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* SCAN AGAIN */}
//             <div className="border-top mt-4 pt-4">
//               <button
//                 className="btn btn-outline-dark btn-lg w-100"
//                 onClick={scanAgain}
//                 disabled={checkingIn}
//               >
//                 <i className="fa fa-qrcode me-2" />
//                 Scan Another Ticket
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EMPTY */}
//       {!scannerOpen &&
//         !loading &&
//         !booking &&
//         !errorMessage && (
//           <div className="card border-0 shadow-sm">
//             <div className="card-body text-center py-5 px-3">
//               <div className="fs-1 mb-3">📱</div>

//               <h5 className="fw-bold">Ready to Scan</h5>

//               <p className="text-muted mb-4">
//                 Scan the QR code on the visitor's booking
//                 receipt.
//               </p>

//               <button
//                 className="btn btn-dark btn-lg w-100"
//                 style={{ maxWidth: "350px" }}
//                 onClick={openScanner}
//               >
//                 <i className="fa fa-qrcode me-2" />
//                 Start Scanner
//               </button>
//             </div>
//           </div>
//         )}
//     </div>
//   );
// }

// export default ScannerMain;