import React from 'react';
import { TshusContext } from './tshus-context';
import AuthProvider from '../../client/context/auth/context';
import { App, ConfigProvider } from 'antd';
import { colors, components } from '../utils/colors';
import { ThemeEnum } from '../enum/theme.enum';

interface Props {
  children: React.ReactNode;
}

const ThemeContext: React.FC<Props> = ({ children }: Props) => {
  // Tshus Context theme
  const tshusTheme: ThemeEnum =
    React.useContext<any>(TshusContext)?.config?.get?.theme;

  // Return
  return (
    // <ConfigProvider
    //   theme={{
    //     token: colors(tshusTheme),
    //     components: components(tshusTheme),
    //   }}
    // >

    <AuthProvider>{children}</AuthProvider>

    //  </ConfigProvider>
  );
};

export default ThemeContext;
