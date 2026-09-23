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

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const MemberPDF = ({ members }) => {
    const printRef = useRef(null);
  
    // Updated for react-to-print v3 specification
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: "Member Report"
    });

    return (
        <>
            <button 
                onClick={handlePrint} 
                style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}
            >
                Download PDF
            </button>

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
                    सदस्य सूची
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
                        {members && members.map((member, index) => (
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
