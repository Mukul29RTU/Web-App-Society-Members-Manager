import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { FaSortNumericDown, FaChevronRight, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import MemberPDF from "./MemberPDF";


const MembersTable = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  
  if (user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="container-fluid py-5 text-center mt-5">
        <h3 className="text-danger fw-bold">Access Denied</h3>
        <p className="text-muted">Only admins have access to view past members.</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // States
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showPdf, setShowPdf] = useState(false);

  // Fetch All Data on Mount
useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        setLoading(true); // Always start by showing the spinner
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supabase/get/members`);
        
        // 2. Safely unwrap the data
        const actualData = response.data?.data || response.data || response;
        
        setMembers(Array.isArray(actualData) ? actualData : []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("डेटा लोड करने में विफल।");
        setLoading(false);
      }
    };

    // 3. CALL THE FUNCTION HERE
    fetchAllMembers(); 
    
  }, []);

  // Get unique wards for the dropdown
  const uniqueWards = ["All", ...new Set(members.map((m) => m["वार्ड_संख्या"]))]
    .filter(Boolean)
    .sort();

  // Filter and Sort Logic (Internal to Frontend)
  const filteredMembers = members
    .filter((m) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        m["नाम"]?.toLowerCase().includes(searchLower) ||
        String(m["संपर्क"] || "").includes(searchTerm) || String(m["सदस्य_नंबर"] || "").includes(searchTerm);

      const matchesWard =
        selectedWard === "All" || m["वार्ड_संख्या"] === selectedWard;

      return matchesSearch && matchesWard;
    })
    .sort((a, b) => {
      const snoA = parseInt(a["क्रमांक_संख्या"]) || 0;
      const snoB = parseInt(b["क्रमांक_संख्या"]) || 0;
      return sortOrder === "asc" ? snoA - snoB : snoB - snoA;
    });

  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  return (
    <div className="container-fluid py-4">

        {showPdf && (
                <MemberPDF
                    members={members}
                />
               
            )}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        {/* Header Section */}
        <div className="card-header bg-primary text-white p-4 border-0">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-4">
              <h3 className="mb-0 fw-bold">समाज के सदस्य</h3>
              <small className="opacity-75">कुल सदस्य: {members.length}</small>
              <button className="btn btn-warning btn-sm ms-3" onClick={() => setShowPdf(true)}>
                PDF
              </button>
            </div>
            <div className="col-12 col-md-8 col-lg-5">
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="नाम या मोबाइल से खोजें..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 col-lg-3 d-flex gap-2">
              <select
                className="form-select border-0 shadow-none"
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                <option value="All">सभी वार्ड</option>
                {uniqueWards
                  .filter((w) => w !== "All")
                  .map((w) => (
                    <option key={w} value={w}>
                      वार्ड {w}
                    </option>
                  ))}
              </select>
              <button
                className="btn btn-light"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <FaSortNumericDown />
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="card-body p-0" style={{ minHeight: "400px" }}>
          {loading ? (
            <div
              className="d-flex flex-column justify-content-center align-items-center"
              style={{ height: "400px" }}
            >
              <FaSpinner className="spinner-border text-primary mb-3" />
              <h5 className="text-primary">लोड हो रहा है...</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-secondary small text-uppercase">
                  <tr>
                    <th className="ps-4">सदस्य नंबर</th>
                    <th>क्रमांक</th>
                    <th>नाम</th>
                    <th>पता</th>
                    <th>संपर्क</th>
                    <th>वार्ड</th>
                    <th>Email</th>
                    <th className="text-end pe-4">विवरण</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, index) => (
                    <tr
                      key={member["सदस्य_नंबर"] || index}
                      onClick={() =>
                        navigate(`/member/${member["सदस्य_नंबर"]}`, {
                          state: {
                            myData: "present_member",
                          },
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td className="ps-4">{member["सदस्य_नंबर"]}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary">
                          {member["क्रमांक_संख्या"]}
                        </span>
                      </td>
                      <td className="fw-bold">{member["नाम"]}</td>
                      <td className="small text-muted">{member["पता"]}</td>
                      <td>{member["संपर्क"]}</td>
                      <td>{member["वार्ड_संख्या"]}</td>
                      
                        <td>{member.email}</td>
                      <td className="text-end pe-4 text-primary">
                        <FaChevronRight />
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        कोई सदस्य नहीं मिला।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersTable;
