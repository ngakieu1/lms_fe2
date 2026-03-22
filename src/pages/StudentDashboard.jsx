import { BookOpen, Clock, BarChart } from 'lucide-react';
import { Calendar, Award } from 'lucide-react';

const StudentDashboard = () => {
  // const [courses, setCourses] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [debugData, setDebugData] = useState(null); // To see raw backend response
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   // 1. Fetch Data
  //   api.get('/student/dashboard')
  //     .then(res => {
  //       console.log("BACKEND RESPONSE:", res.data); 
  //       setDebugData(res.data);
        
  //       // 2. Safety Check: Is it an array?
  //       if (Array.isArray(res.data)) {
  //         setCourses(res.data);
  //       } else if (res.data && Array.isArray(res.data.courses)) {
  //         // Sometimes backends return { courses: [...] }
  //         setCourses(res.data.courses);
  //       } else {
  //         console.error("Data format mismatch! Expected array, got:", typeof res.data);
  //         setError("Data format error: Backend did not return a list.");
  //       }
  //     })
  //     .catch(err => {
  //       console.error("API Error:", err);
  //       setError("Failed to load data. Is backend running?");
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  // if (loading) return <div style={{padding: '2rem'}}>Loading Dashboard...</div>;

  return (
      <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Xin chào, Học viên!</h2>
          
          {/* Các thẻ thống kê (Ví dụ) */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              
              <div style={cardStyle}>
                  <div style={iconBoxStyle}><BookOpen size={24} color="#007bff" /></div>
                  <div>
                      <h3 style={{ margin: 0, fontSize: '24px' }}>3</h3>
                      <p style={{ margin: 0, color: '#666' }}>Khóa học đang tham gia</p>
                  </div>
              </div>

              <div style={cardStyle}>
                  <div style={iconBoxStyle}><Calendar size={24} color="#28a745" /></div>
                  <div>
                      <h3 style={{ margin: 0, fontSize: '24px' }}>2</h3>
                      <p style={{ margin: 0, color: '#666' }}>Ca học hôm nay</p>
                  </div>
              </div>

              <div style={cardStyle}>
                  <div style={iconBoxStyle}><Award size={24} color="#f39c12" /></div>
                  <div>
                      <h3 style={{ margin: 0, fontSize: '24px' }}>9.5</h3>
                      <p style={{ margin: 0, color: '#666' }}>Điểm trung bình</p>
                  </div>
              </div>

          </div>

          {/* Vùng nội dung khác (Lịch học, Bài tập...) sẽ code thêm ở đây */}
          <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3>Lịch học tuần này</h3>
              <p style={{ color: '#888' }}>Chưa có dữ liệu lịch học...</p>
          </div>
      </div>
  );
};

// Style mẫu cho các thẻ card trông đẹp mắt hơn
const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    flex: 1,
    minWidth: '250px'
};

const iconBoxStyle = {
    width: '50px', height: '50px', 
    borderRadius: '50%', 
    background: '#f4f6f9', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    marginRight: '15px'
};

export default StudentDashboard;