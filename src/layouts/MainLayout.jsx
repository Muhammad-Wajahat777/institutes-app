import { useState } from "react";
import { Layout, Menu, theme, Typography } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/students",
    icon: <TeamOutlined />,
    label: "Students",
  },
  {
    key: "/teachers",
    icon: <UserOutlined />,
    label: "Teachers",
  },
  {
    key: "/courses",
    icon: <BookOutlined />,
    label: "Courses",
  },
  {
    key: "/attendance",
    icon: <CalendarOutlined />,
    label: "Attendance",
  },
  {
    key: "/fees",
    icon: <DollarOutlined />,
    label: "Fee Management",
  },
  {
    key: "/reports",
    icon: <BarChartOutlined />,
    label: "Reports",
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Title
            level={4}
            style={{
              color: "#fff",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {collapsed ? "🎓" : "🎓 Institute"}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              onClick={() => setCollapsed(false)}
              style={{ fontSize: 18, cursor: "pointer" }}
            />
          ) : (
            <MenuFoldOutlined
              onClick={() => setCollapsed(true)}
              style={{ fontSize: 18, cursor: "pointer" }}
            />
          )}
          <Title level={4} style={{ margin: 0 }}>
            Institute Management System
          </Title>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
