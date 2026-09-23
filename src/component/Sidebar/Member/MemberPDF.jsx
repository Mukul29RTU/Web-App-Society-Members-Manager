import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const MemberPDF = ({ members }) => {
    const printRef = useRef(null);
    console.log("Members in PDF:", members); // Debugging line to check the members prop
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Member Report"
    });

    return (
        <>
            <button onClick={handlePrint}>
                Download PDF
            </button>

            <div ref={printRef} className="pdf-container">

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
                        {members.map((member, index) => (
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