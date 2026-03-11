import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function Reports() {
  return (
    <div>
      <Title level={3}>Reports</Title>
      <Paragraph type="secondary">
        View and generate analytical reports for your institute.
      </Paragraph>
    </div>
  );
}
