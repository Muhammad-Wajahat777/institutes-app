import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Divider,
  message,
} from 'antd';
import {
  UploadOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const defaultProfile = {
  instituteName: 'Al-Noor Institute of Technology',
  address: '45-B, University Road, Gulshan-e-Iqbal, Karachi',
  phone: '+92-21-34567890',
  email: 'info@alnoorinstitute.edu.pk',
  website: 'www.alnoorinstitute.edu.pk',
  description:
    'A premier institute dedicated to providing quality education in technology and sciences since 2005.',
  registrationNo: 'REG-2024-00145',
  principalName: 'Dr. Muhammad Asif Khan',
};

export default function InstituteProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    form.validateFields().then(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        message.success('Institute profile updated successfully!');
      }, 600);
    });
  };

  return (
    <div>
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
        }}
      >
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar
              size={80}
              icon={<BankOutlined />}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                fontSize: 36,
              }}
            />
          </Col>
          <Col flex="auto">
            <Text
              strong
              style={{ color: '#fff', fontSize: 22, display: 'block' }}
            >
              {defaultProfile.instituteName}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              Registration No: {defaultProfile.registrationNo}
            </Text>
          </Col>
          <Col>
            <Upload showUploadList={false} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />} ghost>
                Change Logo
              </Button>
            </Upload>
          </Col>
        </Row>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={defaultProfile}
        requiredMark="optional"
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="instituteName"
              label="Institute Name"
              rules={[{ required: true, message: 'Institute name is required' }]}
            >
              <Input
                prefix={<BankOutlined style={{ color: '#aaa' }} />}
                placeholder="Enter institute name"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="principalName"
              label="Principal / Director"
              rules={[{ required: true, message: 'Principal name is required' }]}
            >
              <Input placeholder="Enter principal name" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#aaa' }} />}
                placeholder="institute@example.com"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Phone is required' }]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: '#aaa' }} />}
                placeholder="+92-XXX-XXXXXXX"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="website" label="Website">
              <Input
                prefix={<GlobalOutlined style={{ color: '#aaa' }} />}
                placeholder="www.example.com"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="registrationNo" label="Registration Number">
              <Input placeholder="REG-XXXX-XXXXX" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Address is required' }]}
        >
          <Input
            prefix={<EnvironmentOutlined style={{ color: '#aaa' }} />}
            placeholder="Full address"
            size="large"
          />
        </Form.Item>

        <Form.Item name="description" label="About Institute">
          <TextArea
            rows={4}
            placeholder="Brief description of the institute..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Divider />

        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 12 }} onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleSave}
            size="large"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}
