// import React, { useRef } from "react";
// import { useReactToPrint } from "react-to-print";

// const MemberPDF = ({ members }) => {
//     const printRef = useRef(null);
  
//     const handlePrint = useReactToPrint({
//         contentRef: printRef,
//         documentTitle: "Member Report"
//     });

//     return (
//         <>
//             <button onClick={handlePrint}>
//                 Download PDF
                
//             </button>

//             <div ref={printRef} className="pdf-container">

//                 <h2 style={{ textAlign: "center" }}>
//                     सदस्य सूची
//                 </h2>

//                 <table>
//                     <thead>
//                         <tr>
//                             <th>क्रमांक</th>
//                             <th>नाम</th>
//                             <th>पता</th>
//                             <th>मोबाइल</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {members.map((member, index) => (
//                             <tr key={member["सदस्य_नंबर"] ?? index}>
//                                 <td>{member["सदस्य_नंबर"]}</td>
//                                 <td>{member["नाम"]}</td>
//                                 <td>{member["पता"]}</td>
//                                 <td>{member["संपर्क"]}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//             </div>
//         </>
//     );
// };

// export default MemberPDF;

// import React, { useRef } from "react";
// import { useReactToPrint } from "react-to-print";

// const MemberPDF = ({ members }) => {
//     const printRef = useRef(null);
  
//     // Updated for react-to-print v3 specification
//     const handlePrint = useReactToPrint({
//         // content: () => printRef.current,
//         contentRef: printRef,
//         documentTitle: "Member Report"
//     });

//     return (
//         <>
//             <button 
//                 onClick={handlePrint} 
//                 style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}
//             >
//                 Download PDF
//             </button>

//             <div ref={printRef} className="pdf-container" style={{ padding: "20px" }}>
                
//                 {/* Self-contained CSS styles for crisp PDF grid lines */}
//                 <style>{`
//                     @media print {
//                         * {
//                             -webkit-print-color-adjust: exact !important;
//                             print-color-adjust: exact !important;
//                         }
//                     }
                    
//                     .pdf-container table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin-top: 20px;
//                         font-family: Arial, sans-serif;
//                     }

//                     .pdf-container th, 
//                     .pdf-container td {
//                         border: 1px solid #000000; /* Crisp grid lines */
//                         padding: 10px;
//                         text-align: left;
//                     }

//                     .pdf-container th {
//                         background-color: #f2f2f2; /* Subtle header fill */
//                         font-weight: bold;
//                     }
//                 `}</style>

//                 <h2 style={{ textAlign: "center" }}>
//                     सदस्य सूची
//                 </h2>

//                 <table>
//                     <thead>
//                         <tr>
//                             <th>क्रमांक</th>
//                             <th>नाम</th>
//                             <th>पता</th>
//                             <th>मोबाइल</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {members && members.map((member, index) => (
//                             <tr key={member["सदस्य_नंबर"] ?? index}>
//                                 <td>{member["सदस्य_नंबर"]}</td>
//                                 <td>{member["नाम"]}</td>
//                                 <td>{member["पता"]}</td>
//                                 <td>{member["संपर्क"]}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//             </div>
//         </>
//     );
// };

// export default MemberPDF;

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const MemberPDF = ({ members = [] }) => {
    const printRef = useRef(null);
    const [isSorted, setIsSorted] = useState(false);

    // React-to-print v3 core handler
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: isSorted ? "Member Report - Serial Wise" : "Member Report"
    });

    // Helper to trigger printing after a short layout change
    const triggerPrint = () => {
        // A minor timeout ensures React finishes DOM updates before opening the print window
        setTimeout(() => {
            handlePrint();
        }, 50);
    };

    // Handler 1: Standard/Default Download
    const handleNormalDownload = () => {
        setIsSorted(false);
        triggerPrint();
    };

    // Handler 2: Serial Wise Sorting & Download
    const handleSerialDownload = () => {
        setIsSorted(true);
        triggerPrint();
    };

    // Prepare the list based on state selection
    const displayMembers = isSorted 
        ? [...members].sort((a, b) => {
            const numA = parseInt(a["सदस्य_नंबर"], 10) || 0;
            const numB = parseInt(b["सदस्य_नंबर"], 10) || 0;
            return numA - numB;
          })
        : members;

    return (
        <>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button 
                    onClick={handleNormalDownload} 
                    style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                    Download Normal PDF
                </button>
                
                <button 
                    onClick={handleSerialDownload} 
                    style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                    Download Serial wise PDF (क्रमानुसार)
                </button>
            </div>

            <div ref={printRef} className="pdf-container" style={{ padding: "20px" }}>
                
                {/* Self-contained CSS styles for crisp PDF grid lines */}
                <style>{`
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                    
                    .pdf-container table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        font-family: Arial, sans-serif;
                    }

                    .pdf-container th, 
                    .pdf-container td {
                        border: 1px solid #000000; /* Crisp grid lines */
                        padding: 10px;
                        text-align: left;
                    }

                    .pdf-container th {
                        background-color: #f2f2f2; /* Subtle header fill */
                        font-weight: bold;
                    }
                `}</style>

                <h2 style={{ textAlign: "center" }}>
                    सदस्य सूची {isSorted && "(क्रमानुसार)"}
                </h2>

                <table>
                    <thead>
                        <tr>
                            <th>क्रमांक</th>
                            <th>नाम</th>
                            <th>पता</th>
                            <th>मोबाइल</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayMembers && displayMembers.map((member, index) => (
                            <tr key={member["सदस्य_नंबर"] ?? index}>
                                <td>{member["सदस्य_नंबर"]}</td>
                                <td>{member["नाम"]}</td>
                                <td>{member["पता"]}</td>
                                <td>{member["संपर्क"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    );
};

export default MemberPDF;
