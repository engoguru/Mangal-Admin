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
// import React, { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { base_booking_url2 } from "../../utils/base_url";

// function ScannerMain() {
//   const [scannerOpen, setScannerOpen] = useState(false);
//   const [booking, setBooking] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [checkingIn, setCheckingIn] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const scannerRef = useRef(null);
//   const scannedRef = useRef(false);

//   // --------------------------------------------------
//   // OPEN SCANNER
//   // --------------------------------------------------

//   const openScanner = () => {
//     setBooking(null);
//     setErrorMessage("");
//     setLoading(false);
//     setCheckingIn(false);

//     scannedRef.current = false;
//     setScannerOpen(true);
//   };

//   // --------------------------------------------------
//   // PARSE QR URL
//   // --------------------------------------------------

//   const getVerifyDetails = (qrUrl) => {
//     try {
//       const url = new URL(qrUrl);

//       const parts = url.pathname
//         .split("/")
//         .filter(Boolean);

//       const verifyIndex = parts.indexOf("verify");

//       if (
//         verifyIndex === -1 ||
//         !parts[verifyIndex + 1] ||
//         !parts[verifyIndex + 2]
//       ) {
//         return null;
//       }

//       const type = parts[verifyIndex + 1];
//       const id = parts[verifyIndex + 2];

//       return {
//         type,
//         id,
//       };
//     } catch (error) {
//       console.error("QR URL PARSE ERROR:", error);
//       return null;
//     }
//   };

//   // --------------------------------------------------
//   // CREATE API URL
//   // --------------------------------------------------

//   const getApiUrl = (type, id) => {
//     const baseUrl = base_booking_url2.replace(/\/$/, "");

//     return `${baseUrl}/qr/verify/${encodeURIComponent(
//       type
//     )}/${encodeURIComponent(id)}`;
//   };

//   // --------------------------------------------------
//   // FETCH BOOKING DETAILS
//   // --------------------------------------------------

//   const loadBooking = async (qrUrl) => {
//     setLoading(true);
//     setErrorMessage("");
//     setBooking(null);

//     try {
//       const qrDetails = getVerifyDetails(qrUrl);

//       if (!qrDetails) {
//         throw new Error(
//           "Invalid QR code. Please scan a valid booking QR."
//         );
//       }

//       const { type, id } = qrDetails;

//       const apiUrl = getApiUrl(type, id);

//       console.log("QR URL:", qrUrl);
//       console.log("API URL:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Booking details could not be found."
//         );
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

//       setBooking(null);
//       setErrorMessage(
//         error.message ||
//           "Something went wrong while fetching booking details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // HANDLE QR SCAN
//   // --------------------------------------------------

//   const handleQrScan = async (decodedText) => {
//     if (scannedRef.current) {
//       return;
//     }

//     scannedRef.current = true;

//     try {
//       if (scannerRef.current) {
//         await scannerRef.current.stop();
//       }
//     } catch (error) {
//       console.log("Scanner stop:", error);
//     }

//     setScannerOpen(false);

//     // Directly fetch booking from QR URL
//     await loadBooking(decodedText);
//   };

//   // --------------------------------------------------
//   // START / STOP SCANNER
//   // --------------------------------------------------

//   useEffect(() => {
//     if (!scannerOpen) {
//       return;
//     }

//     const scanner = new Html5Qrcode("qr-reader");

//     scannerRef.current = scanner;
//     scannedRef.current = false;

//     const startScanner = async () => {
//       try {
//         await scanner.start(
//           {
//             facingMode: "environment",
//           },
//           {
//             fps: 10,
//             qrbox: {
//               width: 250,
//               height: 250,
//             },
//           },
//           async (decodedText) => {
//             await handleQrScan(decodedText);
//           },
//           (errorMessage) => {
//             // QR not detected yet.
//             // Don't show this as an error to the user.
//           }
//         );
//       } catch (error) {
//         console.error("SCANNER START ERROR:", error);

//         setScannerOpen(false);
//         setErrorMessage(
//           "Camera could not be started. Please allow camera permission and try again."
//         );
//       }
//     };

//     startScanner();

//     return () => {
//       const cleanupScanner = async () => {
//         try {
//           if (scannerRef.current) {
//             const state = scannerRef.current.getState();

//             if (state === 2) {
//               await scannerRef.current.stop();
//             }
//           }
//         } catch (error) {
//           console.log("Scanner cleanup:", error);
//         }

//         scannerRef.current = null;
//       };

//       cleanupScanner();
//     };
//   }, [scannerOpen]);

