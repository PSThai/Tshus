import { Layout, theme } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

// Use Token
const { useToken } = theme;

const Base: React.FC = () => {
  // Toeken
  const { token } = useToken();

  // Return
  return (
    <Layout className="h-100" style={{ background: token.colorBgBase }}>
      <Outlet />
    </Layout>
  );
};

export default Base;
