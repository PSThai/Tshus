import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// import { useAuth } from '../hooks/use-auth';
// import authService from '../context/auth/services';
import { fetcher } from 'common/utils/fetcher';
import { Response } from 'common/types/res/response.type';
import { getAsyncStorage, setAsyncStorage } from '../../common/utils/cookie';
import { useAuth } from 'client/hooks/use-auth';
import authServices from 'client/context/auth/services'
import { login } from 'client/context/auth/reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
// import { login } from '../context/auth/reducers';

const Login = () => {
    
    const nav = useNavigation();
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");

    // User uath
    const auth: any = useAuth();
    const [loading, setLoading] = useState<Boolean>(false);

    type NavType = {
        navigate: (screen: string) => void;
    }

    const goToChat = async (nav: NavType) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!regexEmail.test(email)) {
            Toast.show({
                type:'error',
                text1:"Đăng nhập thất bại", 
                text2:"Email không đúng định dạng vui lòng nhập lại!",
                visibilityTime:1000
            })
           
        }
        // Result
        const loged = await authServices.login({
            email: email,
            password: password,
        });
        setLoading(true);
        // Save data
        if (loged?.user) {
            const accessToken = getAsyncStorage('token');
            // Set data
            auth.set(login({ ...loged?.user, isAuthenticated: true }));
            Toast.show({
                type: 'success',
                text1: "Đăng nhập thành công",
                visibilityTime:1000
              })
            nav.navigate("Chat")
        } else {
            console.log("login fail");
        }

    }

    // Assuming `nav` is of type NavType
    const goRegister = (nav: NavType) => {
        nav.navigate("OtpScreen");
    }

    return (
        <View style={{
            height: "100%",
            width: "100%",
            backgroundColor: "white",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Image style={{ height: "100%", width: "100%", position: 'absolute' }} source={require('../../assets/background.png')} />
            <View style={{
                height: "100%",
                width: "100%",
                flex: 2,
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 70
            }}>
                <View style={{ flex: 1, paddingTop: 170 }}>
                    <Text style={{
                        color: "#FFF",
                        fontWeight: 'bold',
                        fontSize: 55,
                    }}>TSHUS</Text>
                </View>


                <TextInput
                    style={{
                        width: "85%",
                        height: 55,
                        backgroundColor: "#ced4da",
                        borderRadius: 10,
                        margin: 13,
                        justifyContent: "center",
                        padding: 20,
                        marginBottom: 15
                    }}
                    value={email}
                    onChangeText={(text) => setemail(text)}
                    placeholder="Email"
                    placeholderTextColor="gray"
                />
                <TextInput
                    style={{
                        width: "85%",
                        height: 55,
                        backgroundColor: "#ced4da",
                        borderRadius: 10,
                        margin: 13,
                        justifyContent: "center",
                        padding: 20,
                        marginBottom: 15
                    }}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    placeholder="Mật khẩu"
                    placeholderTextColor="gray"

                />
                <TouchableOpacity style={{ paddingLeft: 260, paddingBottom: 30 }}>
                    <Text style={{ fontStyle: "italic", fontSize: 12 }}>
                        Quên mật khẩu ?
                    </Text>

                    <View style={{ borderWidth: 0.6, borderColor: "black" }}></View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => goToChat(nav)} style={{
                    width: '50%',
                    height: 55,
                    borderRadius: 20,
                    overflow: 'hidden', // Ensure the gradient is contained within the button's border radius
                    marginTop: 30,
                }}>
                    <LinearGradient
                        colors={['#38A2CF', '#156DBA']}
                        start={[0, 0]}
                        end={[1, 2]}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 16,
                        }}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row',
                    marginTop: 30,
                }}>
                    <Text style={{}}>Bạn chưa có tài khoản ? </Text>
                    <TouchableOpacity style={{}} onPress={() => goRegister(nav)}>
                        <Text style={{ color: "#3399FF" }}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default Login

const styles = StyleSheet.create({

})