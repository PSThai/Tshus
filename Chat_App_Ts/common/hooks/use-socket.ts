import React from 'react';
import { TshusContext } from '../context/tshus-context';

// Use Auth
export const useSocket = () => React.useContext<any>(TshusContext)?.socket.get;