//   // --------------------------------------------------
//   // UPDATE / CHECK IN
//   // --------------------------------------------------

//   const updateBooking = async () => {
//     if (!booking?.qrType || !booking?.qrId) {
//       return;
//     }

//     if (booking.status === "completed") {
//       return;
//     }

//     if (booking.status === "cancelled") {
//       return;
//     }

//     setCheckingIn(true);
//     setErrorMessage("");

//     try {
//       const apiUrl = getApiUrl(
//         booking.qrType,
//         booking.qrId
//       );

//       console.log("CHECK-IN API:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "PATCH",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Check-in failed."
//         );
//       }

//       if (!result.data) {
//         throw new Error("Updated booking data not received.");
//       }

//       setBooking({
//         ...result.data,
//         qrType: booking.qrType,
//         qrId: booking.qrId,
//         verifyUrl: apiUrl,
//       });
//     } catch (error) {
//       console.error("CHECK-IN ERROR:", error);

//       setErrorMessage(
//         error.message ||
//           "Something went wrong while checking in."
//       );
//     } finally {
//       setCheckingIn(false);
//     }
//   };

//   // --------------------------------------------------
//   // STATUS BADGE
//   // --------------------------------------------------

//   const renderStatusBadge = (status) => {
//     const normalizedStatus = String(
//       status || ""
//     ).toLowerCase();

//     if (normalizedStatus === "completed") {
//       return (
//         <span className="badge bg-success fs-6 px-3 py-2">
//           Completed
//         </span>
//       );
//     }

//     if (normalizedStatus === "cancelled") {
//       return (
//         <span className="badge bg-danger fs-6 px-3 py-2">
//           Cancelled
//         </span>
//       );
//     }

//     if (normalizedStatus === "pending") {
//       return (
//         <span className="badge bg-warning text-dark fs-6 px-3 py-2">
//           Pending
//         </span>
//       );
//     }

//     return (
//       <span className="badge bg-secondary fs-6 px-3 py-2">
//         {status || "Unknown"}
//       </span>
//     );
//   };

//   // --------------------------------------------------
//   // FORMAT DATE
//   // --------------------------------------------------

//   const formatDate = (date) => {
//     if (!date) {
//       return "-";
//     }

//     try {
//       return new Date(date).toLocaleDateString(
//         "en-IN",
//         {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }
//       );
//     } catch {
//       return date;
//     }
//   };

//   // --------------------------------------------------
//   // FORMAT AMOUNT
//   // --------------------------------------------------

//   const formatAmount = (amount) => {
//     if (
//       amount === null ||
//       amount === undefined ||
//       amount === ""
//     ) {
//       return "-";
//     }

//     const number = Number(amount);

//     if (Number.isNaN(number)) {
//       return amount;
//     }

//     return `₹${number.toLocaleString("en-IN")}`;
//   };

//   // --------------------------------------------------
//   // MAIN UI
//   // --------------------------------------------------

//   return (
//     <div className="container-fluid py-4">
//       {/* PAGE HEADER */}

//       <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="fw-bold mb-1">
//             QR Scanner
//           </h2>

//           <p className="text-muted mb-0">
//             Scan a booking QR code to view details
//             and check in the devotee.
//           </p>
//         </div>

//         {!scannerOpen && (
//           <button
//             type="button"
//             className="btn btn-primary px-4"
//             onClick={openScanner}
//           >
//             Scan QR Code
//           </button>
//         )}
//       </div>

//       {/* ERROR */}

//       {errorMessage && (
//         <div
//           className="alert alert-danger d-flex align-items-center justify-content-between"
//           role="alert"
//         >
//           <div>
//             <strong>Error:</strong>{" "}
//             {errorMessage}
//           </div>

//           <button
//             type="button"
//             className="btn-close"
//             onClick={() => setErrorMessage("")}
//           />
//         </div>
//       )}

//       {/* SCANNER */}

//       {scannerOpen && (
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-body">
//             <div className="text-center mb-3">
//               <h5 className="fw-semibold mb-1">
//                 Scan Booking QR
//               </h5>

//               <p className="text-muted mb-0">
//                 Keep the QR code inside the square.
//               </p>
//             </div>

//             <div
//               id="qr-reader"
//               className="mx-auto"
//               style={{
//                 maxWidth: "500px",
//               }}
//             />

//             <div className="text-center mt-3">
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary"
//                 onClick={async () => {
//                   try {
//                     if (scannerRef.current) {
//                       await scannerRef.current.stop();
//                     }
//                   } catch (error) {
//                     console.log(error);
//                   }

