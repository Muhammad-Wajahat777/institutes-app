import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Row, Col, Button, Statistic, message, DatePicker, Typography, Empty, Spin } from "antd";
import { UserOutlined, CheckOutlined, CloseOutlined, SaveOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import studentsApi from "../../api/studentsApi";

const { Title, Text } = Typography;

// Mock attendance API (since we don't have a real backend for attendance)
const attendanceApi = {
  getByDate: (date) => {
    const stored = localStorage.getItem(`attendance_${date}`);
    return stored ? JSON.parse(stored) : null;
  },
  save: (date, records) => {
    localStorage.setItem(`attendance_${date}`, JSON.stringify(records));
    return { success: true };
  }
};

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attendance, setAttendance] = useState({});
  const queryClient = useQueryClient();

  // Fetch all students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await studentsApi.getAll();
      return response.data;
    },
  });

  // Filter active students only
  const activeStudents = students.filter(student => 
    student.status?.toLowerCase() === 'active'
  );

  // Load existing attendance for selected date
  useEffect(() => {
    const dateStr = selectedDate.format('YYYY-MM-DD');
    const existing = attendanceApi.getByDate(dateStr);
    
    if (existing) {
      setAttendance(existing);
    } else {
      // Initialize all students as absent (false)
      const initial = {};
      activeStudents.forEach(student => {
        initial[student.id] = false;
      });
      setAttendance(initial);
    }
  }, [selectedDate, activeStudents]);

  // Update attendance when students change
  useEffect(() => {
    if (activeStudents.length > 0) {
      setAttendance(prev => {
        const updated = { ...prev };
        // Add any new students
        activeStudents.forEach(student => {
          if (updated[student.id] === undefined) {
            updated[student.id] = false;
          }
        });
        return updated;
      });
    }
  }, [activeStudents]);

  // Toggle attendance status
  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // Save attendance
  const saveAttendance = () => {
    const dateStr = selectedDate.format('YYYY-MM-DD');
    attendanceApi.save(dateStr, attendance);
    message.success('Attendance saved successfully!');
  };

  // Calculate stats
  const totalStudents = activeStudents.length;
  const presentCount = Object.values(attendance).filter(v => v === true).length;
  const absentCount = totalStudents - presentCount;

  // Get student name
  const getStudentName = (student) => {
    return `${student.firstName} ${student.lastName}`;
  };

  // Get student initials for avatar
  const getInitials = (student) => {
    const first = student.firstName?.[0] || '';
    const last = student.lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Mark Attendance</Title>
          <Text type="secondary">Click on a student card to mark attendance</Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <DatePicker 
            value={selectedDate}
            onChange={setSelectedDate}
            format="YYYY-MM-DD"
            suffixIcon={<CalendarOutlined />}
            style={{ width: 160 }}
          />
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            size="large"
            onClick={saveAttendance}
          >
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Active Students" 
              value={totalStudents} 
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Present" 
              value={presentCount} 
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Absent" 
              value={absentCount} 
              prefix={<CloseOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Students Grid */}
      {activeStudents.length === 0 ? (
        <Empty description="No active students found" />
      ) : (
        <Row gutter={[16, 16]}>
          {activeStudents.map((student) => {
            const isPresent = attendance[student.id] === true;
            
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={student.id}>
                <Card
                  hoverable
                  onClick={() => toggleAttendance(student.id)}
                  style={{
                    borderColor: isPresent ? '#52c41a' : '#ff4d4f',
                    background: isPresent ? '#f6ffed' : '#fff2f0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    borderWidth: 2,
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{ textAlign: 'center' }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: isPresent ? '#52c41a' : '#ff4d4f',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                    >
                      {isPresent ? <CheckOutlined style={{ fontSize: 24 }} /> : getInitials(student)}
                    </div>
                    
                    {/* Name */}
                    <Text strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>
                      {getStudentName(student)}
                    </Text>
                    
                    {/* Roll Number */}
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                      {student.rollNo}
                    </Text>
                    
                    {/* Status Badge */}
                    <div
style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 12,
                        background: isPresent ? '#52c41a' : '#ff4d4f',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {isPresent ? 'Present' : 'Absent'}
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
