import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import authServices from "../context/auth/services"
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { fetcher } from 'common/utils/fetcher';

type NavType = {
    navigate: (screen: string, email: any) => void;
}
const OtpScreen = () => {

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false); // State để kiểm soát việc hiển thị của OtpInput
    // Assuming `nav` is of type NavType
    const goRegister = (nav: NavType) => {
        nav.navigate("Register", { email });
    }

    const nav = useNavigation();

    const handleSendOTP = async () => {

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!regexEmail.test(email)) {
            Toast.show({
                type: 'error',
                text1: "Gửi OTP không thành công",
                text2: "Email không đúng định dạng vui lòng nhập lại!",
                visibilityTime: 1000
            })
        } else {
            // Xử lý logic gửi OTP ở đây
            // Created
            const result = await fetcher({
                method: 'POST',
                url: '/auth/verify/create',
                payload: { email },
            });
            
            // Sau khi gửi OTP, hiện OtpInput để nhập mã OTP
            if (result?.status == 200) {
                Toast.show({
                    type: 'success',
                    text1: "Gửi OTP thành công",
                    visibilityTime: 1000
                })
                setShowOtpInput(true);
            } else {
                console.error('Send OTP failed');
            }
        }
    };

    const handleverifyOTP = async () => {

        const isOTPValid = await fetcher({
            method: 'POST',
            url: '/auth/verify/check',
            payload: { otp, email },
          });
        

        // setShowOtpInput(false);
        if (isOTPValid?.status == 200) {
            setShowOtpInput(false);
            goRegister(nav)

        } else {
            console.error('Invalid OTP');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={{ height: "100%", width: "100%", position: 'absolute' }}
                source={require('../../assets/background.png')}
            />
            <View style={{ flex: 1, paddingTop: 150 }}>

                <Text style={{
                    color: '#FFF',
                    fontWeight: 'bold',
                    fontSize: 55,
                }}>Đăng Ký</Text>

            </View>

            {showOtpInput ? ( // Hiển thị OtpInput
                <View
                    style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                    <View
                        style={{
                            marginVertical: 22,
                            width: '80%'
                        }}>
                        <OtpInput
                            numberOfDigits={6}
                            onTextChange={(text) => setOtp(text)} />
                    </View>


                    <View style={styles.textfooter}>
                        <Text style={{}}>Không nhận được mã !</Text>
                        <TouchableOpacity style={{}}>
                            <Text style={{ color: '#3399FF' }}>Gửi lại</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.loginbtn} onPress={handleverifyOTP}>
                            <Text style={styles.btntext}>Xác Nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            ) : (
                <View style={{ paddingBottom: 200, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%', }}>
                        <TextInput
                            style={{
                                backgroundColor: '#ced4da', height: 50, borderRadius: 10, padding: 10
                            }}
                            placeholder="Nhập email..."
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleSendOTP}
                        style={{
                            backgroundColor: '#3399FF',
                            marginTop: 20,
                            height: 50,
                            width: 80,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 15 }}>Nhận OTP</Text>
                    </TouchableOpacity>
                </View>
            )
            }

        </View>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%",
        width: "100%",
        backgroundColor: "white",
    },
    loginbtn: {
        width: 250,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#1890FF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        marginTop: 100
    },
    textfooter: {
        marginTop: 10,
        flexDirection: 'row'
    },
    btntext: {
        fontSize: 23,
        color: 'white',
        fontWeight: 'bold'
    }
});
