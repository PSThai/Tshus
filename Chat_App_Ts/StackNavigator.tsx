import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Login from "./client/Screen/Login"
import Register from './client/Screen/Register';
import Profile from './client/Screen/Profile';
import Contact from 'client/Screen/Contact';
import Add_Friend from './client/Screen/Add_Friend';
import Message from 'client/Screen/chat_layout/component/Message';
import AuthProvider, { AuthContext } from 'client/context/auth/context';
import Chat_Side from './client/Screen/chat_layout/component/Chat_Side';
import ConversationsProvider from 'client/context/conversations-context';
import TshusProvider from 'common/context/tshus-context';
import ThemeContext from 'common/context/theme-context';
import CreateGroup from 'client/Screen/CreateGroup';
import FriendAcceptList from 'client/Screen/friendAcceptList/FriendAcceptList';
import OtpScreen from 'client/Screen/OtpScreen';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from "react-native-toast-message"
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const [user, setUser] = useState();
    return (
        <NavigationContainer>

            <TshusProvider>
                <ThemeContext>
                    <AuthProvider>
                        <ConversationsProvider>
                            <MenuProvider>
                                <Toast />
                                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                                    <Stack.Screen name='Login' component={Login} />
                                    <Stack.Screen name='OtpScreen' component={OtpScreen} />
                                    <Stack.Screen name='Register' component={Register} />
                                    <Stack.Screen name='Chat' component={Chat_Side} />
                                    <Stack.Screen name='Profile' component={Profile} />
                                    <Stack.Screen name='Contact' component={Contact} />
                                    <Stack.Screen name='Add_friend' component={Add_Friend} />
                                    <Stack.Screen name='CreateGroup' component={CreateGroup} />
                                    <Stack.Screen name='FriendAcceptList' component={FriendAcceptList} />
                                    <Stack.Screen name='Message' component={Message} />
                                </Stack.Navigator>
                            </MenuProvider>
                        </ConversationsProvider>
                    </AuthProvider>
                </ThemeContext>
            </TshusProvider>

        </NavigationContainer >
    )
}

export default StackNavigator

const styles = StyleSheet.create({})