//                   setScannerOpen(false);
//                 }}
//               >
//                 Close Scanner
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* LOADING */}

//       {loading && (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body text-center py-5">
//             <div
//               className="spinner-border text-primary mb-3"
//               role="status"
//             />

//             <h5 className="fw-semibold">
//               Fetching Booking Details
//             </h5>

//             <p className="text-muted mb-0">
//               Please wait while we verify the QR code.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* BOOKING DETAILS */}

//       {!loading && booking && (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body p-4">
//             {/* HEADER */}

//             <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
//               <div>
//                 <h4 className="fw-bold mb-1">
//                   Booking Details
//                 </h4>

//                 <p className="text-muted mb-0">
//                   Booking information fetched from QR
//                   verification.
//                 </p>
//               </div>

//               <div className="mt-2 mt-md-0">
//                 {renderStatusBadge(
//                   booking.status
//                 )}
//               </div>
//             </div>

//             {/* USER DETAILS */}

//             <div className="mb-4">
//               <h6 className="fw-bold mb-3">
//                 User Details
//               </h6>

//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <div className="bg-light rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Name
//                     </small>

//                     <div className="fw-semibold">
//                       {booking.name || "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="bg-light rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Mobile
//                     </small>

//                     <div className="fw-semibold">
//                       {booking.mobile_no ||
//                         booking.phone ||
//                         "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="bg-light rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Email
//                     </small>

//                     <div className="fw-semibold text-break">
//                       {booking.email || "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="bg-light rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Booking ID
//                     </small>

//                     <div className="fw-semibold text-break">
//                       {booking._id ||
//                         booking.qrId ||
//                         "-"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ABHISHEK DETAILS */}

//             <div className="mb-4">
//               <h6 className="fw-bold mb-3">
//                 Abhishek Details
//               </h6>

//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Abhishek Type
//                     </small>

//                     <div className="fw-semibold">
//                       {booking.type || "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Date
//                     </small>

//                     <div className="fw-semibold">
//                       {formatDate(
//                         booking.date
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Batch Time
//                     </small>

//                     <div className="fw-semibold">
//                       {booking.batchTime || "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <small className="text-muted d-block mb-1">
//                       Hall
//                     </small>

//                     <div className="fw-semibold">
//                       {booking.hall || "-"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* PAYMENT / RECEIPT */}

//             <div className="mb-4">
//               <h6 className="fw-bold mb-3">
//                 Payment & Receipt
//               </h6>

//               <div className="row g-3">
//                 <div className="col-md-4">
//                   <div className="bg-light rounded p-3">
//                     <small className="text-muted d-block mb-1">
//                       Receipt Number
//                     </small>

//                     <div className="fw-semibold">
//                       {booking.receipt || "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-4">
//                   <div className="bg-light rounded p-3">
//                     <small className="text-muted d-block mb-1">
//                       Serial Number
//                     </small>

//                     <div className="fw-semibold">
//                       {booking.serial || "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-4">
//                   <div className="bg-light rounded p-3">
//                     <small className="text-muted d-block mb-1">
//                       Amount
//                     </small>

//                     <div className="fw-semibold">
//                       {formatAmount(
//                         booking.amount
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* STATUS + ACTION */}

//             <div className="border-top pt-4">
//               <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
//                 <div>
//                   <small className="text-muted d-block mb-1">
//                     Current Status
//                   </small>

//                   <div>
//                     {renderStatusBadge(
//                       booking.status
//                     )}
//                   </div>

//                   {booking.checkedInAt && (
//                     <small className="text-muted d-block mt-2">
//                       Checked in on{" "}
//                       {formatDate(
//                         booking.checkedInAt
//                       )}
//                     </small>
//                   )}
//                 </div>

//                 <div>
//                   {booking.status ===
//                     "pending" && (
//                     <button
//                       type="button"
//                       className="btn btn-success px-4 py-2"
//                       onClick={updateBooking}
//                       disabled={checkingIn}
//                     >
//                       {checkingIn ? (
//                         <>
//                           <span
//                             className="spinner-border spinner-border-sm me-2"
//                             role="status"
//                           />

//                           Updating...
//                         </>
//                       ) : (
//                         "Update / Check In"
//                       )}
//                     </button>
//                   )}

//                   {booking.status ===
//                     "completed" && (
//                     <div className="alert alert-success mb-0">
//                       <strong>
//                         ✓ Already Checked In
//                       </strong>
//                     </div>
//                   )}

