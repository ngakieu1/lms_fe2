import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login-image.png';
import {FaEye, FaEyeSlash} from 'react-icons/fa';

const Login = ({setAuth}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async(e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/aims_test/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok){
                const data = await response.json();
                //1. Save tokens
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken); //for logout
                localStorage.setItem('userRole', data.role);
                //2. Set state
                setAuth({
                    isAuthenticated: true,
                    role: data.role
                });
                //3. Redirect based on role
                if (data.role === 'ADMIN') navigate('/admin');
                else if (data.role === 'TEACHER') navigate('/teacher');
                else navigate('/student'); 
            } else {
                setError('Invalid credentials.');
            }
        } catch (err) {
            setError('Cannot connect to server. Is the backend running?');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };
    return(
        <div style={styles.container}>
            <div style={styles.card}>
                <div className='login-image-section'>
                    <img src={loginImage} alt="Login" style={{width: '100%', marginBottom: '1rem'}} className='login-image' />
                </div>
                <h2>LMS Portal</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    />
                    <div style={styles.passwordWrapper}>
                     <input
                       type={showPassword ? "text" : "password"}
                       placeholder="Password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                       style={styles.passwordInput}
                    />
                    <span onClick={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    </div>
                    <div style={{marginTop: '1rem', fontSize: '0.9rem'}}>
                        <span style={{color: '#666'}}>Quên mật khẩu? </span>
                        <span 
                            onClick={() => navigate('/forgot-password')} 
                            style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold'}}
                        >
                            Lấy lại mật khẩu
                        </span>
                    </div>
                    <button type="submit" style={{...styles.button, opacity: isLoading ? 0.7 : 1}} disabled={isLoading}>{isLoading ? 'Signing In...' : 'Login'} </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  card: { padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' },
  input: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  error: { color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid #ffcdd2' },
  passwordWrapper: {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '0 10px',
  backgroundColor: '#fff'
},
passwordInput: {
  flex: 1,
  border: 'none',
  outline: 'none',
  padding: '10px',
  fontSize: '1rem'
},
eyeIcon: {
  cursor: 'pointer',
  color: '#666',

}
};

export default Login;