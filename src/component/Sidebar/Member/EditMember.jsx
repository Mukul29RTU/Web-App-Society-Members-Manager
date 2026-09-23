import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const EditMember = () => {
  const { id } = useParams(); // Gets the member ID from the URL (e.g., /edit/101)
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="container-fluid py-5 text-center mt-5">
        <h3 className="text-danger fw-bold">Access Denied</h3>
        <p className="text-muted">Only admins have access to use this feature.</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    "सदस्य_नंबर": '',
    "नाम": '',
    "पहचान": '',
    "पता": '',
    "संपर्क": '',
    "वार्ड_संख्या": '',
    "क्रमांक": "क्र.",
    "क्रमांक_संख्या": '',
    "email": '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch data on component load
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/supabase/getUserById/${id}`);
        const data = response;

        setFormData({
          ...data,
            "सदस्य_नंबर": data.सदस्य_नंबर || '',
            "नाम": data.नाम || '',   
            "पता": data.पता || '',
            "पहचान": data.पहचान || '',
            "वार्ड_संख्या": data.वार्ड_संख्या ? data.वार्ड_संख्या.replace('वार्ड ', '') : '',
            "संपर्क": data.संपर्क || '',
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching member:", error);
        alert("डेटा लोड करने में विफल।");
        navigate('/members');
      }
    };
    fetchMember();
  }, [id, navigate]);

//   2. Prepare combined data for submission (Same logic as Add Form)
  const prepareDataForSubmission = () => {
    const full_name = `${formData.नाम}`;
    const ward_info = `वार्ड ${formData.वार्ड_संख्या}`;
    const serial_info = `क्र. ${formData.सदस्य_नंबर}`;

    return {
      ...formData,
      "सदस्य_नंबर": formData.सदस्य_नंबर,
      "क्रमांक": "क्र.",
      "नाम": `${formData.नाम}`,
      "वार्ड_संख्या": ward_info,
      "क्रमांक_संख्या": serial_info,
      "पहचान": formData.पहचान,
      "पता": formData.पता,
      "संपर्क": formData.संपर्क,
      "पूर्ण_जानकारी": `${serial_info} - ${full_name}, (${formData.पहचान}), ${formData.पता}, ${formData.संपर्क}, ${ward_info}`,
      "email": formData.email,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = (name === "सदस्य_नंबर" || name === "संपर्क") ? Number(value) : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const dataToSubmit = prepareDataForSubmission();

    try {
      // Using POST or PUT depending on your Spring Boot Controller
      await api.put(`${import.meta.env.VITE_API_BASE_URL}/supabase/update`, dataToSubmit);
      alert("डेटा सफलतापूर्वक अपडेट किया गया!");
      navigate('/members'); 
    } catch (error) {
      console.error("Update Error:", error);
      alert("अपडेट करने में त्रुटि आई।");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold mb-0 text-dark">
          <FaEdit className="me-2 text-warning" /> सदस्य डेटा अपडेट करें
        </h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> वापस जाएं
        </button>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              
              <div className="col-md-4">
                <label className="form-label fw-semibold">सदस्य नंबर (ID)</label>
                <input type="number" name="सदस्य_नंबर" className="form-control bg-light" value={formData.सदस्य_नंबर} readOnly />
                <small className="text-muted">ID बदला नहीं जा सकता</small>
              </div>

              <div className="col-md-8">
                <label className="form-label fw-semibold">नाम</label>
                <div className="input-group">
                  <input type="text" name="नाम" className="form-control" value={formData.नाम} required onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">वार्ड संख्या</label>
                <input type="text" name="वार्ड_संख्या" className="form-control" value={formData.वार्ड_संख्या} required onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">संपर्क (मोबाइल)</label>
                <input type="tel" name="संपर्क" className="form-control" value={formData.संपर्क} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">पहचान</label>
                <input type="text" name="पहचान" className="form-control" value={formData.पहचान}  onChange={handleChange} />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-semibold">पता</label>
                <textarea name="पता" className="form-control" rows="2" value={formData.पता}  onChange={handleChange}></textarea>
              </div>

              <div className="col-md-12">
                <label className="form-label fw-semibold">Email Address</label>
                <textarea name="email" className="form-control" rows="2" value={formData.email} onChange={handleChange}></textarea>
              </div>

              <div className="col-12 mt-4 text-end">
                <button type="submit" className="btn btn-warning btn-lg px-5 rounded-pill shadow fw-bold" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <FaSave className="me-2" />}
                  अपडेट करें
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMember;