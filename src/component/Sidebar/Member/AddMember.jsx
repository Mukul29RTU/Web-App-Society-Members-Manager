import React, { useState } from 'react';
import { FaUserPlus, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const AddMember = () => {
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

  // 1. Keys match the Java Entity variables exactly
  const [formData, setFormData] = useState({
    "सदस्य_नंबर": ' ',
    "पूर्ण_जानकारी":  '',
    "क्रमांक": "क्र.",
    "क्रमांक_संख्या": '',
    "नाम_शीर्षक": 'श्री',
    "नाम": '',
    "पिता_शीर्षक": 'श्री',
    "पिता_का_नाम": '',
    "पहचान": '',
    "पता": '',
    "संपर्क": '',
    "वार्ड_संख्या": '',
    "email": '',
  });

  const combinedData = {
    ...formData,
    "क्रमांक_संख्या": `क्र. ${formData.सदस्य_नंबर}`,
    "पूर्ण_जानकारी": `क्र. ${formData.सदस्य_नंबर} ${formData.नाम_शीर्षक} ${formData.नाम} ${formData.पिता_शीर्षक} ${formData.पिता_का_नाम} ${formData.पहचान} ${formData.पता} ${formData.संपर्क} वार्ड ${formData.वार्ड_संख्या}`,
    "वार्ड_संख्या": `वार्ड ${formData.वार्ड_संख्या}`,
    "नाम" : `${formData.नाम_शीर्षक}  ${formData.नाम} ${"पुत्र"} ${formData.पिता_शीर्षक}  ${formData.पिता_का_नाम}`,
  };

  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // For numeric fields, ensure we send numbers to Java if possible
    const finalValue = (name === "सदस्य_नंबर" || name === "संपर्क") ? Number(value) : value;
    
    setFormData({ ...formData, [name]: finalValue });
  };

  // 2. Actual POST API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/supabase/add`, combinedData);

      if (response) {
        alert("सदस्य का डेटा सफलतापूर्वक सुरक्षित कर लिया गया है!");
        navigate('/members'); 
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("डेटा सेव करने में समस्या आई। कृपया चेक करें कि सदस्य नंबर पहले से मौजूद तो नहीं है।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold mb-0 text-dark">
          <FaUserPlus className="me-2 text-primary" /> नया सदस्य जोड़ें
        </h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> वापस जाएं
        </button>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              
              {/* सदस्य नंबर (ID) */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">सदस्य नंबर (ID)</label>
                <input 
                  type="number" name="सदस्य_नंबर" className="form-control" 
                  placeholder="e.g. 101" required 
                  onChange={handleChange} 
                />
              </div>

              {/* नाम */}
              <div className="col-md-8">
                <label className="form-label fw-semibold">नाम</label>
                <div className="input-group"></div>
                <select className="form-select flex-grow-0" style={{width: '100px'}} name="नाम_शीर्षक" onChange={handleChange}>
                    <option value="श्री">श्री</option>
                    <option value="श्रीमती">श्रीमती</option>
                    <option value="सुश्री">सुश्री</option>
                  </select>
                  
                <input 
                  type="text" name="नाम" className="form-control" 
                  placeholder="पूरा नाम दर्ज करें" required 
                  onChange={handleChange} 
                />
                </div>
              </div>

               <div className="col-md-8">
                <label className="form-label fw-semibold">पिता/माता का नाम</label>
                <div className="input-group">
                <select className="form-select flex-grow-0" style={{width: '120px'}} name="पिता_शीर्षक" onChange={handleChange}>
                    <option value="श्री">श्री</option>
                    <option value="श्रीमती">श्रीमती</option>
                    <option value="स्वर्गीय श्री">स्वर्गीय श्री</option>
                  </select>
                <input 
                  type="text" name="पिता_का_नाम" className="form-control" 
                  placeholder="पूरा नाम दर्ज करें" required 
                  onChange={handleChange} 
                />
                
              </div>

              {/* क्रमांक संख्या */}
              {/* <div className="col-md-6">
                <label className="form-label fw-semibold">क्रमांक संख्या</label>
                <input 
                  type="text" name="क्रमांक_संख्या" className="form-control" 
                  placeholder="e.g. 12/A" required 
                  onChange={handleChange} 
                />
              </div> */}

              {/* वार्ड संख्या */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">वार्ड संख्या</label>
                <input 
                  type="text" name="वार्ड_संख्या" className="form-control" 
                  placeholder="e.g. 05" 
                  onChange={handleChange} 
                />
              </div>

              {/* मोबाइल नंबर */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">संपर्क (मोबाइल)</label>
                <input 
                  type="tel" name="संपर्क" className="form-control" 
                  placeholder="10 अंकों का नंबर" 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input 
                  type="text" name="email" className="form-control" 
                  placeholder="Email Address" 
                  onChange={handleChange} 
                />
              </div>

              {/* पहचान */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">पहचान</label>
                <input 
                  type="text" name="पहचान" className="form-control" 
                  placeholder="पिता/पति का नाम या अन्य पहचान" 
                  onChange={handleChange} 
                />
              </div>

              {/* पता */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">पता</label>
                <textarea 
                  name="पता" className="form-control" rows="2" 
                  placeholder="स्थायी पता दर्ज करें" 
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* पूर्ण जानकारी */}
              {/* <div className="col-md-12">
                <label className="form-label fw-semibold">पूर्ण जानकारी</label>
                <textarea 
                  name="पूर्ण_जानकारी" className="form-control" rows="2" 
                  placeholder="अतिरिक्त विवरण" 
                  onChange={handleChange}
                ></textarea>
              </div> */}

              {/* Submit Button */}
              <div className="col-12 mt-4 text-end">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg px-5 rounded-pill shadow"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <FaSave className="me-2" />
                  )}
                  डेटा सुरक्षित करें
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;