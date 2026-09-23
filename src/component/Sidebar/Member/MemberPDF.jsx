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

    // Prepare data dynamically based on the selected mode
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
                // 1. Extract ward numbers (e.g., extracts 9 from "वार्ड_संख्या 9")
                const matchWardA = String(a["वार्ड_संख्या"] || "").match(/\d+/);
                const matchWardB = String(b["वार्ड_संख्या"] || "").match(/\d+/);
                
                const wardA = matchWardA ? parseInt(matchWardA, 10) : null;
                const wardB = matchWardB ? parseInt(matchWardB, 10) : null;
                
                // 2. Extract serial numbers for sub-sorting
                const serialA = parseInt(a["सदस्य_नंबर"], 10) || 0;
                const serialB = parseInt(b["सदस्य_नंबर"], 10) || 0;

                // Rule A: If a ward number is missing, throw those members to the very bottom
                if (wardA === null && wardB !== null) return 1;  
                if (wardB === null && wardA !== null) return -1; 
                
                // Rule B: If both are missing ward numbers, sub-sort them by serial number at the bottom
                if (wardA === null && wardB === null) {
                    return serialA - serialB;
                }
                
                // Rule C: If they are in the SAME ward, sort them by serial number (सदस्य_नंबर)
                if (wardA === wardB) {
                    return serialA - serialB;
                }
                
                // Rule D: Normal ascending ward number sort (1, 2, 3...)
                return wardA - wardB;
            });
        }
        
        return members; // Return the unsorted array for normal mode
    };

    const displayMembers = getProcessedMembers();

    return (
        <>
            {/* Download Options Panel */}
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

            {/* Printable Layout Container */}
            <div ref={printRef} className="pdf-container" style={{ padding: "20px" }}>
                
                {/* Embedded printing rules for crisp table grid borders */}
                <style>{`
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                    
                    .pdf-container table {
                        width: 80%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        font-family: Arial, sans-serif;
                    }

                    .pdf-container th, 
                    .pdf-container td {
                        border: 1px solid #000000; /* Sharp layout grid boundaries */
                        padding: 20px;
                        text-align: left;
                        text-wrap: break-word; /* Ensure long text wraps within cells */
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
                            <th>पूर्ण जानकारी</th>
                            {/* <th>क्रमांक</th>
                            <th>नाम</th>
                            <th>पता</th>
                            <th>मोबाइल</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {displayMembers && displayMembers.map((member, index) => (
                            <tr key={member["सदस्य_नंबर"] ?? index}>
                            <td>{"क्र." + member["सदस्य_नंबर"]} {member["नाम"]}  {member["पहचान"]} {member["पता"]} {member["संपर्क"]} {members["वार्ड_संख्या"]}</td>
                                {/* <td>{member["सदस्य_नंबर"]}</td>
                                <td>{member["नाम"]}</td>
                                <td>{member["पता"]}</td>
                                <td>{member["संपर्क"]}</td> */}
                            </tr>
                        ))}
                    </tbody>

                
                </table>

            </div>
        </>
    );
};

export default MemberPDF;
