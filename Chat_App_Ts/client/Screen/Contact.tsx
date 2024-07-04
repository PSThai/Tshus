import { Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import OptionsModal from './modal/OptionsModal';
import { SearchBar } from 'antd-mobile';
import { fetcher } from 'common/utils/fetcher';
import { Response } from 'common/types/res/response.type';
import { useAuth } from 'client/hooks/use-auth';
import { ChaterType } from 'common/types/chat/chater.type';

const Contact = () => {
  const nav = useNavigation();
  // Auth
  const auth = useAuth();
  // List friends state
  const [friendsList, setFriendsList] = useState<any[]>([]);
  type NavType = {
    navigate: (screen: string) => void;
  }
  const goToContact = (nav: NavType) => {
    nav.navigate("Contact");
  };
  // Effect
  useEffect(() => {
    // Load friends
    (async () => {
      // Response
      const res: Response = await fetcher({
        method: 'GET',
        url: '/friends/page',
        payload: { user: auth?.get?._id },
      });

      if (res?.status === 200) {
        // Set data
        setFriendsList(res?.data);
      }

      // Return
    })();
  }, [auth?.get?._id]);
  const handleListAccept = (nav: NavType) => {

    nav.navigate("FriendAcceptList")

  }
  const goToProfile = (nav: NavType) => {
    nav.navigate("Profile");
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleAddButton = () => {
    setModalVisible(true); // Hiển thị modal khi nhấn vào nút "Thêm"
  };
  const gotoChat = (nav: NavType) => {
    nav.navigate("Chat");
  }

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
          <TouchableOpacity>
            <Image
              source={require("../../Images/search.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddButton}>
            <Image
              source={require("../../Images/plus.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <OptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {/* - - - - - - - - - - Body - - - - - - - - - - - */}
      <View style={styles.body}>
        <View style={{ paddingLeft: 20, borderBottomWidth: 1, borderColor: "#EFF0F2", paddingBottom: 10 }}>
          <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => handleListAccept(nav)}>
            <Image
              source={require("../../Images/people_1769041.png")}
              style={styles.footerIcon}
            />
            <Text style={{ fontSize: 20, paddingLeft: 10 }}>Lời mời kết bạn</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 20 }}>Danh sách bạn bè</Text>

        <View style={{ flexDirection: "row", justifyContent: "center", borderBottomColor: "#EFF0F2", borderBottomWidth: 3, paddingBottom: 10 }}>
          <TextInput placeholder='Tìm kiếm ...' style={{ backgroundColor: "#EFF0F2", height: 50, width: "80%" }} />
          <TouchableOpacity style={{ paddingTop: 10, paddingLeft: 10 }}>
            <Image
              source={require("../../Images/search_4687318.png")}
              style={{ height: 30, width: 30, paddingTop: 20 }}
            />
          </TouchableOpacity>
        </View>

        <View>
          {Array.from(Object.keys(friendsList))?.map((key: string, index: number) => (
            <View key={index}>
              <View  style={{ paddingLeft: 10, paddingTop: 20 }}>
                <Text>{key}</Text>
              </View>
              {friendsList?.[key as keyof typeof friendsList]?.map((friend: ChaterType) => (
                <TouchableOpacity key={friend.user}>
                  <View style={{ paddingLeft: 12, marginTop: 5, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: "gray" }}>
                    <Image
                      source={require('../../Images/male.png')}
                      style={{ height: 50, width: 50, resizeMode: 'cover', marginBottom: 10 }}
                    />
                    <Text style={{ paddingTop: 16, paddingLeft: 10, width: 100 }}>
                      {friend.nickname}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

            </View>
          ))}
        </View>
      </View>


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
    backgroundColor: "white",
  },
  // - - - - - - - - - - Header - - - - - - - - - -
  header: {
    overflow: "hidden",
    width: "100%",
    height: 110,
    paddingVertical: 10,
    position: "relative",
    top: -10,
  },
  gradienthead: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen mờ

  },
  modalView: {
    alignItems: "center",
    margin: 30,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    alignItems: "center",
    borderColor: "gray",
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  // - - - - - - - - - - Body - - - - - - - - - -
  body: {
    flex: 1,

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
export default Contact