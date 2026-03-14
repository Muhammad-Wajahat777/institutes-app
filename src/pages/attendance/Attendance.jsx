import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Row, Col, Button, Statistic, message, DatePicker, Typography, Empty, Spin, Table, Tag } from "antd";
import { UserOutlined, CheckOutlined, CloseOutlined, SaveOutlined, CalendarOutlined, SwapOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import studentsApi from "../../api/studentsApi";
import attendanceApi from "../../api/attendanceApi";
import coursesApi from "../../api/coursesApi";

const { Title, Text } = Typography;

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attendance, setAttendance] = useState({});
  const queryClient = useQueryClient();
  const selectedDateStr = selectedDate.format('YYYY-MM-DD');

  // Fetch all students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesApi.getAll(),
  });

  // Filter active students only
  const activeStudents = useMemo(
    () => students.filter((student) => student.status?.toLowerCase() === 'active' && student.id !== null && student.id !== undefined),
    [students]
  );

  const courseNameById = useMemo(() => {
    const map = {};
    courses.forEach((course) => {
      map[course.id] = course.name;
    });
    return map;
  }, [courses]);

  const attendanceRows = useMemo(() => {
    return activeStudents.map((student) => ({
      ...student,
      key: student.id,
      fullName: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      courseName: courseNameById[student.courseId] || student.courseName || '-',
      isPresent: attendance[student.id] === true,
    }));
  }, [activeStudents, courseNameById, attendance]);

  const { data: attendanceByDate = {}, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', selectedDateStr],
    queryFn: () => attendanceApi.getByDate(selectedDateStr),
  });

  const saveAttendanceMutation = useMutation({
    mutationFn: ({ date, records }) => attendanceApi.saveByDate(date, records),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', selectedDateStr] });
      message.success('Attendance saved successfully!');
    },
    onError: (error) => {
      message.error(error?.message || 'Failed to save attendance');
    },
  });

  // Load existing attendance for selected date
  useEffect(() => {
    // Initialize active students with DB values for selected date, default absent.
    const initial = {};
    activeStudents.forEach((student) => {
      initial[student.id] = attendanceByDate[student.id] ?? false;
    });
    setAttendance(initial);
  }, [activeStudents, attendanceByDate]);

  // Update attendance when students change
  useEffect(() => {
    if (activeStudents.length > 0) {
      setAttendance(prev => {
        const updated = { ...prev };
        let changed = false;
        // Add any new students
        activeStudents.forEach(student => {
          if (updated[student.id] === undefined) {
            updated[student.id] = false;
            changed = true;
          }
        });
        return changed ? updated : prev;
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
    saveAttendanceMutation.mutate({ date: selectedDateStr, records: attendance });
  };

  // Calculate stats
  const totalStudents = activeStudents.length;
  const presentCount = Object.values(attendance).filter(v => v === true).length;
  const absentCount = totalStudents - presentCount;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 260,
      render: (_, record) => <Text strong>{record.fullName || '-'}</Text>,
    },
    {
      title: 'Roll No',
      dataIndex: 'rollNo',
      key: 'rollNo',
      width: 160,
      render: (value) => value || '-',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 240,
      render: (value) => value || '-',
    },
    {
      title: 'Status',
      key: 'status',
      width: 140,
      render: (_, record) => (
        <Tag color={record.isPresent ? 'green' : 'red'}>
          {record.isPresent ? 'Present' : 'Absent'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Button
          icon={<SwapOutlined />}
          onClick={() => toggleAttendance(record.id)}
          style={{ borderColor: record.isPresent ? '#ff4d4f' : '#52c41a' }}
        >
          Mark {record.isPresent ? 'Absent' : 'Present'}
        </Button>
      ),
    },
  ];

  if (isLoading || attendanceLoading || coursesLoading) {
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
          <Text type="secondary">Use the list below to mark attendance by date</Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <DatePicker 
            value={selectedDate}
            onChange={(value) => setSelectedDate(value || dayjs())}
            format="YYYY-MM-DD"
            suffixIcon={<CalendarOutlined />}
            style={{ width: 160 }}
          />
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            size="large"
            loading={saveAttendanceMutation.isPending}
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

      {/* Students List */}
      {activeStudents.length === 0 ? (
        <Empty description="No active students found" />
      ) : (
        <Card>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={attendanceRows}
            pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'] }}
            scroll={{ x: 900, y: 520 }}
          />
        </Card>
      )}
    </div>
  );
}
