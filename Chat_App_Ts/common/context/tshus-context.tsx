import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ThemeEnum } from '../enum/theme.enum';
import { ConfigType } from '../types/other/config.type';
import { SocketProps } from '../types/other/socket.type';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TshusContext = createContext<any>(undefined);

interface Props {
  children: ReactNode;
}

interface ExtendedSocket extends Socket {
  auth: {
    user: string;
  };
}

const TshusProvider: FC<Props> = ({ children }: Props) => {
  // Config
  const [config, setConfig] = useState<ConfigType | null>(null);

  // Fetch config from async storage on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      // Default config
      const defaultConfig: ConfigType = { theme: ThemeEnum.LIGHT };

      // Get config from async storage
      const data = await AsyncStorage.getItem('config');

      // Try parsing the config data
      let parsedData: ConfigType | null;
      try {
        parsedData = data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("Failed to parse config data:", error);
        parsedData = null;
      }

      // Check and set config to async storage if not existing or failed to parse
      if (!parsedData) {
        await AsyncStorage.setItem('config', JSON.stringify(defaultConfig));
      }

      // Set the state
      setConfig(parsedData || defaultConfig);
    };

    fetchConfig();
  }, []);

  // Users onlines
  const [onlines, setOnlines] = useState<SocketProps[]>([]);

  // Stomp client state
  const [socket, setSocket] = useState<ExtendedSocket | null>(null);

  // Handle set config
  const handleSetConfig = async (key: string, value: any) => {
    if (!config) return;

    // New Config
    const newConfig: ConfigType = { ...config, [key]: value };

    // Set config
    setConfig(newConfig);

    // Set config to async storage
    await AsyncStorage.setItem('config', JSON.stringify(newConfig));
  };

  // Use Effect
  useEffect(() => {
    // Calling connecting
    const socket: ExtendedSocket = io(`http://172.20.10.2:2820`, {
      autoConnect: false,
    }) as ExtendedSocket;

    socket.on('users', (users: SocketProps[]) => {
      // Map online
      const mapOnlines = users.filter((u: SocketProps) => u.user !== socket.auth.user);

      // Set onlines
      setOnlines(mapOnlines);
    });

    // Set Client
    setSocket(socket);

    // Return clean
    return () => {
      // Disconnect Socket
      socket.disconnect();

      // Clean
      setSocket(null);

      // Clean onlines
      setOnlines([]);
    };
  }, []);

  // Shared Data
  const sharedData: any = {
    config: {
      get: config,
      set: handleSetConfig,
    },
    socket: { get: socket },
    online: onlines,
  };

  // Return
  return (
    <TshusContext.Provider value={sharedData}>{children}</TshusContext.Provider>
  );
};

export default TshusProvider;
