import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  CalculatorOutlined,
  BarChartOutlined,
  SettingOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import AdvancedDashboard from './AdvancedDashboard';
import ClientsManagement from './ClientsManagement';
import IngredientsManagement from './IngredientsManagement';
import FormulationInterface from './FormulationInterface';
import ReportsManagement from './ReportsManagement';
import SettingsManagement from './SettingsManagement';
import MinimalFormulation from './MinimalFormulation';
import RequirementsManager from './RequirementsManager';

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems: MenuItem[] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'clients', icon: <TeamOutlined />, label: 'Clientes' },
    { key: 'ingredients', icon: <ShoppingCartOutlined />, label: 'Ingredientes' },
    { key: 'formulation', icon: <CalculatorOutlined />, label: 'Formulação Avançada' },
    { key: 'minimal', icon: <BulbOutlined />, label: 'Formulação Simplificada' },
    { key: 'requirements', icon: <SettingOutlined />, label: 'Exigências Nutricionais' },
    { key: 'reports', icon: <BarChartOutlined />, label: 'Relatórios' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Configurações' },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdvancedDashboard />;
      case 'clients':
        return <ClientsManagement />;
      case 'ingredients':
        return <IngredientsManagement />;
      case 'formulation':
        return <FormulationInterface />;
      case 'minimal':
        return <MinimalFormulation />;
      case 'requirements':
        return <RequirementsManager />;
      case 'reports':
        return <ReportsManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <AdvancedDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={broken => {
          setCollapsed(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" style={{ height: '64px', margin: '16px', color: 'white', textAlign: 'center' }}>
          {collapsed ? 'Form' : 'Formulador Pro'}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => {
            setActiveSection(item.key);
          }
        }))} />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggleCollapsed,
            style: { padding: '0 24px', fontSize: '20px' }
          })}
          <Button type="primary" onClick={showDrawer} style={{ marginRight: '20px' }}>
            Open Drawer
          </Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
      <Drawer
        title="Configurações Rápidas"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={300}
      >
        <p>Some settings content here.</p>
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
