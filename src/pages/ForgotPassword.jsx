import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  // Form State
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // UI State
  const [step, setStep] = useState(1); // 1 = Send OTP, 2 = Verify & Reset
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setIsLoading(true);

    try {
      const response = await fetch('/aims_test/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, phoneNumber }),
      });

      if (response.ok) {
        setMessage('Code sent to your phone! Please check it.');
        setStep(2); // Move to next step
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send code.');
      }
    } catch (err) {
      setError('Server connection error.', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: VERIFY & RESET ---
  const handleReset = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setIsLoading(true);

    try {
      const response = await fetch('/aims_test/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            studentId, 
            otp, 
            newPassword 
        }),
      });

      if (response.ok) {
        setMessage('SUCCESS! Password changed. Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid code or error.');
      }
    } catch (err) {
      setError('Server connection error.', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password</h2>
        
        {/* Status Messages */}
        {error && <div className="error-msg" style={{color: 'red', background: '#ffebee', padding: '10px'}}>{error}</div>}
        {message && <div className="success-msg" style={{color: 'green', background: '#e8f5e9', padding: '10px'}}>{message}</div>}

        {/* --- FORM STEP 1: SEND CODE --- */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="login-form">
            <p>Enter your Student ID and Phone Number</p>
            <input
              type="text"
              className="form-input"
              placeholder="Student ID (e.g. HS001)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input"
              placeholder="Registered Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* --- FORM STEP 2: ENTER OTP & NEW PASSWORD --- */}
        {step === 2 && (
          <form onSubmit={handleReset} className="login-form">
             <p>Enter the 6-digit code sent to {phoneNumber}</p>
            <input
              type="text"
              className="form-input"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-input"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Change Password'}
            </button>
            <button 
                type="button" 
                onClick={() => setStep(1)} // Go back
                style={{background:'none', border:'none', color:'#666', marginTop:'10px', cursor:'pointer'}}
            >
                Start Over
            </button>
          </form>
        )}
        
        {step === 1 && (
            <button 
                type="button" 
                onClick={() => navigate('/login')} 
                style={{background: 'none', border: 'none', color: '#007bff', marginTop: '10px', cursor: 'pointer'}}
            >
                Back to Login
            </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;