import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { fetcher } from 'common/utils/fetcher';
import { Response } from 'common/types/res/response.type';
import authServices from "../context/auth/services"
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  OtpScreen: { email: string }; // Xác định kiểu dữ liệu của 'email' là string
  // Các màn hình khác...
};

type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

interface OtpScreenProps {
  route: OtpScreenRouteProp;
}

const Register: React.FC<OtpScreenProps> = ({ route }) => {

  const nav = useNavigation();
  const email = route.params?.email;
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [gender, setgender] = useState("");

  const handleSelectOption = (option: any) => {
    setgender(option);
  };
  const HandleRegister = async () => {

    if (!firstname || !lastname || !phone || !password || !gender || !retypePassword) {
      Toast.show({
        type: 'error',
        text1: "Đăng ký không thành công",
        text2: "Vui lòng nhập đầy đủ thông tin!",
        visibilityTime:1000
      })
    }
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

    if (!regex.test(password)) {
      Toast.show({
        type: 'error',
        text1: "Đăng ký không thành công",
        text2: "Mật khẩu phải bao gồm 8 chữ số, số, chữ hoa, chữ thường, kí tự đặc biệt!",
        visibilityTime:1000
      })
     
    }
    const regexPhone = /^0\d{9}$/

    if (!regexPhone.test(phone)) {
      Toast.show({
        type: 'error',
        text1: "Đăng ký không thành công",
        text2: "Số điện thoại phải có đủ 10 số và bắt đầu bằng 0",
        visibilityTime:1000
      })
    }

    const payload = {
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      email: email,
      password: password,
      gender: gender,
      retypePassword: retypePassword
    }

    const result = await authServices.register(payload);

    if (result) {
      Toast.show({
        type: 'success',
        text1: "Đăng ký thành công",
        text2: "Bạn đăng ký thành công !",
        visibilityTime:1000
      })
      goToChat(nav)
    }
  }

  type NavType = {
    navigate: (screen: string) => void;
  }

  const goToChat = async (nav: NavType) => {
    nav.navigate("Login")
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

        <View style={{ flex: 1, paddingTop: 150 }}>

          <Text style={{
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 55,
          }}>Đăng Ký</Text>

        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={{
              width: "40%",
              height: 55,
              backgroundColor: "#ced4da",
              borderRadius: 10,
              margin: 13,
              justifyContent: "center",
              padding: 20,
              marginBottom: 15
            }}

            value={firstname}
            onChangeText={(text) => setfirstname(text)}
            placeholder="First name"
            placeholderTextColor="gray"
          />
          <TextInput

            style={{
              width: "40%",
              height: 55,
              backgroundColor: "#ced4da",
              borderRadius: 10,
              margin: 13,
              justifyContent: "center",
              padding: 20,
              marginBottom: 15
            }}
            value={lastname}
            onChangeText={(text) => setlastname(text)}
            placeholder="last name"
            placeholderTextColor="gray"
          />
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#ced4da", borderRadius: 10, width: "85%" }}>
          <Text style={{ fontSize: 17, justifyContent: 'center', alignSelf: 'center', marginLeft: 12, }}>Giới tính:</Text>
          <TouchableOpacity style={styles.genderItem} onPress={() => handleSelectOption('MALE')}>
            <Text>{gender === 'MALE' ? '◉' : '◯'}</Text>
            <Text style={{ fontSize: 17, marginLeft: 5, color: "gray" }}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.genderItem} onPress={() => handleSelectOption('FEMALE')}>
            <Text>{gender === 'FEMALE' ? '◉' : '◯'}</Text>
            <Text style={{ fontSize: 17, marginLeft: 5, color: "gray" }}>Nữ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.genderItem} onPress={() => handleSelectOption('OTHER')}>
            <Text>{gender === 'OTHER' ? '◉' : '◯'}</Text>
            <Text style={{ fontSize: 17, marginLeft: 5, color: "gray" }}>Khác</Text>
          </TouchableOpacity>
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
          placeholder="Email"
          placeholderTextColor="gray"
          editable={false}
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
          value={phone}
          onChangeText={(text) => setPhone(text)}
          placeholder="Phone"
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
          placeholder="Mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry
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
          value={retypePassword}
          onChangeText={(text) => setRetypePassword(text)}
          placeholder="Nhập lại mựt khẩu"
          placeholderTextColor="gray"
          secureTextEntry
        />
        <TouchableOpacity
          onPress={(HandleRegister)}
          style={{
            width: "65%",
            height: 55,
            borderRadius: 20,
            backgroundColor: "#1890FF",
            alignItems: "center",
            justifyContent: "center",
            margin: 15,
          }}
        >
          <Text style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 20,
          }}>Đăng Ký</Text>
        </TouchableOpacity>
        <View style={{
          marginTop: 10,
          flexDirection: 'row',
        }}>
          <Text style={{}}>Bạn đã có tài khoản ? </Text>
          <TouchableOpacity onPress={() => (goToChat(nav))}>
            <Text style={{ color: "#3399FF" }}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

export default Register

const styles = StyleSheet.create({
  genderItem: {
    margin: 15,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  }
})