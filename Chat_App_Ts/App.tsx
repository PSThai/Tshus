import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import TshusProvider from './common/context/tshus-context';
import ThemeContext from './common/context/theme-context';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
    
      <StackNavigator />
      <Toast />
    </>
  );
}