//                   {booking.status ===
//                     "cancelled" && (
//                     <div className="alert alert-danger mb-0">
//                       <strong>
//                         Booking Cancelled
//                       </strong>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* SCAN ANOTHER */}

//             <div className="text-center mt-4 pt-3 border-top">
//               <button
//                 type="button"
//                 className="btn btn-outline-primary px-4"
//                 onClick={openScanner}
//               >
//                 Scan Another Ticket
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* INITIAL EMPTY STATE */}

//       {!scannerOpen &&
//         !loading &&
//         !booking &&
//         !errorMessage && (
//           <div className="card border-0 shadow-sm">
//             <div className="card-body text-center py-5">
//               <div
//                 className="mb-3"
//                 style={{
//                   fontSize: "50px",
//                 }}
//               >
//                 📱
//               </div>

//               <h5 className="fw-semibold">
//                 Ready to Scan
//               </h5>

//               <p className="text-muted mb-4">
//                 Scan the QR code printed on the
//                 booking receipt to view booking
//                 details.
//               </p>

//               <button
//                 type="button"
//                 className="btn btn-primary px-4"
//                 onClick={openScanner}
//               >
//                 Start Scanner
//               </button>
//             </div>
//           </div>
//         )}
//     </div>
//   );
// }

// export default ScannerMain;



import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { Html5Qrcode } from "html5-qrcode";

import { base_booking_url2 } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

