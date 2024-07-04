import { Button, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from 'client/hooks/use-auth';
import { AuthHookType } from 'common/types/other/hook.type';
import { User } from 'common/interface/User';
import EditProfileModal from './modal/EditProfileModal';
import { logout } from 'client/context/auth/reducers';
import { TshusSocket } from 'common/types/other/socket.type';
import { useSocket } from 'common/hooks/use-socket';

const Profile = () => {
    // Auth
    const user: AuthHookType<User> = useAuth();

  const nav = useNavigation();
  // Socket
  const socket: TshusSocket = useSocket();

  const [nickname, setnickname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [phone, setphone] = React.useState("");
  const [gender, setgender] = React.useState("");

  type NavType = {
    navigate: (screen: string) => void;
  }
  const goToContact = (nav: NavType) => {
    nav.navigate("Contact");
  };

  const goToProfile = (nav: NavType) => {
    nav.navigate("Profile");
  };
  const [modalVisible, setModalVisible] = useState(false);

  const OpenModal = () => {
    setModalVisible(true); // Hiển thị modal khi nhấn vào nút "Thêm"
  };
  const onSave = () => {

  }
  const gotoChat = (nav: NavType) => {
    nav.navigate("Chat");
  }
  const handleSignOut = (nav: NavType) => {
    
    // Logout
    if (user?.set) {
      user.set(logout());

      // Socket
      socket?.disconnect();
    }
    nav.navigate("Login");
  }
  const onChange = () => {
    setgender(gender);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* - - - - - - - - - - Header - - - - - - - - - - - */}

      <View style={styles.header}>
        <LinearGradient
          colors={["#77caea", "#38A2CF", "#156DBA"]}
          start={[0, 0]}
          end={[1, 2]}
          style={styles.gradienthead}
        >
          {/* Back */}
          <Text style={{ marginTop: 42, fontWeight: 'bold', fontSize: 17, color: 'white', }}>Cá Nhân </Text>

        </LinearGradient>
      </View>

      {/*- - - - - - - - - Body - - - - - - - - -*/}
      <View style={styles.profileInfo}>

        <Image
          style={styles.avatar}
          source={{
            uri: "https://i.pinimg.com/564x/e6/eb/28/e6eb285f58d7b13a0974014ba87734dc.jpg",
          }}
        />
        <Text style={styles.username}>{user.get?.nickname}</Text>

      </View>

      <View style={{ flex: 3, paddingTop: 20 }}>
        <View style={{ backgroundColor: "#EFF0F2", width: "100%", height: 10 }} />
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderColor: "#EFF0F2", padding: 10 }}>
            <Text>Giới tính: </Text>
            <Text style={{ fontWeight: 'bold' }}>{user.get?.gender}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, borderBottomWidth: 1, padding: 10, borderColor: "#EFF0F2" }}>
            <Text>Email: </Text>
            <Text style={{ fontWeight: 'bold' }}>{user.get?.email}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, borderBottomWidth: 1, padding: 10, borderColor: "#EFF0F2" }}>
            <Text>Điện thoại: </Text>
            <Text style={{ fontWeight: 'bold' }}>{user.get?.phone}</Text>
          </View>

          <TouchableOpacity 
          style={{ alignItems: "center", 
          justifyContent: 'center', 
          paddingTop: 15, 
          flexDirection: "row", borderBottomWidth: 1,  borderColor: "#EFF0F2", paddingBottom:10 }} onPress={OpenModal}>

            <Image
              source={require('../../Images/edit_12000663.png')}
              style={{ height: 30, width: 30, resizeMode: 'cover' }}
            />
            <Text style={{
              textAlign: "center",
              fontSize: 17,
              fontWeight: "bold",
              paddingLeft: 5
            }}
            >Cập nhập thông tin</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          style={{ alignItems: "center", justifyContent: 'center', paddingTop: 15, flexDirection: "row" }}
          onPress={() => handleSignOut(nav)}
          >
            <Text style={{
              textAlign: "center",
              fontSize: 17,
              fontWeight: "bold",
              paddingLeft: 5,
              color:"red",
              fontStyle:'italic'
            }}>
              Đăng Xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {/* - - - - - - - - - - Footer - - - - - - - - - - - */}

      <View style={styles.footer}>
        <LinearGradient
          colors={["#77caea", "#38A2CF", "#156DBA"]}
          start={[0, 0]}
          end={[1, 2]}
          style={styles.gradient}
        >
          <TouchableOpacity style={styles.button} onPress={() => gotoChat(nav)}>
            <Image
              source={require("../../Images/chat.png")}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => goToContact(nav)}>
            <Image
              source={require("../../Images/contact.png")}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => goToProfile(nav)}>
            <Image
              source={require("../../Images/user.png")}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  // - - - - - - - - - - Header - - - - - - - - - -
  header: {
    overflow: "hidden",
    width: "100%",
    height: 110,
    paddingVertical: 10,
    position: "absolute",
    top: -10,
    justifyContent: 'center'
  },
  gradienthead: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 90,
  },
  headerIcon: {
    marginTop: 60,
    margin: 20,
    resizeMode: "contain",
    height: 25,
    width: 25,
  },
  addButton: {
    padding: 10,
  },
  // - - - - - - Modal - - - - - -
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "white",
  },

  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 30
  },
  // - - - - - - - - - - Body - - - - - - - - - -
  profileInfo: {
    flex: 1,
    alignItems: "center",
    paddingTop: 120
  },
  avatar: {
    borderWidth: 6,
    borderColor: "#1890FF",
    width: 120,
    height: 120,
    borderRadius: 80,
    marginBottom: 10,
  },
  username: {
    textAlign: "center",
    width: 200,
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  viewProfileButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    backgroundColor: "#1890FF",
    padding: 20,
    borderRadius: 100,
    margin: 10,
  },
  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1890FF",
    width: 200,
    padding: 20,
    borderRadius: 100,
    margin: 10,
  },
  bodyText: {
    color: "white",
    fontWeight: "bold",
  },
  // - - - - - - - - - - Footer - - - - - - - - - -
  footer: {
    overflow: "hidden",
    width: "100%",
    height: 110,
    position: "absolute",
    bottom: -10,
    paddingVertical: 10,
  },
  gradient: {
    flexDirection: "row",
    height: 100,
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footerText: {
    margin: 5,
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  footerIcon: {
    resizeMode: "contain",
    height: 32,
    width: 32,
  },
})
export default Profile