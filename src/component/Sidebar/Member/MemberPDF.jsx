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
    // Track print mode: "normal", "serial", or "ward"
    const [printMode, setPrintMode] = useState("normal");

    // React-to-print core handler
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Member Report - ${printMode}`
    });

    // Helper to safely trigger print cycle after DOM re-renders the sorted content
    const triggerPrint = (mode) => {
        setPrintMode(mode);
        setTimeout(() => {
            handlePrint();
        }, 50);
    };

    // Prepare data on-the-fly depending on the selected print button mode
    const getProcessedMembers = () => {
        if (printMode === "serial") {
            return [...members].sort((a, b) => {
                const numA = parseInt(a["सदस्य_नंबर"], 10) || 0;
                const numB = parseInt(b["सदस्य_नंबर"], 10) || 0;
                return numA - numB;
            });
        }
        
        if (printMode === "ward") {
            return [...members].sort((a, b) => {
                // Extract digits from strings like "वार्ड_संख्या 9"
                const matchA = String(a["वार्ड_संख्या"] || "").match(/\d+/);
                const matchB = String(b["वार्ड_संख्या"] || "").match(/\d+/);
                
                // If a ward number exists, parse it. If not, mark it as null.
                const numA = matchA ? parseInt(matchA[0], 10) : null;
                const numB = matchB ? parseInt(matchB[0], 10) : null;
                
                // Push records with NO ward number (null) to the very bottom
                if (numA === null && numB !== null) return 1;
                if (numB === null && numA !== null) return -1;
                if (numA === null && numB === null) return 0;
                
                // Normal ascending numerical sort (1, 2, 3...)
                return numA - numB;
            });
        }
        
        return members; // Default unsorted list
    };

    const displayMembers = getProcessedMembers();

    return (
        <>
            {/* Download Option Control Bar */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <button 
                    onClick={() => triggerPrint("normal")} 
                    style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                    Download Normal PDF
                </button>
                
                <button 
                    onClick={() => triggerPrint("serial")} 
                    style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                    Download Serial wise PDF (क्रमानुसार)
                </button>

                <button 
                    onClick={() => triggerPrint("ward")} 
                    style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                    Download Ward wise PDF (वार्ड अनुसार)
                </button>
            </div>

            {/* Document Printable Element Container */}
            <div ref={printRef} className="pdf-container" style={{ padding: "20px" }}>
                
                {/* CSS styles to guarantee crisp PDF grid lines */}
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
                        border: 1px solid #000000; /* Sharp clean grid borders */
                        padding: 10px;
                        text-align: left;
                    }

                    .pdf-container th {
                        background-color: #f2f2f2; 
                        font-weight: bold;
                    }
                `}</style>

                <h2 style={{ textAlign: "center" }}>
                    सदस्य सूची {printMode === "serial" && "(क्रमानुसार)"} {printMode === "ward" && "(वार्ड अनुसार)"}
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