function ScannerMain() {
  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [checkingIn, setCheckingIn] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [authorityMessage, setAuthorityMessage] =
    useState("");

  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  // =====================================================
  // OPEN SCANNER
  // =====================================================

  const openScanner = () => {
    setBooking(null);
    setErrorMessage("");
    setAuthorityMessage("");
    setLoading(false);
    setCheckingIn(false);

    scannedRef.current = false;

    setScannerOpen(true);
  };

  // =====================================================
  // PARSE QR URL
  // =====================================================

  const getVerifyDetails = (qrUrl) => {
    try {
      const url = new URL(qrUrl);

      const parts = url.pathname
        .split("/")
        .filter(Boolean);

      const verifyIndex =
        parts.indexOf("verify");

      if (
        verifyIndex === -1 ||
        !parts[verifyIndex + 1] ||
        !parts[verifyIndex + 2]
      ) {
        return null;
      }

      const type =
        parts[verifyIndex + 1];

      const id =
        parts[verifyIndex + 2];

      return {
        type,
        id,
      };
    } catch (error) {
      console.error(
        "QR URL PARSE ERROR:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // CREATE API URL
  // =====================================================

  const getApiUrl = (type, id) => {
    const baseUrl =
      base_booking_url2.replace(/\/$/, "");

    return `${baseUrl}/qr/verify/${encodeURIComponent(
      type
    )}/${encodeURIComponent(id)}`;
  };

  // =====================================================
  // LOAD BOOKING
  // GET = ONLY FETCH DETAILS
  // =====================================================

  const loadBooking = async (qrUrl) => {
    if (!qrUrl) {
      setErrorMessage(
        "No QR code was scanned."
      );

      return;
    }

    setLoading(true);
    setBooking(null);
    setErrorMessage("");
    setAuthorityMessage("");

    try {
      const qrDetails =
        getVerifyDetails(qrUrl);

      if (!qrDetails) {
        throw new Error(
          "Invalid QR code. Please scan a valid booking QR."
        );
      }

      const { type, id } =
        qrDetails;

      const apiUrl =
        getApiUrl(type, id);

      console.log(
        "================================"
      );

      console.log("QR SCANNED");

      console.log("TYPE:", type);

      console.log("ID:", id);

      console.log("GET API:", apiUrl);

      console.log(
        "================================"
      );

      const response = await fetch(
        apiUrl,
        {
          method: "GET",
         ...config,
          // headers: {
          //   Accept:
          //     "application/json",
          // },
        }
      );

      let result;

      try {
        result =
          await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "VERIFY RESPONSE:",
        result
      );

      // -------------------------------------------------
      // API ERROR
      // -------------------------------------------------

      if (
        !response.ok ||
        !result.success
      ) {
        if (
          result?.requiresAuthority
        ) {
          setAuthorityMessage(
            result.message ||
              "Please refer to higher authority."
          );
        } else {
          setErrorMessage(
            result?.message ||
              "Unable to find this booking."
          );
        }

        if (result?.data) {
          setBooking({
            ...result.data,

            qrType: type,
            qrId: id,
          });
        } else {
          setBooking(null);
        }

        return;
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      if (!result.data) {
        throw new Error(
          "Booking data not found."
        );
      }

      setBooking({
        ...result.data,

        qrType: type,
        qrId: id,

        verifyUrl: apiUrl,
      });
    } catch (error) {
      console.error(
        "LOAD BOOKING ERROR:",
        error
      );

      setBooking(null);

      setErrorMessage(
        error?.message ||
          "Unable to load booking details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE QR SCAN
  // =====================================================

  const handleQrScan = async (
    decodedText
  ) => {
    if (scannedRef.current) {
      return;
    }

    scannedRef.current = true;

    console.log(
      "QR RESULT:",
      decodedText
    );

    // Stop camera immediately
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
      }
    } catch (error) {
      console.log(
        "Scanner stop error:",
        error
      );
    }

    scannerRef.current = null;

    // Hide scanner
    setScannerOpen(false);

    // Fetch booking
    await loadBooking(decodedText);
  };

  // =====================================================
  // START SCANNER
  // =====================================================

  useEffect(() => {
    if (!scannerOpen) {
      return;
    }

    let mounted = true;

    const scanner =
      new Html5Qrcode(
        "qr-reader"
      );

    scannerRef.current =
      scanner;

    scannedRef.current = false;

    const startScanner =
      async () => {
        try {
          await scanner.start(
            {
              facingMode:
                "environment",
            },

            {
              fps: 10,

              qrbox: {
                width: 250,
                height: 250,
              },

              aspectRatio: 1,
            },

            async (
              decodedText
            ) => {
              if (!mounted) {
                return;
              }

              await handleQrScan(
                decodedText
              );
            },

            () => {
              // Scanner keeps checking.
              // No need to show scan errors.
            }
          );
        } catch (error) {
          console.error(
            "CAMERA ERROR:",
            error
          );

          if (!mounted) {
            return;
          }

          setScannerOpen(false);

          setErrorMessage(
            "Unable to open camera. Please allow camera permission and try again."
          );

          scannerRef.current =
            null;
        }
      };

    startScanner();

    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      mounted = false;

      const cleanup =
        async () => {
          try {
            if (
              scannerRef.current
            ) {
              await scannerRef.current.stop();
            }
          } catch (error) {
            console.log(
              "Scanner cleanup:",
              error
            );
          }

          scannerRef.current =
            null;
        };

      cleanup();
    };
  }, [scannerOpen]);

  // =====================================================
  // UPDATE / CHECK IN
  // PATCH
  // =====================================================

  const updateBooking =
    async () => {
      if (!booking) {
        return;
      }

      const type =
        booking.qrType;

      const id =
        booking.qrId;

      if (!type || !id) {
        setErrorMessage(
          "Booking information is incomplete."
        );

        return;
      }

      // Already completed
      if (
        booking.status ===
        "completed"
      ) {
        return;
      }

      // Cancelled
      if (
        booking.status ===
        "cancelled"
      ) {
        setAuthorityMessage(
          "This booking is cancelled. Please refer to higher authority."
        );

        return;
      }

      setCheckingIn(true);
      setErrorMessage("");
      setAuthorityMessage("");

      try {
        const apiUrl =
          getApiUrl(
            type,
            id
          );

        console.log(
          "================================"
        );

        console.log(
          "CHECK-IN"
        );

        console.log(
          "PATCH API:",
          apiUrl
        );

        console.log(
          "================================"
        );

        const response =
          await fetch(
            apiUrl,
            {
              method: "PATCH",
  ...config,
              // headers: {
              //   Accept:
              //     "application/json",

              //   "Content-Type":
              //     "application/json",
              // },
            }
          );

        let result;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        console.log(
          "CHECK-IN RESPONSE:",
          result
        );

        // -------------------------------------------------
        // HIGHER AUTHORITY
        // -------------------------------------------------

        if (
          !response.ok ||
          !result.success
        ) {
          if (
            result?.requiresAuthority
          ) {
            setAuthorityMessage(
              result.message ||
                "Please refer to higher authority."
            );
          } else {
            setErrorMessage(
              result?.message ||
                "Unable to update booking."
            );
          }

          // Backend may return latest booking data
          if (result?.data) {
            setBooking(
              (
                previous
              ) => ({
                ...previous,
                ...result.data,

                qrType: type,
                qrId: id,
              })
            );
          }

          return;
        }

        // -------------------------------------------------
        // CHECK-IN SUCCESS
        // -------------------------------------------------

        if (!result.data) {
          throw new Error(
            "Updated booking data not received."
          );
        }

        setBooking({
          ...result.data,

          qrType: type,
          qrId: id,

          verifyUrl: apiUrl,
        });
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

  // =====================================================
  // CLOSE SCANNER
  // =====================================================

  const closeScanner =
    async () => {
      try {
        if (
          scannerRef.current
        ) {
          await scannerRef.current.stop();
        }
      } catch (error) {
        console.log(
          "Scanner close error:",
          error
        );
      }

      scannerRef.current =
        null;

      scannedRef.current =
        false;

      setScannerOpen(false);
    };

  // =====================================================
  // SCAN AGAIN
  // =====================================================

  const scanAgain = () => {
    setBooking(null);

    setErrorMessage("");

    setAuthorityMessage("");

    setLoading(false);

    setCheckingIn(false);

    scannedRef.current =
      false;

    setScannerOpen(true);
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const renderStatusBadge =
    (status) => {
      const currentStatus =
        String(
          status || ""
        ).toLowerCase();

      if (
        currentStatus ===
        "pending"
      ) {
        return (
          <span className="badge bg-warning text-dark px-3 py-2">
            Pending
          </span>
        );
      }

      if (
        currentStatus ===
        "completed"
      ) {
        return (
          <span className="badge bg-success px-3 py-2">
            Completed
          </span>
        );
      }

      if (
        currentStatus ===
        "cancelled"
      ) {
        return (
          <span className="badge bg-danger px-3 py-2">
            Cancelled
          </span>
        );
      }

      return (
        <span className="badge bg-secondary px-3 py-2">
          {status || "Unknown"}
        </span>
      );
    };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT DATE + TIME
  // =====================================================

  const formatDateTime = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT AMOUNT
  // =====================================================

  const formatAmount = (
    amount
  ) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "-";
    }

    const number =
      Number(amount);

    if (
      Number.isNaN(number)
    ) {
      return amount;
    }

    return `₹${number.toLocaleString(
      "en-IN"
    )}`;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="container-fluid py-3 py-md-4">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="card shadow-sm border-0 mb-3 mb-md-4">
        <div className="card-body p-3 p-md-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">

            <div>
              <span className="badge bg-warning text-dark mb-2">
                Gate Check-in
              </span>

              <h3 className="fw-bold mb-1">
                Ticket Scanner
              </h3>

              <p className="text-muted mb-0">
                Scan visitor QR code to
                verify booking and check in.
              </p>
            </div>

            {!scannerOpen && (
              <button
                type="button"
                className="btn btn-dark btn-lg px-4"
                onClick={openScanner}
                disabled={
                  loading ||
                  checkingIn
                }
              >
                <i className="fa fa-qrcode me-2"></i>
                Scan Ticket
              </button>
            )}

          </div>

        </div>
      </div>


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {errorMessage && (
        <div className="alert alert-danger shadow-sm mb-3">

          <div className="d-flex align-items-start">

            <i className="fa fa-exclamation-circle fs-5 me-2 mt-1"></i>

            <div className="flex-grow-1">
              <strong>
                Unable to process
              </strong>

              <div className="mt-1">
                {errorMessage}
              </div>
            </div>

            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setErrorMessage("")
              }
            ></button>

          </div>

        </div>
      )}


      {/* =================================================
          HIGHER AUTHORITY MESSAGE
      ================================================= */}

      {authorityMessage && (
        <div className="alert alert-warning shadow-sm mb-3">

          <div className="d-flex align-items-start">

            <i className="fa fa-user-shield fs-5 me-2 mt-1"></i>

            <div className="flex-grow-1">

              <strong>
                Higher Authority Required
              </strong>

              <div className="mt-1">
                {authorityMessage}
              </div>

            </div>

            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setAuthorityMessage("")
              }
            ></button>

          </div>

        </div>
      )}


      {/* =================================================
          SCANNER
      ================================================= */}

      {scannerOpen && (
        <div className="card shadow-sm border-0 mb-3">

          <div className="card-body p-3 p-md-4">

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-2 mb-3">

              <div>
                <h5 className="fw-semibold mb-1">
                  Scan QR Code
                </h5>

                <small className="text-muted">
                  Place the visitor's QR code
                  inside the scanner.
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


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && !scannerOpen && (
        <div className="card shadow-sm border-0 mb-3">

          <div className="card-body text-center py-5">

            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>

            <h5 className="fw-semibold">
              Verifying Booking
            </h5>

            <p className="text-muted mb-0">
              Please wait while we fetch the
              booking details.
            </p>

          </div>
        </div>
      )}


      {/* =================================================
          BOOKING DETAILS
      ================================================= */}

      {booking && !loading && (
        <div className="card shadow-sm border-0 mb-3">

          <div className="card-body p-3 p-md-4">

            {/* -------------------------------------------
                BOOKING HEADER
            -------------------------------------------- */}

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 border-bottom pb-3 mb-4">

              <div>
                <h4 className="fw-bold mb-1">
                  Booking Details
                </h4>

                <p className="text-muted mb-0">
                  Visitor information
                </p>
              </div>

              <div>
                {renderStatusBadge(
                  booking.status
                )}
              </div>

            </div>


            {/* -------------------------------------------
                VISITOR DETAILS
            -------------------------------------------- */}

            <h6 className="fw-bold mb-3">
              Visitor Details
            </h6>

            <div className="row g-3">

              {/* NAME */}

              <div className="col-12 col-md-6">
                <div className="border rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Visitor Name
                  </small>

                  <div className="fw-semibold fs-5 text-break">
                    {booking.name ||
                      "-"}
                  </div>

                </div>
              </div>


              {/* MOBILE */}

              <div className="col-12 col-md-6">
                <div className="border rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Mobile Number
                  </small>

                  <div className="fw-semibold text-break">
                    {booking.mobile_no ||
                      booking.phone ||
                      "-"}
                  </div>

                </div>
              </div>


              {/* EMAIL */}

              <div className="col-12 col-md-6">
                <div className="border rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Email
                  </small>

                  <div
                    className="fw-semibold text-break"
                    style={{
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {booking.email ||
                      "-"}
                  </div>

                </div>
              </div>


              {/* BOOKING ID */}

              <div className="col-12 col-md-6">
                <div className="border rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Booking ID
                  </small>

                  <div
                    className="fw-semibold text-break"
                    style={{
                      overflowWrap:
                        "anywhere",
                      fontSize:
                        "14px",
                    }}
                  >
                    {booking._id ||
                      booking.qrId ||
                      "-"}
                  </div>

                </div>
              </div>

            </div>


            {/* -------------------------------------------
                ABHISHEK DETAILS
            -------------------------------------------- */}

            <h6 className="fw-bold mt-4 mb-3">
              Abhishek Details
            </h6>

            <div className="row g-3">

              {/* TYPE */}

              <div className="col-12 col-md-6">
                <div className="bg-light rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Abhishek Type
                  </small>

                  <div className="fw-semibold">
                    {booking.type ||
                      "-"}
                  </div>

                </div>
              </div>


              {/* VISIT DATE */}

              <div className="col-12 col-md-6">
                <div className="bg-light rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Visit Date
                  </small>

                  <div className="fw-semibold">
                    {formatDate(
                      booking.date
                    )}
                  </div>

                </div>
              </div>


              {/* BATCH */}

              <div className="col-12 col-md-6">
                <div className="bg-light rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Batch Time
                  </small>

                  <div className="fw-semibold">
                    {booking.batchTime ||
                      "-"}
                  </div>

                </div>
              </div>


              {/* HALL */}

              <div className="col-12 col-md-6">
                <div className="bg-light rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Hall
                  </small>

                  <div className="fw-semibold">
                    {booking.hall ||
                      "-"}
                  </div>

                </div>
              </div>

            </div>


            {/* -------------------------------------------
                RECEIPT DETAILS
            -------------------------------------------- */}

            <h6 className="fw-bold mt-4 mb-3">
              Receipt Details
            </h6>

            <div className="row g-3">

              {/* RECEIPT */}

              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Receipt Number
                  </small>

                  <div className="fw-semibold">
                    {booking.receipt ||
                      "-"}
                  </div>

                </div>
              </div>


              {/* SERIAL */}

              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Serial Number
                  </small>

                  <div className="fw-semibold">
                    {booking.serial ??
                      "-"}
                  </div>

                </div>
              </div>


              {/* AMOUNT */}

              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">

                  <small className="text-muted d-block mb-1">
                    Amount
                  </small>

                  <div className="fw-bold fs-5">
                    {formatAmount(
                      booking.amount
                    )}
                  </div>

                </div>
              </div>

            </div>


            {/* -------------------------------------------
                CHECK-IN INFORMATION
            -------------------------------------------- */}

            {(booking.checkedInAt ||
              booking.statusUpdatedBy) && (
              <>
                <h6 className="fw-bold mt-4 mb-3">
                  Check-in Information
                </h6>

                <div className="row g-3">

                  {booking.checkedInAt && (
                    <div className="col-12 col-md-6">

                      <div className="bg-light rounded p-3">

                        <small className="text-muted d-block mb-1">
                          Checked In At
                        </small>

                        <div className="fw-semibold">
                          {formatDateTime(
                            booking.checkedInAt
                          )}
                        </div>

                      </div>

                    </div>
                  )}

                  {booking.statusUpdatedBy && (
                    <div className="col-12 col-md-6">

                      <div className="bg-light rounded p-3">

                        <small className="text-muted d-block mb-1">
                          Status Updated By
                        </small>

                        <div className="fw-semibold text-break">
                          {
                            booking.statusUpdatedBy
                          }
                        </div>

                      </div>

                    </div>
                  )}

                </div>
              </>
            )}


            {/* -------------------------------------------
                HIGHER AUTHORITY
            -------------------------------------------- */}

            {authorityMessage && (
              <div className="alert alert-warning mt-4 mb-0">

                <div className="d-flex align-items-start">

                  <i className="fa fa-user-shield fs-4 me-3 mt-1"></i>

                  <div>

                    <strong>
                      Please Refer to Higher Authority
                    </strong>

                    <div className="mt-1">
                      {authorityMessage}
                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* -------------------------------------------
                PENDING
            -------------------------------------------- */}

            {booking.status ===
              "pending" &&
              !authorityMessage && (
                <div className="border-top mt-4 pt-4">

                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">

                    <div>
                      <h6 className="fw-bold mb-1">
                        Ready for Check-in
                      </h6>

                      <small className="text-muted">
                        Verify the visitor details
                        before checking in.
                      </small>
                    </div>

                    <button
                      type="button"
                      className="btn btn-success btn-lg px-4"
                      onClick={
                        updateBooking
                      }
                      disabled={
                        checkingIn
                      }
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

                </div>
              )}


            {/* -------------------------------------------
                COMPLETED
            -------------------------------------------- */}

            {booking.status ===
              "completed" && (
                <div className="alert alert-success mt-4 mb-0">

                  <div className="d-flex align-items-start">

                    <i className="fa fa-check-circle fs-4 me-3 mt-1"></i>

                    <div>

                      <strong>
                        Booking Already Checked In
                      </strong>

                      <div className="small mt-1">
                        This ticket has already
                        been checked in and cannot
                        be checked in again.
                      </div>

                    </div>

                  </div>

                </div>
              )}


            {/* -------------------------------------------
                CANCELLED
            -------------------------------------------- */}

            {booking.status ===
              "cancelled" && (
                <div className="alert alert-danger mt-4 mb-0">

                  <div className="d-flex align-items-start">

                    <i className="fa fa-times-circle fs-4 me-3 mt-1"></i>

                    <div>

                      <strong>
                        Booking Cancelled
                      </strong>

                      <div className="small mt-1">
                        This ticket cannot be
                        checked in. Please refer
                        to higher authority.
                      </div>

                    </div>

                  </div>

                </div>
              )}


            {/* -------------------------------------------
                SCAN ANOTHER
            -------------------------------------------- */}

            <div className="border-top mt-4 pt-4">

              <button
                type="button"
                className="btn btn-outline-dark btn-lg w-100"
                onClick={
                  scanAgain
                }
                disabled={
                  checkingIn
                }
              >
                <i className="fa fa-qrcode me-2"></i>

                Scan Another Ticket
              </button>

            </div>

          </div>
        </div>
      )}


      {/* =================================================
          NO BOOKING / INITIAL SCREEN
      ================================================= */}

      {!scannerOpen &&
        !loading &&
        !booking &&
        !errorMessage && (
          <div className="card shadow-sm border-0">

            <div className="card-body text-center py-5 px-3">

              <div
                className="mb-3"
                style={{
                  fontSize: "52px",
                }}
              >
                📱
              </div>

              <h5 className="fw-bold">
                Ready to Scan
              </h5>

              <p className="text-muted mb-4">
                Scan the QR code on the
                visitor's booking receipt
                to view details and check-in.
              </p>

              <button
                type="button"
                className="btn btn-dark btn-lg px-4 w-100"
                style={{
                  maxWidth: "350px",
                }}
                onClick={
                  openScanner
                }
              >
                <i className="fa fa-qrcode me-2"></i>

                Start Scanner
              </button>

            </div>

          </div>
        )}

    </div>
  );
}

export default ScannerMain;