import React from 'react';
import { TshusContext } from '../context/tshus-context';

// Use Message
export const useConfig: Function = () =>
  React.useContext<any>(TshusContext)?.config;
