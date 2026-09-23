import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaMapMarkedAlt, FaUserPlus, FaClock, FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recentMembers, setRecentMembers] = useState([]);
  const [wardDistribution, setWardDistribution] = useState([]);
  const [showAllWards, setShowAllWards] = useState(false); // Toggle state
  const [count, setCount] = useState({
    totalMembers: 0,
    totalWards: 0,
    totalArchived: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = ["bg-primary", "bg-success", "bg-info", "bg-warning", "bg-danger"];

  const handleDownloadPdf = async () =>{
    const response = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/pdf/members`,
        {
            responseType: "blob"
        }
    );

    console.log(response);

    const url = window.URL.createObjectURL(
        new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "members.pdf";

    link.click();
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Stats
        const countRes = await api.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/memberCount`);
        const statsData = countRes.data?.data || countRes.data || countRes;
        setCount({
          totalMembers: statsData.totalMembers || 0,
          totalWards: statsData.totalWards || 0,
          totalArchived: statsData.totalArchived || 0
        });

        // 2. Fetch Ward Data
        const wardRes = await api.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/wardWiseCount`);
        const wardMap = wardRes.data?.data || wardRes.data || wardRes;
        
        const formattedWards = Object.entries(wardMap).map(([name, val], index) => ({
          ward: name,
          count: val,
          color: colors[index % colors.length]
        })).sort((a, b) => b.count - a.count);

        setWardDistribution(formattedWards);

        // 3. Fetch Recent Members
        if (user?.role.includes('ADMIN')) {
          const recentRes = await api.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/recentMembers`);
          const recentData = recentRes.data?.data || recentRes.data || recentRes;
          setRecentMembers(Array.isArray(recentData) ? recentData : []);
        }

      } catch (err) {
        setError("डेटा लोड करने में विफल।");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  // Logic to determine which wards to display
  const displayedWards = showAllWards ? wardDistribution : wardDistribution.slice(0, 5);

  const stats = [
    { title: "Total Members", count: count.totalMembers, icon: <FaUsers />, color: "bg-primary", shadow: "0 10px 20px -10px rgba(13, 110, 253, 0.5)" },
    { title: "Active Wards", count: count.totalWards, icon: <FaMapMarkedAlt />, color: "bg-success", shadow: "0 10px 20px -10px rgba(25, 135, 84, 0.5)" },
    { title: "Past Members", count: count.totalArchived, icon: <FaUserPlus />, color: "bg-warning", shadow: "0 10px 20px -10px rgba(255, 193, 7, 0.5)" },
  ];

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <FaSpinner className="spinner-border text-primary me-2" />
      <span>लोड हो रहा है...</span>
    </div>
  );

  return (
    <div className="container-fluid py-2 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Society Overview</h3>
        <span className="text-muted small d-none d-sm-inline">
          <button className="btn btn-sm btn-primary p-2" onClick={handleDownloadPdf}>PDF LIST</button>
        </span>
      </div>

      {/* Top Stat Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div className="col-12 col-md-4" key={index}>
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex align-items-center">
                <div className={`${stat.color} text-white rounded-4 p-3 fs-3 me-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px', boxShadow: stat.shadow }}>
                  {stat.icon}
                </div>
                <div>
                  <h6 className="text-muted mb-1 small text-uppercase fw-bold">{stat.title}</h6>
                  <h3 className="fw-bold mb-0">{stat.count}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Added Members List */}
        {user?.role.includes('ADMIN') && (
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><FaClock className="me-2 text-primary" /> Recent Registrations</h5>
                <button className="btn btn-sm btn-light rounded-pill px-3" onClick={() => navigate('/members')}>View All</button>
              </div>
              <div className="card-body px-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr className="small text-muted text-uppercase">
                        <th className="ps-4">Member Name</th>
                        <th>Ward</th>
                        <th className="pe-4 text-end">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMembers.map((m, index) => (
                        <tr key={index} style={{ cursor: 'pointer' }} onClick={() => navigate(`/member/${m["सदस्य_नंबर"]}`)}>
                          <td className="ps-4 py-3 fw-bold">{m["नाम"]}</td>
                          <td><span className="badge bg-primary-subtle text-primary rounded-pill">{m["वार्ड_संख्या"]}</span></td>
                          <td className="pe-4 text-end text-muted small">{m.created_at ? new Date(m.created_at).toLocaleDateString('hi-IN') : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Ward Distribution with Show More */}
        <div className={`col-12 ${user?.role.includes('ADMIN') ? 'col-lg-5' : 'col-lg-12'}`}>
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0"><FaMapMarkedAlt className="me-2 text-success" /> Ward Distribution</h5>
              <span className="badge bg-success-subtle text-success rounded-pill">{wardDistribution.length} Wards</span>
            </div>
            <div className="card-body p-4">
              {displayedWards.length > 0 ? (
                <>
                  {displayedWards.map((w, index) => (
                    <div className="mb-4 animate__animated animate__fadeIn" key={index}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small fw-bold">{w.ward}</span>
                        <span className="badge bg-light text-dark">{w.count} members</span>
                      </div>
                      <div className="progress rounded-pill" style={{ height: '10px' }}>
                        <div 
                          className={`progress-bar ${w.color}`} 
                          style={{ width: `${(w.count / (count.totalMembers || 1)) * 100}%`, transition: 'width 1s' }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  {/* Show More / Less Button */}
                  {wardDistribution.length > 5 && (
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-link text-decoration-none fw-bold" 
                        onClick={() => setShowAllWards(!showAllWards)}
                      >
                        {showAllWards ? (
                          <>कम दिखाएं <FaChevronUp className="ms-1" /></>
                        ) : (
                          <>और दिखाएं ({wardDistribution.length - 5} और) <FaChevronDown className="ms-1" /></>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-muted">No ward data found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;