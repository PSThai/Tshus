import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";


interface ModalOptionsProps {
  visible: boolean;
  onClose: () => void;
}

const OptionsModal: React.FC<ModalOptionsProps> = ({ visible, onClose }) => {
  const nav = useNavigation();
  type NavType = {
    navigate: (screen: string) => void;
  }
  const gotoCreateGroup =(nav: NavType)=>{
    setModalVisible(false)
    nav.navigate("CreateGroup")
  }
  const [modalVisible, setModalVisible] = useState(false);
  const handleAddChat = () => {
    console.log("Thêm đoạn chat");

  };
  const handleCreateGroup = () => {
    setModalVisible(true);
  }
  const handleAddFriends = (nav: NavType) => {
    console.log("Thêm bạn bè");
    nav.navigate("Add_friend")

  };
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.modalItem} onPress={() =>handleAddFriends(nav)}>

            <Text>Thêm Bạn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem}>
            <Text>Tạo Đoạn Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={()=>gotoCreateGroup(nav)}>
            <Text>Tạo Nhóm Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={onClose}>
            <Text>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
      <OptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </Modal>

  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    marginTop: 45,
    marginLeft: 260,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 2,
    alignItems: "center",
    elevation: 5,
  },
  modalItem: {
    margin: 10,
  },
});

export default OptionsModal;
